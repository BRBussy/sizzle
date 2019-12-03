import {Typography} from '@material-ui/core';
import React from 'react';
import {Link} from 'react-router-dom';

const PubView = () => {
    return (
        <div>
            Some Test Public view that can still be seen if logged in!
            <Typography variant={'body1'}>
                awe
            </Typography>
            <Link to={'/app'}>
                Back to App
            </Link>
        </div>
    );
};

export default PubView;
