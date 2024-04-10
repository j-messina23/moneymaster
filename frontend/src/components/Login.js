import React, { useState, useEffect } from 'react';

function Login() {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccessMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const registrationSuccess = localStorage.getItem('registrationSuccess');
        if (registrationSuccess) {https://webcourses.ucf.edu/courses/1444799/files/103336729?module_item_id=17631572#
            // Clear the localStorage item once retrieved
            localStorage.removeItem('registrationSuccess');
            //setSuccessMessage('Registration Successful! You can now login.');
        }
    }, []);

    const doLogin = async (event) => {
        event.preventDefault();

        try {
            const lowerCaseUsername = username.toLowerCase();

            const response = await fetch(buildPath('api/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: lowerCaseUsername,
                    Password: password,
                }),
            });

            if (!response.ok) {
                console.log('Login not successful');
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            localStorage.setItem('user_data', JSON.stringify(data));

            setLoggedIn(true);

            console.log('Login successful:', data);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loggedIn) {
        window.location.href = '/account';
    }

    return (
        <div className="w-screen h-screen bg-teal-800 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <img src="logo.png" alt="Logo" className="w-28 h-28" />
                <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight" >Money Master</h1>
            </div>

            {success && (
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{success}</span>
                </div>
            )}


            <div className="w-4/5 mt-8 max-w-md p-8 rounded-lg border-2 border-white flex flex-col justify-center">
                <div className="flex justify-center">
                    <span className="text-white font-bold text-3xl uppercase leading-tight">Login</span><br />
                </div>

                {error && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">{error}</span>
                    </div>
                )}

                <div class="w-full py-3">
                    <div class="relative w-full min-w-[200px] h-10">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                            placeholder=" "
                        />
                        <label
                            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Username
                        </label>
                    </div>
                </div>

                <div class="w-full py-3">
                    <div class="relative w-full min-w-[200px] h-10">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                            placeholder=" "
                        />
                        <label
                            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Password
                        </label>

                    </div>
                    <div className="w-full flex justify-end">
                        <a href="/forgotpw" className="text-white text-sm">Forgot Password?</a>
                    </div>
                </div>

                <button type="submit" onClick={doLogin} className="w-full bg-white text-teal-800 font-semibold py-2 px-4 mr-2 rounded hover:bg-gray-200">Login</button>

                <div className="flex justify-center py-3">
                    <p className="text-white">Not registered? <button onClick={() => { window.location.href = "/register" }} className='font-semibold'>Register</button></p>
                </div>

            </div>
        </div>
    );
};

export default Login;
