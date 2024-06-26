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

            <form className="w-full max-w-md mt-8 px-8 py-6 rounded-lg border-2 border-white flex flex-col items-center" onSubmit={doReset}>
                <span className="text-white font-bold text-3xl uppercase mb-6">Reset Your Password</span>

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full mb-4 px-3 py-2 bg-transparent text-white border border-white rounded focus:outline-none focus:border-gray-300"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                />
                {passwordRequirements.length > 0 && (
                    <ul className="text-red-500 mb-4">
                        {passwordRequirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                )}
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full mb-4 px-3 py-2 bg-transparent text-white border border-white rounded focus:outline-none focus:border-gray-300"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                />
                {!passwordMatch && <p className="text-red-500 mb-4">* Passwords do not match</p>} {/* Display password match indication */}

                <button 
                    type="submit" 
                    className="w-full bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200"
                >
                    Change Password
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPw;
