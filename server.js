const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");
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

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();



// REGISTER
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


		const newUser = {
				FirstName: FirstName,
				LastName: LastName,
				Password: hashedPassword,
				PhoneNumber: PhoneNumber,
				Email: Email,
				Username: Username
			};
	
		await database.insertOne(newUser);
	
	
		var error = '';

	}
	catch(e)
	{
		error = e.toString();
	}
	var ret = { message: "user Registered" };
	res.status(200).json(ret);
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
	
			const { _id, FirstName, LastName } = results;
	
			var ret = { ID: _id, FirstName: FirstName, LastName: LastName, error: '' };
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

		if (checkForChecking){
			return res.status(400).json({ message: 'User already has a checking account'});
		}

		const newAccount ={
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
		const checkForChecking = await database.findOne({UserID});

		if (checkForChecking) {
			return res.status(400).json({ message: 'User already has a savings account'});
		}

		const newAccount = {
			AccountName: "Savings Account",
			AccountValue: Math.floor(Math.random() * 1000) + 1,
			UserID: UserID
		};

		await database.insertOne(newAccount);
		var error = '';
	}
	catch(e){
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
	const { UserID1, UserID2, Money } = req.body;
	const database = client.db("COP4331Bank").collection("Checking Accounts");
	const databaseT = client.db("COP4331Bank").collection("Transactions");

	try {
		const checkingAccount1 = await database.findOne({ UserID: UserID1 });
		const checkingAccount2 = await database.findOne({ UserID: UserID2 });

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
			{ UserID: UserID2 },
			{ $inc: { AccountValue: +Money } }
		);

		const newTransaction1 ={
			TransactionType: "User -> User",
			TransactionAmount: "-"+Money,
			UserID: UserID1,
			AccountID: checkingAccount1._id
		};
	
		const newTransaction2 ={
			TransactionType: "User -> User",
			TransactionAmount: "+"+Money,
			UserID: UserID2,
			AccountID: checkingAccount2._id
		};
	
		await databaseT.insertOne(newTransaction1);
		await databaseT.insertOne(newTransaction2);

		var error = '';
	} catch (e) {
		error = e.toString();
	}
	return res.status(200).json({ _id: UserID2 });
});



// TRANSFER MONEY ACCOUNT -> ACCOUNT
app.post('/api/transferMoneyAccount', async (req, res) => {
	const { UserID, Type, Money } = req.body;
	const database = client.db("COP4331Bank").collection("Checking Accounts");
	const database2 = client.db("COP4331Bank").collection("Savings Accounts");
	const databaseT = client.db("COP4331Bank").collection("Transactions");

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

		const newTransaction1 ={
			TransactionType: "Account -> Account",
			TransactionAmount: "-"+Money,
			UserID: UserID,
			AccountID: account1._id
		};
	
		const newTransaction2 ={
			TransactionType: "Account -> Account",
			TransactionAmount: "+"+Money,
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

///////////////////////////////////////////////////
// For Heroku deployment
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
