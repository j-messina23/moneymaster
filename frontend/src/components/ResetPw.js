import React, { useState,useEffect } from 'react';

function ResetPw() {
    const app_name = 'moneymaster22-267f3a958fc3'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState(null); 
    const [passwordRequirements, setPasswordRequirements] = useState([]);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const urlToken = queryParams.get('token');
      if (urlToken) {
          setToken(urlToken);
      } else {
          setError('Error: Token is missing.');
      }
    }, []);

    const validatePassword = (value) => {
        const requirements = [];
        if (value.length < 8) {
            requirements.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(value)) {
            requirements.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
            requirements.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(value)) {
            requirements.push('Password must contain at least one number');
        }
        if (!/[@$!%*?&]/.test(value)) {
            requirements.push('Password must contain at least one symbol');
        }
        setPasswordRequirements(requirements);
    };
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
        // Check if passwords match
        setPasswordMatch(newPassword === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        // Check if passwords match
        setPasswordMatch(password === newConfirmPassword);
    };

    const handlePasswordBlur = () => {
        setPasswordRequirements([]);
    };

    const doReset = async (event) => {
        event.preventDefault();

        try {
            setError('');
            
            // Validate all fields
            if (!password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            // Validate password complexity
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                throw new Error('Password must meet all requirements');
            }

            // Basic validation for password match
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }


            // Send registration request
            const response = await fetch(buildPath('api/updatePassword'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  Token: token,
                  Password: password,
                }),
            });

            if (response.ok) {
              localStorage.setItem('passwordResetSuccess', 'true'); 
              window.location.href = '/login';
              setMessage('Verification code has been sent to your email.');

              
          } else {
              const errorData = await response.json();
              throw new Error(errorData.message);
          }


            console.log('Password has been successfully reset.')
            window.location.href = '/login';
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="w-screen h-screen bg-teal-800 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <img src="logo.png" alt="Logo" className="w-28 h-28" />
                <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight">Money Master</h1>            
            </div>

            <div className="p-8 mb-6 rounded-lg border-2 border-white flex flex-col justify-center">
                <div className="flex justify-center">
                    <span className="text-white font-bold text-3xl uppercase leading-tight">Reset Your Password</span>
                </div>

                {/* Password input field */}
                <div className="w-full py-3">
                    <div className="relative">
                        <input
                            id='password'
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            className="peer w-full h-10 bg-transparent text-white text-lg font-normal outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white border-b-2 border-white focus:border-white px-3 py-2.5 rounded"
                            placeholder=" "
                            required
                        />
                        <label htmlFor='password' className="absolute left-0 -top-3.5 text-white text-lg">Password</label>
                    </div>
                </div>

                {/* ...password requirements and confirm password input field... */}

                {/* Passwords do not match message */}
                {!passwordMatch && (
                    <div className="text-red-700 bg-red-100 border-l-4 border-red-500 p-4 rounded relative" role="alert">
                        <span>Passwords do not match.</span>
                    </div>
                )}

                {/* Submit button */}
                <button type="submit" className="w-full bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200">Change Password</button>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPw;
