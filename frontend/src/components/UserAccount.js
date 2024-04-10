import React, { useState, useEffect } from 'react';

function UserAccount({isPanelExpanded}) {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleEditProfile = () => {
        window.location.href = '/edit-profile';
    };

    useEffect(() => {
        const editSuccessful = localStorage.getItem('editSuccess');
        if (editSuccessful) {
            // Clear the localStorage item once retrieved
            localStorage.removeItem('editSuccess');
            setSuccessMessage('Your changes have been saved successfully!');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const storedUserData = JSON.parse(localStorage.getItem('user_data'));
            if (storedUserData && storedUserData.Username) {
                try {
                    const response = await fetch(buildPath('api/searchUsers'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ SearchKey: storedUserData.Username }),
                    });

                    if (!response.ok) {
                        throw new Error('Error fetching user data');
                    }

                    const data = await response.json();
                    setUserData(data[0]);
                } catch (error) {
                    setError('Error fetching user data');
                    console.error(error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex">
            <div className={`${isPanelExpanded ? 'w-1/3' : 'w-20'} transition-all duration-500`}>
                {/* Sidebar */}
                {/* Sidebar content goes here */}
            </div>
            <div className="w-full p-4">
                {/* Profile */}
                {userData ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-teal-800">Profile</h2>
                        <hr className="border-teal-800 mb-4" /> {/* Line under the profile title */}
                        {successMessage && (
                            <div className="bg-teal-800 text-white font-semibold px-4 py-2 mb-4 rounded" style={{ maxWidth: 'fit-content' }}>
                                {successMessage}
                            </div>
                        )}
                        <div className="flex items-center mb-4">
                            <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-teal-800 text-4xl font-bold mr-4">{userData.FirstName[0]}{userData.LastName[0]}</div>
                            <div>
                                <p className="text-2xl text-teal-800 font-bold">{userData.FirstName} {userData.LastName}</p>
                                <p className="text-teal-800">{userData.Username}</p>
                            </div>
                        </div>
                        {/* Contact Information */}
                        <h3 className="text-3xl font-bold mb-2 text-teal-800">Contact Information</h3>
                        <hr className="border-teal-800 mb-4" />
                        <p className="text-teal-800 font-bold">Phone: <span className="font-normal ml-1">{userData.PhoneNumber}</span></p>
                        <p className="text-teal-800 font-bold">Email: <span className="font-normal ml-1">{userData.Email}</span></p>
                        {/* Edit button */}
                        <button onClick={handleEditProfile} className="bg-teal-800 text-white py-2 px-4 mt-4 rounded hover:bg-teal-600">Edit</button>
                    </div>
                ) : (
                    <p className="text-teal-800">{error ? error : 'Loading...'}</p>
                )}
            </div>
        </div>
    );
}

export default UserAccount;
