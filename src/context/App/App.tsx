import {Authenticator} from 'bizzle/authenticator';
import {LoginClaims} from 'bizzle/security/claims';
import React, {useContext, useLayoutEffect, useState} from 'react';

interface Context {
    appContextLoggedIn: boolean;
    appContextLoading: boolean;
    appContextLogin: (email: string, password: string) => Promise<void>;
    appContextLogout: () => void;
    appContextLoginClaims: LoginClaims;
}

const Context = React.createContext({} as Context);

const AppContext: React.FC = ({children}: { children?: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loginClaims, setLoginClaims] = useState(new LoginClaims());

    const processJWT = (jwt: string) => {
        let newLoginClaims: LoginClaims;
        try {
            // try and parse access token to login claims
            newLoginClaims = LoginClaims.newFromJWT(jwt);
        } catch (e) {
            console.error('error parsing jwt to login claims', e);
            // perform clean up and log out
            logout();
            return;
        }

        // if claims expired
        if (!newLoginClaims.notExpired) {
            // perform clean up and log out
            logout();
            return;
        }

        localStorage.setItem('jwt', jwt);
        setLoggedIn(true);
        setLoginClaims(newLoginClaims);
        setLoading(false);
    };

    // on first app load
    useLayoutEffect(() => {
        try {
            // look for token in local storage
            const jwt = localStorage.getItem('jwt');
            if (jwt && jwt !== 'null' && jwt !== '') {
                processJWT(jwt);
            } else {
                logout();
            }
        } catch (e) {
            console.error('error determining logged in from local storage');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setLoading(false);
        setLoginClaims(new LoginClaims());
    };

    const login: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
        try {
            // on successful login set access token
            const loginResponse = await Authenticator.Login({email, password});
            processJWT(loginResponse.jwt);
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
                appContextLogout: logout,
                appContextLoginClaims: loginClaims
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
