import React, { useState, useEffect } from 'react'

function AccountHistory({ isPanelExpanded }) {
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
    const AccountInfo = JSON.parse(localStorage.getItem('AccountInfo'));
    //console.log(AccountInfo)
    const [transactions, setTransactions] = useState([])
    const UserID = userData.ID
    const AccountType = AccountInfo.AccountType
    const [HiddenID, SetHiddenID] = useState('')

    useEffect(() => {
        if (AccountType === "C") {
            SetHiddenID(AccountInfo.cuid)
        } else if (AccountType === "S") {
            SetHiddenID(AccountInfo.suid)
        }
    }, [])

    useEffect(() => {
        const LoadHistory = async event => {
            let obj = { "SearchKey": AccountType, "UserID": UserID };
            let js = JSON.stringify(obj);
            try {
                const response = await
                    fetch(buildPath('api/searchTransactions'),
                        {
                            method: 'POST', body: js, headers: {
                                'Content-Type':
                                    'application/json'
                            }
                        });
                let txt = await response.text();
                let res = JSON.parse(txt);
                //console.log(res.length)
                let historyLength = res.length
                console.log(historyLength);
                let transArray = res.map(obj => Object.values(obj))
                setTransactions(transArray)
                console.log(transArray)
            }
            catch (e) {
                console.log(e)
            }
        };
        LoadHistory()
    }, [])

    function AccountsHref() {
        window.location.href = '/account'
    }

    return (
        <div className='flex'>
            <div className={`${isPanelExpanded ? 'w-1/3' : 'w-20'} transition-all duration-500`}>
                {/* Sidebar */}
                {/* Sidebar content goes here */}
            </div>

            <div className="w-full h-screen bg-teal-800 text-white flex flex-col items-center justify-evenly">
                <div className="flex items-center justify-center">
                    <img src="logo.png" alt="Logo" className="w-28 h-28" />
                    <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight" >Money Master</h1>
                </div>
                <div className="w-3/6 h-4/6 outline rounded outline-offset-4 outline-white">
                    <div className="flex justify-center text-white font-bold text-3xl uppercase leading-tight">
                        <p>Transaction History {HiddenID}</p>
                    </div>
                    <div className="w-5/6 h-5/6 flex-col items-center justify-evenly overflow-y-auto">
                        {transactions.map((item, index) => (
                            <div key={index} className="outline rounded outline-black">
                                <p>Transaction ID: {item[0]}</p>
                                <p>Transaction Type: {item[1]}</p>
                                <p>Amount: {item[2]}{item[2].charAt(0)}</p>
                                <p>{item[3]}</p>
                                <p>{item[4]}</p>
                                <p>{item[5]}</p>
                                <p>{item[6]}</p>
                                <p>{item[7]}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <button onClick={AccountsHref} className="w-3/6 items-center bottom-0 bg-white text-teal-800 font-semibold py-2 px-4 mr-2 rounded hover:bg-gray-200">Back To Accounts</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountHistory