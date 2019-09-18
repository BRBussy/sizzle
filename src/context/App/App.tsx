import { useFirebaseContext } from 'context/Firebase';
import React, { useContext, useEffect, useState } from 'react';

interface Context {
  fetchingAppData: boolean;
}

const Context = React.createContext({} as Context);

const someLongAPIs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const AppContext: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useFirebaseContext();
  const [fetchingAppData, setFetchingAppData] = useState(false);

  const initialiseContext = () => {
    setFetchingAppData(false);
  };

  // this will run each time the user has logged in or out
  // since user will alternate between:
  //  - null
  //  - an instance of firebase.user
  useEffect(() => {
    if (user === null) {
      // user has just logged out (or loaded app for first time)
      // initialise the app context
      initialiseContext();
    } else {
      // user has just logged in
      const fetchAppData = async () => {
        setFetchingAppData(true);
        try {
          // perform data fetching here
          await someLongAPIs();
        } catch (e) {
          console.error('error fetching app data', e);
        }
        setFetchingAppData(false);
      };
      fetchAppData().finally();
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        fetchingAppData
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useAppContext = () => useContext(Context);
export {
  useAppContext
};
export default AppContext;
