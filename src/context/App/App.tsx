import {Authenticator} from 'bizzle/authenticator';
import React, {useContext, useEffect, useState} from 'react';
import {LoginClaims} from '../../bizzle/security/claims';

interface Context {
    appContextLoggedIn: boolean;
    appContextLoading: boolean;
    appContextLogin: (email: string, password: string) => Promise<void>;
    appContextLogout: () => void;
    appContextAccessToken: string;
}

const Context = React.createContext({} as Context);

const AppContext: React.FC = ({children}: { children?: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState('');

    const resetState = () => {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setLoading(false);
    };

    // on first app load
    useEffect(() => {
        try {
            // look for token in local storage
            const jwt = localStorage.getItem('jwt');
            if (jwt && jwt !== 'null') {
                // if one is found, set it
                setAccessToken(jwt);
            }
        } catch (e) {
            console.error('error determining logged in from local storage');
        }
    }, []);

    // if access token changes
    useEffect(() => {
        const initialise = async () => {
            setLoading(true);

            // if access token is blank
            if (accessToken === '') {
                // perform clean up and log out
                resetState();
                return;
            }

            // if access token is not blank
            let loginClaims: LoginClaims;
            try {
                // try and parse access token to login claims
                loginClaims = LoginClaims.newFromJWT(accessToken);
            } catch (e) {
                console.error('error parsing jwt to login claims', e);
                // perform clean up and log out
                resetState();
                return;
            }

            // if claims expired
            if (!loginClaims.notExpired) {
                // perform clean up and log out
                resetState();
                return;
            }

            // if claims not expired, set claims and declare logged in
            localStorage.setItem('jwt', accessToken);
            setLoggedIn(true);

            setLoading(false);
        };
        initialise().finally();
    }, [accessToken]);

    const logout = () => {
        setAccessToken('');
    };

    const login: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
        try {
            // on successful login set access token
            const loginResponse = await Authenticator.Login({email, password});
            setAccessToken(loginResponse.jwt);
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
                appContextAccessToken: accessToken
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
