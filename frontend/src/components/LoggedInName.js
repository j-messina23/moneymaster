import React from 'react';

function LoggedInName() {

  const userData = JSON.parse(localStorage.getItem('user_data'));

  if (!userData) {
    return <p>User data not found!</p>;
  }

  let userId = userData.ID;
  let firstName = userData.FirstName;
  let lastName = userData.LastName;

  

  const doLogout = event => {
    event.preventDefault();

    localStorage.removeItem("user_data")
    window.location.href = '/';

  };

  return (
    <div id="loggedInDiv">
      <h2 id="userName">Welcome {firstName} {lastName}!</h2><br />
      <button type="button" id="logoutButton" className="buttons"
        onClick={doLogout}> Log Out </button>
    </div>
  );
};

export default LoggedInName;