import React from 'react';

function LoggedIn()
{

    const addAccount = async event => 
    {
	    event.preventDefault();

	    //alert('addAccount()');

    };


    return(
      <div id="accessUIDiv">
       <button type="button" id="addAccountButton" class="buttons" 
          onClick={addAccount}> Add Account </button><br />
       <span id="accountAddResult"></span>
     </div>
    );
}

export default LoggedIn;
