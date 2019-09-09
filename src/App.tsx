import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AppLayout from 'layouts/App';
import PublicLayout from 'layouts/Public';
import {useFirebaseContext} from "./context/firebase";

const App: React.FC = () => {
    const {
        firebase,
        user,
        setUser,
    } = useFirebaseContext()

    useEffect(()=>{
        if (firebase === null) {
            console.error('firebase is null!')
            return
        }
        firebase.auth.onAuthStateChanged(function(currentFirebaseUser) {
            if (currentFirebaseUser) {
                // User is signed in.
                console.log('user is signed in!')
            } else {
                // No user is signed in.
                console.log('user is not signed in!')
            }
        })
    }, [])

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route
                        path={'/app'}
                        render={(props: any) => <AppLayout {...props}/>}
                    />
                    <Route
                        path={'/'}
                        render={(props: any) => <PublicLayout {...props}/>}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
