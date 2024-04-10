import React, { useState } from 'react';

const app_name = 'moneymaster22-267f3a958fc3';

function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
        return 'http://localhost:5000/' + route;
    }
}

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([]);
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

    const doRegister = async (event) => {
        event.preventDefault();

        try {
            setError('');
            
            // Validate all fields
            if (!firstName || !lastName || !username || !phoneNumber || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            // Validate email and phone number format
            const emailPattern = /.+@.+\..+/;
            const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
            if (!emailPattern.test(email)) {
                throw new Error('Invalid email format');
            }
            if (!phonePattern.test(phoneNumber)) {
                throw new Error('Invalid phone number format (XXX-XXX-XXXX)');
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

            // Convert username to lowercase
            const lowerCaseUsername = username.toLowerCase();

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
            window.location.href = '/login';
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form id="registerDiv">
            <div>
                <span id="inner-title">Register</span><br />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required /><br />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required /><br />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required /><br />
                <input
                    type="tel"
                    placeholder="Phone Number (XXX-XXX-XXXX)"
                    pattern="\d{3}-\d{3}-\d{4}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required /><br />
                <input
                    type="email"
                    placeholder="Email (JaneDoe@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required /><br />
                {passwordRequirements.length > 0 && (
                    <ul>
                        {passwordRequirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                )}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e)}
                    required /><br />
                {!passwordMatch && <p>* Passwords do not match</p>} {/* Display password match indication */}
                <button type="submit" onClick={doRegister}>Register</button>
            </div>
            {error && <p>{error}</p>}
            <p>Already have an account? <button onClick={() => { window.location.href = "/login" }}>Login</button></p>
        </form>
    );
};

export default Register;
