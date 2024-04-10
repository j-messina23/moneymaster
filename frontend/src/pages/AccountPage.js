import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import Accounts from '../components/Accounts';

const LoggedInPage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <Accounts />
        </div>
    );
}

export default LoggedInPage;