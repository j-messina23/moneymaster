const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'elian10@ethereal.email',
                pass: 'GSz4RsgmFqGHWyYgBr'
            }
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
app.get('/api/checkBalance', async (req, res) => {
    // in progress
});



// TRANSFER MONEY
app.post('api/transferMoney', async (req, res) => {
    const {_id1, _id2, Money} = req.body;
    const database = client.db("COP4331Bank").collection("Checking Accounts");

    const checkingAccount1 = await database.findOne({_id});
    const checkingAccount2 = await database.findOne({_id2});

    if (checkingAccount1 && checkingAccount2)
    {
        checkingAccount1.AccountValue -= money;
        checkingAccount2.AccountValue += money;

        await database.updateOne({_id1: checkingAccount1._id1}, {$set: {AccountValue: checkingAccount1.AccountValue}});
        await database.updateOne({_id2: checkingAccount2._id2}, {$set: {AccountValue: checkingAccount2.AccountValue}});
        return res.status(400).json({ message: '$' + money + ' transfered.'});
    }
    else if (checkingAccount1)
    {
        return res.status(400).json({ message: 'Unable to transfer to null account.'});
    }

    return res.status(400).json({ message: 'Unable to transfer.'});
});


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'elian10@ethereal.email',
        pass: 'GSz4RsgmFqGHWyYgBr'
    }
});






// API endpoint to send an email
app.post('/api/forgotPasswordEmail', async (req, res) => {
    const { email } = req.body;
    const database = client.db("COP4331Bank").collection("Users");


    const user = await database.findOne({Email: email})
    console.log(email);

    // generates token
    const token = crypto.randomBytes(20).toString('hex');

    // define email options
    const mailOptions = {
        from: 'moneymaster.com', // sender address
        to: email, // list of receivers
        subject: 'Password Reset Verification Code', // Subject line
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
        `<p>Please click on the following link, or paste this into your browser to complete the process:</p>` +
        `<a href="http://localhost:3000/resetpw?token=${token}">Reset Password</a>` +
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

app.listen(5000); // start Node + Express server on port 5000

