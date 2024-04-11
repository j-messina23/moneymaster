import React, { useState } from 'react';

function SidePanel({ isPanelExpanded, togglePanel }) {

  const doLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem('user_data');
    window.location.href = '/';
  };

  return (
    <div className={`fixed inset-y-0 overflow-hidden z-50 ${isPanelExpanded ? 'w-1/4' : 'w-20'} transition-all duration-500 bg-[#008080] border-r border-gray-200 shadow-lg flex flex-col justify-between`}>
      
      <div>
      <div onClick={togglePanel} className="cursor-pointer flex items-center py-3">
        <img src="logo.png" alt="Logo" className="w-20 h-20" />
        
        {isPanelExpanded && <span className="text-white text-2xl font-bold ml-2">Money Master</span>}
      </div>
      
      {isPanelExpanded && (
        <div className='py-2'>
          <nav className="flex-grow">
            <ul>
              <li>
                <a href="/account" className="block text-white  text-3xl font-semibold py-2 px-4 hover:bg-[#99CC99]">Dashboard</a>
              </li>
              <li>
                <a href="/transfer" className="block text-white  text-3xl font-semibold py-2 px-4 hover:bg-[#99CC99]">Transfer</a>
              </li>
              <li>
                <a href="/profile" className="block text-white  text-3xl font-semibold py-2 px-4 hover:bg-[#99CC99]">User Account</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
      </div>

      {isPanelExpanded &&(          
        <div>
            <button onClick={doLogout} className="w-full py-3 bg-[#E9AD03] text-3xl text-teal-800 font-bold hover:bg-[#8A6807] focus:outline-none">
              Log out
            </button>
        </div>)}
    </div>
  );
}

export default SidePanel;
