const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();




app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

/*
const MongoClient = require("mongodb").MongoClient;
const uri = 'mongodb+srv://le100900:wCqe5pUYV7GGTVGi@cluster0.l9zbhsz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri);

try
{
	client.connect(console.log("mongodb connected"));

	//listDatabases(client);
}
catch (e)
{
	console.error(e);
}
*/

//require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

// Register
app.post('/api/register', async (req, res, next) =>
{
	const { FirstName, LastName, Password, PhoneNumber, Email, Username} = req.body;
	const database = client.db("COP4331Bank").collection("Users");

	// Check if User already exists
	try
	{
		const checkUsername = await database.findOne({Username});

		if (checkUsername)
		{
            return res.status(400).json({ message: 'User ' + Username + ' already exists' });
        }
		

		// Salt and hash Password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(Password, salt);

        // email verification token + expiration
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = Date.now() + 3600000; // Code expires in 1 hour

        const newUser = {
            FirstName,
            LastName,
            Password: hashedPassword,
            PhoneNumber,
            Email,
            Username,
            IsEmailVerified: false,
            EmailVerificationCode: emailVerificationCode,
            CodeExpires: codeExpires
        };
	
		await database.insertOne(newUser);


        const transporter = nodemailer.createTransport({
	    service: "Gmail",
	    host: "smtp.gmail.com",
	    port: 465,
	    secure: true,
	    auth: {
	      user: "noreply.moneymaster@gmail.com",
	      pass: "ggmsvxhwpiiotfny",
	    },
	});

        const mailOptions = {
            from: 'moneymaster.com',
            to: Email,
            subject: 'Verify Your Email Address',
            html: `<p>Welcome to MoneyMaster! Please use the following code to verify your email address:</p>` +
            `<p><b>Verification Code: ${emailVerificationCode}</b></p>` +
            `<p>If you did not create an account, no further action is required.</p>`
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            res.json({ message: 'Verification email sent successfully. Please check your email to verify your account.' });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
        }

        var error = '';

	}
	catch(e)
	{
		error = e.toString();
	}
});

// VERIFY EMAIL 
app.post('/api/verify-email-code', async (req, res) => {
    const { Username, EmailVerificationCode } = req.body; 
    const database = client.db("COP4331Bank").collection("Users");

    console.log(Username);
    console.log(EmailVerificationCode);

    try {
        // Check if the user exists
        const user = await database.findOne({ Username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check code and expiration
        if (user.EmailVerificationCode === EmailVerificationCode && user.CodeExpires > Date.now()) {
            // Mark email as verified and clear the verification code fields
            const result = await database.updateOne({ Username }, {
                $set: { IsEmailVerified: true },
                $unset: { EmailVerificationCode: "", CodeExpires: "" }
            });

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: 'Failed to verify email' });
            }

            return res.status(200).json({ message: 'Email verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
});


// LOGIN
app.post('/api/login', async (req, res, next) =>
{

	try
	{
	        const { Username, Password } = req.body;
	        const database = client.db("COP4331Bank").collection("Users");
	
	        // Find user by Username
	        const results = await database.findOne({ Username });
	
	        if (!results || !(await bcrypt.compare(Password, results.Password)))
		{
	            return res.status(401).json({ error: "Invalid Username/Password" });
	        }

            if (!results.IsEmailVerified) {
                return res.status(403).json({ error: "Please verify your email before logging in." });
            }
	
	        const { _id, FirstName, LastName, Username: username } = results;
	
	        var ret = { ID: _id, FirstName: FirstName, LastName: LastName, Username: username, error: '' };
	        res.status(200).json(ret);
	}
	catch (error)
	{
        	res.status(500).json({ error: error.toString() });
	}
});



// SEARCH USERS
app.post('/api/searchUsers', async (req, res) => {
    const { SearchKey } = req.body;
    const database = client.db("COP4331Bank").collection("Users");

    try {
        const query = {
            $or: [
                { Username: { $regex: new RegExp(SearchKey, "i")}},
                { Email: { $regex: new RegExp(SearchKey, "i")}},
                { PhoneNumber: { $regex: new RegExp(SearchKey, "i")}},
				{ FirstName: {$regex: new RegExp(SearchKey, "i")}},
                { LastName: {$regex: new RegExp(SearchKey, "i")}}
            ]
        };

        const results = await database.find(query).toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



// UPDATE USER
app.put('/api/updateUser', async (req, res) => {
    const { FirstName, LastName, PhoneNumber, Email, Username } = req.body;
    const database = client.db("COP4331Bank").collection("Users");

    try {
        // Check if the user exists
        const existingUser = await database.findOne({ Username: Username });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information
        const updatedUser = {
            FirstName: FirstName || existingUser.FirstName,
            LastName: LastName || existingUser.LastName,
            PhoneNumber: PhoneNumber || existingUser.PhoneNumber,
            Email: Email || existingUser.Email,
        };

        // Perform the update
        const result = await database.updateOne({ Username: Username }, { $set: updatedUser });

        // Check if the update was successful
        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to update user' });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
});



// SEARCH CHECKING ACCOUNTS
app.post('/api/searchCheckingAccounts', async (req, res) => {
    const { SearchKey, UserID } = req.body;
    const database = client.db("COP4331Bank").collection("Checking Accounts");

    try {
        const query = {
            $and: [
                {UserID},
                {
                    $or: [
                        { AccountName: { $regex: new RegExp(SearchKey, "i")}},
                        { AccountValue: { $regex: new RegExp(SearchKey, "i")}},
                    ]
                }
            ]
        };

        const results = await database.find(query).toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



// SEARCH SAVINGS ACCOUNTS
app.post('/api/searchSavingsAccounts', async (req, res) => {
    const { SearchKey, UserID } = req.body;
    const database = client.db("COP4331Bank").collection("Savings Accounts");

    try {
        const query = {
            $and: [
                {UserID},
                {
                    $or: [
                        { AccountName: { $regex: new RegExp(SearchKey, "i")}},
                        { AccountValue: { $regex: new RegExp(SearchKey, "i")}},
                    ]
                }
            ]
        };

        const results = await database.find(query).toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



// SEARCH TRANSACTIONS
app.post('/api/searchTransactions', async (req, res) => {
	const { SearchKey, UserID } = req.body;
	const database = client.db("COP4331Bank").collection("Transactions");

	try {
		const query = {
			$and: [
				{UserID},
				{
					$or: [
						{TransactionType: {$regex: new RegExp(SearchKey, "i")}},
						{TransactionAmount: {$regex: new RegExp(SearchKey, "i")}},
						{AccountID: {$regex: new RegExp(SearchKey, "i")}}
					]
				}
			]
		};

		const results = await database.find(query).toArray();
		res.status(200).json(results);
	} catch (error) {
		res.status(500).json({ error: error.toString() });
	}
});




// CREATE CHECKING ACCOUNT
app.post('/api/createChecking', async (req, res) => {
    const { UserID } = req.body;
    const database = client.db("COP4331Bank").collection("Checking Accounts");

    try {
        const checkForChecking = await database.findOne({UserID});

        if (checkForChecking)
	    {
            return res.status(400).json({ message: 'User already has a checking account'});
        }

        const newAccount =
        {
            AccountName: "Checking Account",
            AccountValue: Math.floor(Math.random() * 1000) + 1,
            UserID: UserID
        };

        await database.insertOne(newAccount);
        var error = '';
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});



// CREATE SAVINGS ACCOUNT
app.post('/api/createSavings', async (req, res) => {
    const { UserID } = req.body;
    const database = client.db("COP4331Bank").collection("Savings Accounts");

    try {
        const newAccount =
        {
            AccountName: "Savings Account",
            AccountValue: Math.floor(Math.random() * 1000) + 1,
            UserID: UserID
        };

        await database.insertOne(newAccount);
        var error = '';
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});



// CHECK BALANCE
app.post('/api/checkBalance', async (req, res) => {
    try {
        const { AccountType, UserID } = req.body;
        if (AccountType === "Checking") {
            const database = client.db("COP4331Bank").collection("Checking Accounts");
            const checkingAccount = await database.findOne({ UserID });

            if (checkingAccount) {
                return res.status(200).json({ balance: checkingAccount.AccountValue });
            } else {
                return res.status(400).json({ message: 'No Checking Account for this User' });
            }
        } else if (AccountType === "Savings") {
            const database = client.db("COP4331Bank").collection("Savings Accounts");
            const savingsAccount = await database.findOne({ UserID });

            if (savingsAccount) {
                return res.status(200).json({ balance: savingsAccount.AccountValue });
            } else {
                return res.status(400).json({ message: 'No Savings Account for this User' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid Account type: only Checking or Savings' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



// TRANSFER MONEY USER -> USER
app.post('/api/transferMoney', async (req, res) => {
    const { UserID1, Username, Money } = req.body;
    const database = client.db("COP4331Bank").collection("Checking Accounts");
    const databaseU = client.db("COP4331Bank").collection("Users")
    const databaseT = client.db("COP4331Bank").collection("Transactions");

    // Getting date and time.
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    const dateStr = date + "/" + month + "/" + year;
    const timeStr = hours + ":" + minutes + ":" + seconds;

    try {
        const checkingAccount1 = await database.findOne({ UserID: UserID1 });
        const user = await databaseU.findOne({Username})

        if (!user) {
            return res.status(500).json({message: "User " + Username + " does not exist"})
        }

        const checkingAccount2 = await database.findOne({ UserID: "" + user._id });

        if (!checkingAccount1) {
            return res.status(500).json({ message: 'User2 missing checking account.'});
        }
        if (!checkingAccount2) {
            return res.status(500).json({ message: 'User2 missing checking account.' });
        }

        await database.updateOne(
            { UserID: UserID1 },
            { $inc: { AccountValue: -Money } }
        );

        await database.updateOne(
            { UserID: "" + user._id },
            { $inc: { AccountValue: +Money } }
        );

        const newTransaction1 = {
            TransactionType: "User -> User",
            TransactionAmount: "-"+Money,
            Date: dateStr,
            Time: timeStr,
            UserID: UserID1,
            AccountID: checkingAccount1._id
        };
    
        const newTransaction2 = {
            TransactionType: "User -> User",
            TransactionAmount: "+"+Money,
            Date: dateStr,
            Time: timeStr,
            UserID: user._id,
            AccountID: checkingAccount2._id
        };
    
        await databaseT.insertOne(newTransaction1);
        await databaseT.insertOne(newTransaction2);

        var error = '';
    } catch (e) {
        error = e.toString();
    }
    return res.status(200).json({ message: "Money sent to " + Username });
});



// TRANSFER MONEY ACCOUNT -> ACCOUNT
app.post('/api/transferMoneyAccount', async (req, res) => {
    const { UserID, Type, Money } = req.body;
    const database = client.db("COP4331Bank").collection("Checking Accounts");
    const database2 = client.db("COP4331Bank").collection("Savings Accounts");
    const databaseT = client.db("COP4331Bank").collection("Transactions");

    // Getting date and time.
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    
    const dateStr = date + "/" + month + "/" + year;
    const timeStr = hours + ":" + minutes + ":" + seconds;

    try {
        const account1 = await database.findOne({ UserID });
        const account2 = await database2.findOne({ UserID });

        if (!account1) {
            return res.status(500).json({ message: 'User2 missing checking account.'});
        }
        if (!account2) {
            return res.status(500).json({ message: 'User2 missing savings account.' });
        }

        // From Checking -> Savings
        if (Type == 1) {
            await database.updateOne(
                { UserID },
                { $inc: { AccountValue: -Money } }
            );
    
            await database2.updateOne(
                { UserID },
                { $inc: { AccountValue: +Money } }
            );
        // From Savings -> Checking
        } else if (Type == 2) {
            await database.updateOne(
                { UserID },
                { $inc: { AccountValue: +Money } }
            );
    
            await database2.updateOne(
                { UserID },
                { $inc: { AccountValue: -Money } }
            );
        }

        const newTransaction1 = {
            TransactionType: "Account -> Account",
            TransactionAmount: "-"+Money,
            Date: dateStr,
            Time: timeStr,
            UserID: UserID,
            AccountID: account1._id
        };
    
        const newTransaction2 = {
            TransactionType: "Account -> Account",
            TransactionAmount: "+"+Money,
            Date: dateStr,
            Time: timeStr,
            UserID: UserID,
            AccountID: account2._id
        };
    
        await databaseT.insertOne(newTransaction1);
        await databaseT.insertOne(newTransaction2);

        var error = '';
    } catch (e) {
        error = e.toString();
    }

    return res.status(200).json({ message: "Transfer Complete" });
});



// API endpoint to send an email
app.post('/api/forgotPasswordEmail', async (req, res) => {
    const { email } = req.body;
    const database = client.db("COP4331Bank").collection("Users");


    const user = await database.findOne({Email: email})
    console.log(email);

    // generates token
    const token = crypto.randomBytes(20).toString('hex');

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noreply.moneymaster@gmail.com",
          pass: "ggmsvxhwpiiotfny",
        },
    });
    // define email options
    const mailOptions = {
        from: 'moneymaster.com', // sender address
        to: email, // list of receivers
        subject: 'Password Reset Verification Code', // Subject line
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
        `<p>Please click on the following link, or paste this into your browser to complete the process:</p>` +
        `<a href="${resetPasswordUrl}">Reset Password</a>` +
        `<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };


    // verifies if email was sent 
    try {
        const updateResult = await database.updateOne(
            { Email: email },
            {
                $set: {
                    resetPasswordToken: token,
                    // TODO: add expiration
                }
            }
        );


        let info = await transporter.sendMail(mailOptions);
        res.json({ message: 'Verification email sent successfully.' });
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).json({ message: 'Failed to send verification code. Please try again later.' });
    }
});


// UPDATE PASSWORD
app.put('/api/updatePassword', async (req, res) => {
    const { Token, Password } = req.body;
    const database = client.db("COP4331Bank").collection("Users");

    try {
        const user = await database.findOne({
            resetPasswordToken:Token
        })
    
        if(!user){
            return res.status(404).json({message: 'Password reset token is invalid.'})
        }

        const hashedPassword = await bcrypt.hash(Password,10);

        // Update user information

        const result = await database.updateOne(
            { _id: user._id }, 
            {
                $set: { Password: hashedPassword },
                $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
            }
        );

        // Check if the update was successful
        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to reset password.' });
        }

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
});

app.use((req, res, next) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	);
	next();
});

app.listen(PORT, () =>
{
	console.log('Server listening on port ' + PORT);
});

// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
	// Set static folder
	app.use(express.static('frontend/build'));
	app.get('*', (req, res) =>
	{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
}

