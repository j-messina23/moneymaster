import React, { useState } from 'react';

function ForgotPw() {
    const app_name = 'moneymaster22-267f3a958fc3'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // regular expression to validate email format
    const isValidEmailFormat = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };


    // handles email submission
    const submitText = async () => {
        if (isValidEmailFormat(email)) {
            try {
                const responses = await fetch(buildPath('api/searchUsers'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ SearchKey: email }),
                });
    
                const users = await responses.json();
                
                // check if any user matches the email
                if (users.length > 0) {
                    // user found, attempt to send a verification code via email



                    const emailResponse = await fetch(buildPath('api/forgotPasswordEmail'), { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email }),
                    
                    });


    
                    const emailData = await emailResponse.json();
                    if (emailResponse.ok) {
                        console.log("Verification email sent.");
                        setMessage('Verification code has been sent to your email.');
                    } else {
                        console.log("Failed to send verification email", emailData.message);
                        setMessage('Failed to send verification code. Please try again later.');
                    }
                } else {
                    // no user found with email
                    setMessage('No account found with that email. Please try again.');
                }
            } catch (error) {
                console.log("ERROR:", error);
                setMessage('An error occurred. Please try again later.');
            }
            // reset input
            setEmail('');
        } else {
            // invalid email message
            setMessage('Invalid email format. Please enter a valid email address.');
        }
    };
    

    return (
        <div className="w-screen h-screen bg-teal-800 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <img src="logo.png" alt="Logo" className="w-28 h-28" />
                <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight">Money Master</h1>
            </div>

            <div className="w-full max-w-md mt-8 px-8 py-6 rounded-lg border-2 border-white flex flex-col items-center">
                <span className="text-white font-bold text-3xl uppercase mb-6">Forgot Password</span>

                <p className="text-white mb-6">Enter your email, and we'll send you a verification code you can use to get back in your account.</p>
                
                <input
                    type="text"
                    id="verificationCode"
                    className="w-full mb-4 px-3 py-2 bg-transparent text-white border border-white rounded focus:outline-none focus:border-gray-300"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <button 
                    onClick={submitText}
                    className="w-full bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200 mb-4"
                >
                    Submit
                </button>
                
                {message && <div className={`mt-4 py-2 px-6 ${message.startsWith('No account') || message.startsWith('Invalid email') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded border`}>{message}</div>}

                <p className="text-white mt-6">Don't have an account? <button onClick={() => { window.location.href = "/register" }} className='text-white underline font-semibold'>Register</button></p>
            </div>
        </div>
    );
}

export default ForgotPw;
