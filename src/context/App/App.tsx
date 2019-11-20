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
        } catch (e) {
            console.error('error determining logged in from local storage');
        }
    }, []);

    const login: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
        const loginResponse = await Authenticator.Login({email, password});
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
