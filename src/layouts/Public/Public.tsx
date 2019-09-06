import React from 'react'
import {Route, Switch, Redirect} from "react-router"
import SignInView from "views/SignIn"
import SignUpView from "views/SignUp"

const Public = () => {
    return (
        <Switch>
            <Route
                exact
                path={'/sign-up'}
                component={SignUpView}
            />
            <Route
                exact
                path={'/sign-in'}
                component={SignInView}
            />
            <Route
                // redirect all traffic that does not match a path to sign in
                path={''}
                render={() => (<Redirect to={'/sign-in'}/>)}
            />
        </Switch>
    )
}

export default Public