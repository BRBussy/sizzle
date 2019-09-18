import React, {useContext, useEffect, useState } from 'react';
import Firebase from './Firebase';

interface Context {
  firebase: null | Firebase;
  user: firebase.User | null;
}

const Context = React.createContext({} as Context);

const FirebaseContext: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [firebase] = useState(new Firebase());
  const [user, setUser] = useState(null as firebase.User | null);

  useEffect(() => {
    if (firebase === null) {
      console.error('firebase is null!');
      return;
    }
    // this function will fire each time the firebase authentication state changes
    firebase.auth.onAuthStateChanged(async (currentFirebaseUser: firebase.User | null) => {
      // check if the current firebase user is null
      if (currentFirebaseUser) {
        // user not null --> user has just signed in or signed up
        if (currentFirebaseUser.emailVerified) {
          // if user is verified, update the user in the firebase context
          setUser(currentFirebaseUser);
        } else {
          // if user is not yet verified, log them out
          try {
            await firebase.doSignOut();
            setUser(null);
          } catch (e) {
            console.error('error logging user out', e);
          }
        }
      } else {
        // user null --> user is not signed in
        setUser(null);
      }
    });
  }, [firebase, setUser]);

  return (
    <Context.Provider
      value={{
        firebase,
        user
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useFirebaseContext = () => useContext(Context);
export {
  useFirebaseContext
};
export default FirebaseContext;
