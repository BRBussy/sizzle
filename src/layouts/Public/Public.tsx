import React from 'react';
import useStyles from './style';

const Public: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default Public;
