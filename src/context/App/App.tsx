import {Authenticator} from 'bizzle/authenticator';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {LoginClaims} from '../../bizzle/security/claims';

interface Context {
    appContextLoggedIn: boolean;
    appContextLoading: boolean;
    appContextLogin: (email: string, password: string) => Promise<void>;
    appContextLogout: () => void;
}

const Context = React.createContext({} as Context);

const AppContext: React.FC = ({children}: { children?: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const resetState = () => {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setLoading(false);
    };

    // on first app load
    useLayoutEffect(() => {
        try {
            // look for token in local storage
            const jwt = localStorage.getItem('jwt');
            if (
                jwt &&
                jwt !== 'null' &&
                jwt !== ''
            ) {
                // token is found, process it
                let loginClaims: LoginClaims;
                try {
                    // try and parse access token to login claims
                    loginClaims = LoginClaims.newFromJWT(jwt);
                } catch (e) {
                    console.error('error parsing jwt to login claims', e);
                    // perform clean up and log out
                    logout();
                    return;
                }

                // if claims expired
                if (!loginClaims.notExpired) {
                    // perform clean up and log out
                    logout();
                    return;
                }
                setLoggedIn(true);
                setLoading(false);
            } else {
                logout();
            }
        } catch (e) {
            console.error('error determining logged in from local storage');
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setLoading(false);
    };

    const login: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
        try {
            // on successful login set access token
            const loginResponse = await Authenticator.Login({email, password});
        } catch (e) {
            console.error('error logging in', e);
        }
    };

    return (
        <Context.Provider
            value={{
                appContextLoading: loading,
                appContextLoggedIn: loggedIn,
                appContextLogin: login,
                appContextLogout: logout
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
