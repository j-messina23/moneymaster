import React, { useState } from 'react';

const VerificationPage = () => {
    const app_name = 'moneymaster20-004665ab8395'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  // Assuming you have a way to identify the user (e.g., userId from local storage, a global state, or passed as a query parameter)
  //const userData = JSON.parse(localStorage.getItem('user_data'));
  const username = localStorage.getItem('username'); // Example: getting userId stored in local storage

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerificationStatus('Verifying...'); 

    try {
      const response = await fetch(buildPath('api/verify-email-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, EmailVerificationCode: code }) 
      });

      console.log(username);
      console.log(code);
      const data = await response.json();
      if (response.ok) {
        setVerificationStatus('Verification successful!');
        localStorage.setItem('verificationSuccess', 'true');
        window.location.href = '/account';

      } else {
        setVerificationStatus(`Verification failed: ${data.message}`);
      }


    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('An error occurred during verification.');
    }






  };

  return (
    <div className="w-screen h-screen bg-teal-800 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-8">
        {/* Adjust the path to your logo as needed */}
        <img src="logo.png" alt="Logo" className="w-28 h-28" />
        <h1 className="text-white text-7xl font-extrabold ml-2 uppercase">Money Master</h1>
      </div>

      <div className="w-full max-w-md px-8 py-6 rounded-lg border-2 border-white flex flex-col items-center">
        <span className="text-white font-bold text-3xl uppercase mb-6">Enter Verification Code</span>
        <p className="text-white mb-6">Enter the 6-digit verification code we sent to your email.</p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            id="verificationCode"
            className="w-full mb-4 px-3 py-2 bg-transparent text-white border border-white rounded focus:outline-none focus:border-gray-300"
            placeholder="6-digit code"
            value={code}
            onChange={handleCodeChange}
            maxLength="6"
          />
          
          <button 
            type="submit"
            className="w-full bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-gray-200 mb-4"
          >
            Verify
          </button>
        </form>
        
        {verificationStatus && <div className={`mt-4 py-2 px-6 ${verificationStatus.startsWith('Verification failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded border`}>{verificationStatus}</div>}

      </div>
    </div>
  );
};

export default VerificationPage;