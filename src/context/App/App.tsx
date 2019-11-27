import {Authenticator} from 'bizzle/authenticator';
import React, {useContext, useEffect, useState} from 'react';

interface Context {
    appContextLoggedIn: boolean;
    appContextLoading: boolean;
    appContextLogin: (email: string, password: string) => Promise<void>;
    appContextAccessToken: string;
}

const Context = React.createContext({} as Context);

const AppContext: React.FC = ({children}: { children?: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (jwt) {
                setAccessToken(jwt);
            }
        } catch (e) {
            console.error('error determining logged in from local storage');
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        if (accessToken !== '') {
            localStorage.setItem('jwt', accessToken);
            console.log('there is an access token');
        }
        setLoading(false);
    }, [accessToken]);

    const login: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
        try {
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
