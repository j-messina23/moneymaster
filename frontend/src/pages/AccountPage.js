import React, { useState } from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import Accounts from '../components/Accounts';
import SidePanel from '../components/SidePanel';

const LoggedInPage = () =>
{
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);

    const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded);
    };

    return(
        <div>
            <SidePanel isPanelExpanded={isPanelExpanded} togglePanel={togglePanel}/>
            <Accounts isPanelExpanded={isPanelExpanded}/>
        </div>
    );
}

export default LoggedInPage;
