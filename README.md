# MoneyMaster
We are MoneyMaster and we are the best company for storing and helping you
 manage your (FAKE) money!

## Connect to local server:
In Ubuntu
    git/MERN_Team_20: sudo npm start

In Postman
    http://localhost:5000/api/<api>

SwaggerHub
    https://app.swaggerhub.com/apis/Kylee-92e/moneyMaster/1.0.0

## API
### Register
POST http://localhost:5000/api/register

application/json

{
  "FirstName": "Rick",
  "LastName": "Leinecker",
  "Password": "COP4331",
  "PhoneNumber": "4076001234",
  "Email": "RickL@ucf.edu",
  "Username": "RickL"
}

### Login
POST http://localhost:5000/api/login

application/json

{
  "Username": "RickL",
  "Password": "COP4331"
}

### Search Users
POST http://localhost:5000/api/searchUsers

application/json

{
    "SearchKey": "RickL"
}

### Edit User
PUT http://localhost:5000/api/updateUser

{
    "FirstName":"kylee",
    "LastName":"weener",
    "PhoneNumber":"",
    "Email":"k@aol.com",
    "Username":"Kweener"
}

### Search Checking Accounts
POST http://localhost:5000/api/searchCheckingAccounts

application/json

{
    "SearchKey": "C",
    "UserID": "660ada17b519fd0339d106b3"
}

### Search Savings Accounts
POST http://localhost:5000/api/searchSavingsAccounts

application/json

{
    "SearchKey": "S",
    "UserID": "660ada17b519fd0339d106b3"
}

### Search Transactions
POST http://localhost:5000/api/searchTransactions

application/json

{
    "UserID": "660ada17b519fd0339d106b3"
}

### CREATE CHECKING ACCOUNT
POST http://localhost:5000/api/createChecking

application/json

{
    "UserID": "660ada17b519fd0339d106b3"
}

### CREATE SAVINGS ACCOUNT
POST http://localhost:5000/api/createSavings

application/json

{
    "UserID": "660ada17b519fd0339d106b3"
}

### CHECK BALANCE
POST http://localhost:5000/api/checkBalance

application/json

{
    "AccountType": "Savings",
    "UserID": "660ada17b519fd0339d106b3"
}

### TRANSFER MONEY USER -> USER
# This will transfer the money and add a transfer to the database.
POST http://localhost:5000/api/transferMoney

application/json

{
    "UserID1": "660ada17b519fd0339d106b3",       // ID of who is sending money
    "UserID2": "660afe5d252908ef4e28e49a",       // ID of who is recieving money
    "Money": "10"
}

### TRANSFER MONEY ACCOUNT -> ACCOUNT
# This will transfer the money and add a transfer to the database.
POST http://localhost:5000/api/transferMoneyAccount

application/json

"Type" can be 1 or 2 no ""s.
1: Transfers from the User's Checking -> Savings
2: Transfers from the User's Savings -> Checking

{
    "UserID": "660ada17b519fd0339d106b3",
    "Type": 1,
    "Money": 10
}
