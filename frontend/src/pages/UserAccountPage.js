import React, { useState } from 'react';

import UserAccount from '../components/UserAccount';
import SidePanel from '../components/SidePanel';

const UserAccountPage = () => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);

    const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded);
    };

    return (
        <div>
            <SidePanel isPanelExpanded={isPanelExpanded} togglePanel={togglePanel} />
            <UserAccount isPanelExpanded={isPanelExpanded}/>
        </div>
    );
};

export default UserAccountPage;