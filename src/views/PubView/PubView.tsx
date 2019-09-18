import { Typography } from '@material-ui/core';
import { useFirebaseContext } from 'context/Firebase';
import React from 'react';
import { Link } from 'react-router-dom';

const PubView = () => {
  const { user } = useFirebaseContext();
  return (
    <div>
      Some Test Public view that can still be seen if logged in!
      <Typography variant={'body1'}>
        {(user === null)
          ? (
            <Link to={'/sign-in'}>
              Back to Sign In
            </Link>
          )
          : (
            <Link to={'/app'}>
              Back to App
            </Link>
          )
        }
      </Typography>
    </div>
  );
};

export default PubView;
