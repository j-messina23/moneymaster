import React, { useState, useEffect } from 'react'

function Accounts({isPanelExpanded}) {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const userData = JSON.parse(localStorage.getItem('user_data'));
    console.log(userData)

    const UserID = userData.ID
    const last4uid = UserID.substring((UserID.length) - 4)
    const cuid = "*****C".concat(last4uid)
    const suid = "*****S".concat(last4uid)
    console.log(cuid)
    console.log(suid)

    const [CheckingAccountValue, SetCAV] = useState('');
    const [SavingsAccountValue, SetSAV] = useState('');

    useEffect(() => {
        const LoadChecking = async event => {
            let objC = { "SearchKey": "C", "UserID": UserID };
            let jsC = JSON.stringify(objC);
            try {
                const response = await
                    fetch(buildPath('api/searchCheckingAccounts'),
                        {
                            method: 'POST', body: jsC, headers: {
                                'Content-Type':
                                    'application/json'
                            }
                        });
                let txt = await response.text();
                let res = JSON.parse(txt);
                console.log('Checking Account Found');
                SetCAV(res[0].AccountValue);
                console.log(CheckingAccountValue);
            }
            catch (e) {
                console.log(e.toString());
            }
        }

        const LoadSavings = async event => {
            let objS = { "SearchKey": "S", "UserID": UserID };
            let jsS = JSON.stringify(objS);
            try {
                const response = await
                    fetch(buildPath('searchSavingsAccounts'),
                        {
                            method: 'POST', body: jsS, headers: {
                                'Content-Type':
                                    'application/json'
                            }
                        });
                let txt = await response.text();
                let res = JSON.parse(txt);
                console.log('Savings Account Found');
                SetSAV(res[0].AccountValue);
                console.log(SavingsAccountValue)
            }
            catch (e) {
                console.log(e.toString())
            }
        };
        LoadChecking()
        LoadSavings()
    });

    function checkingClick() {
        localStorage.setItem('AccountInfo', JSON.stringify({ "AccountType": "C", "cuid": cuid }))
        window.location.href = '/history'
    }

    function savingsClick() {
        localStorage.setItem('AccountInfo', JSON.stringify({ "AccountType": "S", "suid": suid }))
        window.location.href = '/history'
    }

    return (
        <div className='flex'>
            <div className={`${isPanelExpanded ? 'w-1/3' : 'w-20'} transition-all duration-500`}>
                {/* Sidebar */}
                {/* Sidebar content goes here */}
            </div>

        <div className="w-full h-screen bg-teal-800 flex flex-col items-center justify-evenly">
            <div className="flex items-center justify-center">
                <img src="logo.png" alt="Logo" className="w-28 h-28" />
                <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight" >Money Master</h1>
            </div>
            <div class="w-3/6 outline rounded outline-offset-8 outline-white" onClick={checkingClick}>
                <div className="flex justify-between text-white font-bold text-3xl uppercase leading-tight">
                    <p>Checking Account</p>
                    <p>{cuid}</p>
                </div>
                <p>Amount: ${CheckingAccountValue}</p>
                <p class="w-9/10 outline rounded outline-offset-0">Daily Transfer Limit: $500.00</p>
            </div>
            <div class="w-3/6 outline rounded outline-offset-8 outline-white" onClick={savingsClick}>
                <div className="flex justify-between text-white font-bold text-3xl uppercase leading-tight">
                    <p>Savings Account</p>
                    <p>{suid}</p>
                </div>
                <p>Amount: ${SavingsAccountValue}</p>
                <p>Interest Rate: 6%</p>
            </div>
        </div>
        </div>
    );
}

export default Accounts;