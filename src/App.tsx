import {useAppContext} from 'context/App';
import AppLayout from 'layouts/App';
import PublicLayout from 'layouts/Public';
import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {Router} from 'routes';
import publicRoutes from 'routes/public';
import LoginView from 'views/Login';
import {privateRouteBuilder} from './routes/private';

const App: React.FC = () => {
    const {
        appContextLoading,
        appContextLoggedIn
    } = useAppContext();

    if (appContextLoading) {
        console.log('app is loading...');
        return (
            <div>app loading...</div>
        );
    }

    console.log('appContextLoading:', appContextLoading);
    console.log('appContextLoggedIn:', appContextLoggedIn);

    const routes = privateRouteBuilder('a');

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route
                        // Route catches all paths starting with '/app'
                        path={'/app'}
                        render={(props: any) => {
                            if (!appContextLoggedIn) {
                                // user not logged in, redirect to root
                                return (
                                    <Redirect to={'/'}/>
                                );
                            }
                            // user is logged in, render app
                            return (
                                <AppLayout
                                    homeRoute={routes.homeRoute}
                                    profileRoute={routes.profileRoute}
                                    sidebarRoutes={routes.sidebarRoutes}
                                    {...props}
                                >
                                    <Router
                                        routes={[
                                            routes.homeRoute,
                                            routes.profileRoute,
                                            ...routes.sidebarRoutes
                                        ]}
                                    />
                                </AppLayout>
                            );
                        }}
                    />
                    <Route
                        // Route catches '/login' exactly'
                        exact
                        path={'/login'}
                        render={(props: any) => {
                            if (appContextLoggedIn) {
                                // user already logged in, redirect to app
                                return (
                                    <Redirect to={'/app'}/>
                                );
                            }
                            // otherwise render the login view
                            return (
                                <PublicLayout>
                                    <LoginView {...props}/>
                                </PublicLayout>
                            );
                        }}
                    />
                    { // other public routes
                        publicRoutes.map((route, key) => {
                            // for collapsed routes, we return a route object for each embedded view
                            if (route.collapse) {
                                if (route.views == null) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={key}>
                                        {route.views.map((viewsRoute, viewsKey) => {
                                            return (
                                                <Route
                                                    key={viewsKey}
                                                    exact
                                                    path={viewsRoute.path}
                                                    component={viewsRoute.component}
                                                />
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }

                            // for normal route objects, we return a route object
                            if (route.component == null) {
                                return null;
                            }
                            return (
                                <Route
                                    key={key}
                                    exact
                                    path={route.path}
                                    component={route.component}
                                />
                            );
                        })}
                    <Route
                        // Route catches all other routes
                        path={'/'}
                        render={() => {
                            if (!appContextLoggedIn) {
                                // user not logged in, redirect to login
                                return (
                                    <Redirect to={'/login'}/>
                                );
                            }
                            // otherwise user != null and a user is a logged in
                            // redirect to the app
                            return (
                                <Redirect to={'/app'}/>
                            );
                        }}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
