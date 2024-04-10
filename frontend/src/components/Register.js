import React, { useState } from 'react';

function Register() {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState('');

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
            requirements.push('Password must contain at least one special chracter, e.g.,@,$,!,%,*,?,&');
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

    const validateInput = () => {
        const errors = [];

        // Validate all fields
        if (!firstName || !lastName || !username || !phoneNumber || !email || !password || !confirmPassword) {
            errors.push('All fields are required');
        }

        // Validate email and phone number format
        const emailPattern = /.+@.+\..+/;
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!emailPattern.test(email)) {
            errors.push('Invalid email format');
        }
        if (!phonePattern.test(phoneNumber)) {
            errors.push('Invalid phone number format (XXX-XXX-XXXX)');
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.push('Password must meet all requirements');
        }

        // Basic validation for password match
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const doRegister = async (event) => {
        event.preventDefault();

        const isValid = validateInput();
        if(!isValid){
            return;
        }

        try {
            setError('');

            // Convert username to lowercase
            const lowerCaseUsername = username.toLowerCase();
            localStorage.setItem('username', lowerCaseUsername);

            // Send registration request
            const response = await fetch(buildPath('api/register'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    FirstName: firstName,
                    LastName: lastName,
                    Username: lowerCaseUsername,
                    PhoneNumber: phoneNumber,
                    Email: email,
                    Password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }


            localStorage.setItem('registrationSuccess', 'true');
            window.location.href = '/verification';
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="w-screem h-max bg-teal-800 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <img src="logo.png" alt="Logo" className="w-28 h-28" />
                <h1 className="text-white text-7xl font-extrabold ml-2 uppercase leading-tight" >Money Master</h1>
            </div>

            <div className="p-8 mb-6 rounded-lg border-2 border-white flex flex-col justify-center">

                <div className="flex justify-center">
                    <span className="text-white font-bold text-3xl uppercase leading-tight">Register</span>
                </div>

                {error && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">{error}</span>
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span class="sr-only">Danger</span>
                        <div>
                            <span class="font-medium">Ensure that these requirements are met:</span>
                            <ul class="mt-1.5 list-disc list-inside">
                                {validationErrors.map((requirement, index) => (
                                    <li key={index}>{requirement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    )}

                    <div className="flex item-center justify-center">
                        <div class="w-full py-3 pr-3">
                            <div class="relative w-full min-w-[300px] h-10">
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                htmlFor='firstName'
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">First Name
                                </label>
                            </div>
                        </div>

                        <div class="w-full py-3 pl-3">
                            <div class="relative w-full min-w-[300px] h-10">
                                <input
                                id='lastName'
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                htmlFor='lastName'
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Last Name
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div class="w-full py-3 pr-3">
                            <div class="relative w-full min-w-[300px] h-10">
                                <input
                                id='phoneNumber'
                                    type="tel"
                                    pattern="\d{3}-\d{3}-\d{4}"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                htmlFor='phoneNumber'
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Phone Number (XXX-XXX-XXXX)
                                </label>
                            </div>
                        </div>

                        <div class="w-full py-3 pl-3">
                            <div class="relative w-full min-w-[300px] h-10">
                                <input
                                id='email'
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                    placeholder=" "
                                />
                                <label
                                htmlFor='email'
                                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Email (JaneDoe@example.com)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="w-full py-3">
                        <div class="relative w-full min-w-[300px] h-10">
                            <input
                            id='username'
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                placeholder=" "
                            />
                            <label
                            htmlFor='username'
                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Username
                            </label>
                        </div>
                    </div>

                    <div class="w-full py-3">
                        <div class="relative w-full min-w-[300px] h-10">
                            <input
                            id='password'
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                placeholder=" "
                            />
                            <label
                            htmlFor='password'
                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Password
                            </label>
                        </div>
                    </div>


                    {passwordRequirements.length > 0 && (
                        <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span class="sr-only">Danger</span>
                            <div>
                                <span class="font-medium">Password must meet these requirements:</span>
                                <ul class="mt-1.5 list-disc list-inside">
                                    {passwordRequirements.map((requirement, index) => (
                                        <li key={index}>{requirement}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div class="w-full py-3">
                        <div class="relative w-full min-w-[300px] h-10">
                            <input
                            id='confirmPassword'
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => handleConfirmPasswordChange(e)}
                                className="peer w-full h-full bg-transparent text-white font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-white"
                                placeholder=" "
                            />
                            <label
                            htmlFor='confirmPassword'
                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-blue-gray-200 peer-focus:before:!border-white after:border-blue-gray-200 peer-focus:after:!border-white">Confirm Password
                            </label>
                        </div>
                    </div>
                    {!passwordMatch && (
                            <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span class="sr-only">Danger</span>
                                <div>
                                    <span class="font-medium">Passwords do not match.</span>
                                </div>
                            </div>)} 

                    <button type="submit" onClick={doRegister} className="w-full bg-white text-teal-800 font-semibold py-2 px-4 mr-2 rounded hover:bg-gray-200">Register</button>

                    <div className="flex justify-center py-3">
                        <p className="text-white">Already have an account? <button onClick={() => { window.location.href = "/" }} className='font-semibold'>Login</button></p>
                    </div>

            </div>
        </div>
    );
};

export default Register;