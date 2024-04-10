import React, { useState } from 'react';

import SidePanel from '../components/SidePanel';
import EditProfile from '../components/EditProfile';

const EditUserAccountPage = () => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);

    const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded);
    };

    return (
        <div>
            <SidePanel isPanelExpanded={isPanelExpanded} togglePanel={togglePanel}/>
            <EditProfile isPanelExpanded={isPanelExpanded}/>
        </div>
    );
};

export default EditUserAccountPage;