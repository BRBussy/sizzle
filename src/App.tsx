import { useAppContext } from 'context/App';
import { useFirebaseContext } from 'context/Firebase';
import AppLayout from 'layouts/App';
import PublicLayout from 'layouts/Public';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Router } from 'routes';
import publicRoutes from 'routes/public';
import ForgotPasswordView from 'views/ForgotPassword';
import SignInView from 'views/SignIn';
import SignUpView from 'views/SignUp';
import { privateRouteBuilder } from './routes/private';

const App: React.FC = () => {
  const { user } = useFirebaseContext();
  const { fetchingAppData } = useAppContext();

  if (fetchingAppData) {
    return (
      <div>loading...</div>
    );
  }

  const routes = privateRouteBuilder('a');

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route
            // Route catches all paths starting with '/app'
            path={'/app'}
            render={(props: any) => {
              if (user === null) {
                // if user is null, then a user is not logged in
                // redirect to root
                return (
                  <Redirect to={'/'}/>
                );
              }
              // otherwise user != null and a user is a logged in
              // render the app
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
            // Route catches '/sign-up' exactly'
            exact
            path={'/sign-up'}
            render={(props: any) => {
              if (user !== null) {
                // if user !== null then a user is already logged in
                // redirect them to the app
                return (
                  <Redirect to={'/app'}/>
                );
              }
              // otherwise render the login view
              return (
                <PublicLayout>
                  <SignUpView {...props}/>
                </PublicLayout>
              );
            }}
          />
          <Route
            // Route catches '/sign-in' exactly'
            exact
            path={'/sign-in'}
            render={(props: any) => {
              if (user !== null) {
                // if user !== null then a user is already logged in
                // redirect them to the app
                return (
                  <Redirect to={'/app'}/>
                );
              }
              // otherwise render the login view
              return (
                <PublicLayout>
                  <SignInView {...props}/>
                </PublicLayout>
              );
            }}
          />
          <Route
            // Route catches '/forgot-password' exactly'
            exact
            path={'/forgot-password'}
            render={(props: any) => {
              if (user !== null) {
                // if user !== null then a user is already logged in
                // redirect them to the app
                return (
                  <Redirect to={'/app'}/>
                );
              }
              // otherwise render the forgot-password view
              return (
                <ForgotPasswordView {...props}/>
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
              if (user === null) {
                // if user == null, then a user is not logged in
                // redirect to sign-in
                return (
                  <Redirect to={'/sign-in'}/>
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
