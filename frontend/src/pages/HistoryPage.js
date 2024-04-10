import React, { useState } from 'react';
import AccountHistory from '../components/AccountHistory';
import SidePanel from '../components/SidePanel';

function HistoryPage()
{
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);

    const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded);
    };

    return(
        <div>
            <SidePanel isPanelExpanded={isPanelExpanded} togglePanel={togglePanel}/>
            <AccountHistory isPanelExpanded={isPanelExpanded}/>
        </div>
    );
};

export default HistoryPage