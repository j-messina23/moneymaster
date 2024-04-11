import React, { useState, useEffect } from 'react';

function EditProfile({isPanelExpanded}) {
    const app_name = 'moneymaster22-267f3a958fc3'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user data from localStorage
        const storedUserData = JSON.parse(localStorage.getItem('user_data'));
        if (storedUserData) {
            setUserData(storedUserData);
            setFirstName(storedUserData.FirstName);
            setLastName(storedUserData.LastName);
            // Fetch phone number and email using searchUser API
            fetchUserData(storedUserData.Username);
        }
    }, []);

    const fetchUserData = async (username) => {
        try {
            const response = await fetch(buildPath('api/searchUsers'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SearchKey: username,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            if (userData.length > 0) {
                const user = userData[0];
                setPhoneNumber(user.PhoneNumber);
                setEmail(user.Email);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(buildPath('api/updateUser'), {
                method: 'PUT', // Change method to PUT for updating user
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: userData.Username, // Add Username field to identify the user
                    FirstName: firstName,
                    LastName: lastName,
                    PhoneNumber: phoneNumber,
                    Email: email,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
    
            // Update user data in localStorage
            const updatedUserData = { ...userData, FirstName: firstName, LastName: lastName, PhoneNumber: phoneNumber, Email: email };
            localStorage.setItem('user_data', JSON.stringify(updatedUserData));
    
            localStorage.setItem('editSuccess', 'true');
            window.location.href = '/profile';
        } catch (error) {
            setError(error.message);
        }
    };
    

    const handleCancel = () => {
        window.location.href = '/profile';
    };

    return (
        <div className="flex">
            {/* The side panel takes w-1/3 when expanded and w-20 when collapsed*/}
            <div className={`${isPanelExpanded ? 'w-1/3' : 'w-20'} transition-all duration-500`}>
                {/* Sidebar */}
                {/* Sidebar content goes here */}
            </div>
            {/* The main compenent taking up w-full so the rest of the space  */}
            <div className="w-full p-4">
                <h2 className="text-4xl font-bold text-teal-800 mb-2">Edit Profile</h2>
                <hr className="border-teal-800 mb-4" />
                {userData && (
                    <div className="profile-info">
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-teal-800 font-bold mb-2">First Name</label>
                            <input id="firstName" 
                                type="text" 
                                value={firstName} 
                                className="appearance-none border border-teal-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setFirstName(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName"  className="block text-teal-800 font-bold mb-2">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="appearance-none border border-teal-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-teal-800 font-bold mb-2">Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="text"
                                className="appearance-none border border-teal-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-teal-800 font-bold mb-2">Email</label>
                            <input id="email"
                                type="email"
                                className="appearance-none border border-teal-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button onClick={handleSave} className="bg-teal-800 text-white py-2 px-4 mr-2 rounded hover:bg-teal-600">Save</button>
                        <button onClick={handleCancel} className="bg-teal-800 text-white py-2 px-4 rounded hover:bg-teal-600">Cancel</button>
                        {error && <p className="error text-teal-800">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
