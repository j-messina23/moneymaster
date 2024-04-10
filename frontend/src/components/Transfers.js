import React, { useState } from 'react';
import Select from 'react-select';

function Transfers({isPanelExpanded}) {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [transferTarget, setTransferTarget] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [balanceValid, setBalanceValid] = useState('');
    const [transferAccountType, setAccountType] = useState('1');
    const [switchForms, setForm] = useState('True');

    const userData = JSON.parse(localStorage.getItem('user_data'));
    console.log(userData)
    const UserID = userData.ID

    const selectForm = () => {
        setForm(!switchForms)
    }

    const handleChange = (option) => {
        setAccountType(option)
        console.log(transferAccountType)
    }

    const options = [
        { value: 1, label: "From Checking, To Savings" },
        { value: 2, label: "From Savings, to Checking" }
    ]

    const CompleteTransfer = async event => {
        event.preventDefault();
        let obj = { "UserID1": UserID, "Username": transferTarget, "Money": transferAmount };
        let js = JSON.stringify(obj);
        try {
            const response = await
                fetch(buildPath('api/transferMoney'),
                    {
                        method: 'POST', body: js, headers: {
                            'Content-Type':
                                'application/json'
                        }
                    });
            let txt = await response.text();
            let res = JSON.parse(txt);
            console.log(res);
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    const CheckTransferValidity = async event => {
        event.preventDefault();
        let obj = { "AccountType": "Checking", "UserID": UserID };
        let js = JSON.stringify(obj);
        try {
            const response = await
                fetch(buildPath('api/checkBalance'),
                    {
                        method: 'POST', body: js, headers: {
                            'Content-Type':
                                'application/json'
                        }
                    });
            let txt = await response.text();
            let res = JSON.parse(txt);
            console.log(res.balance);
            if (transferAmount <= res.balance) {
                setBalanceValid('True');
                console.log('Balance valid.')
            } else {
                setBalanceValid('False')
                console.log('Balance invalid.')
            }
        }
        catch (e) {
            console.log(e.toString());
        }
        if (balanceValid === 'True') {
            CompleteTransfer(event);
        }
    };

    const TransferUser = async event => {
        event.preventDefault();
        setAccountType(document.getElementById("selectAccount").value)
        console.log(transferAccountType)
        console.log(transferAmount)
        let obj = { "UserID": UserID, "Type": transferAccountType, "Money": transferAmount };
        let js = JSON.stringify(obj);
        try {
            const response = await
                fetch(buildPath('api/transferMoneyAccount'),
                    {
                        method: 'POST', body: js, headers: {
                            'Content-Type':
                                'application/json'
                        }
                    });
            let txt = await response.text();
            let res = JSON.parse(txt);
            console.log(res)
        }
        catch (e) {
            console.log(e.toString())
        }
    }

    function AccountsHref() {
        window.location.href = '/account'
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
                    <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight">Money Master</h1>
                </div>
                <div className="w-3/6 h-3/6 outline rounded outline-offset-4 outline-white">
                    <button onClick={selectForm} className="bg-white text-teal-800 font-semibold py-2 px-4 mr-2 rounded hover:bg-gray-200 items-center justify-center">Toggle Form</button>
                    {switchForms ? (
                        <div className="space-y-3">
                            <div className="relative w-full min-w-[200px] h-10">
                                <input
                                    value={transferTarget}
                                    onChange={e => setTransferTarget(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Username
                                </label>
                            </div>
                            <div className="relative w-full min-w-[200px] h-10">
                                <input
                                    value={transferAmount}
                                    onChange={e => setTransferAmount(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Amount
                                </label>
                                <div className="w-fullitems-center flex justify-evenly">
                                    <button onClick={CheckTransferValidity} className="w-2/5 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200">Send</button>
                                    <button onClick={AccountsHref} className="w-2/5 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200">Back To Accounts</button>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div>
                            <div className="space-y-3">
                                <div className="relative w-full min-w-[200px] h-10">
                                    <Select id="selectAccount"
                                        options={options}
                                        onChange={handleChange}
                                        defaultValue={options[0]}
                                    />
                                </div>
                                <div className="relative w-full min-w-[200px] h-10">
                                    <input
                                        value={transferAmount}
                                        onChange={e => setTransferAmount(e.target.value)}
                                        className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                        placeholder=" "
                                    />
                                    <label
                                        className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Amount
                                    </label>
                                </div>
                            </div>
                            <div className="w-fullitems-center flex justify-evenly">
                                <button onClick={TransferUser} className="w-2/5 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200">Send</button>
                                <button onClick={AccountsHref} className="w-2/5 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200">Back To Accounts</button>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
};

export default Transfers;