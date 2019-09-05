import React from 'react'
import {Route, Switch, Redirect} from "react-router";
import routes from './routes'

const Public = () => {
    return (
        <Switch>
            {routes.map((route, key) => {
                // if route is a redirect a redirect route object is rendered
                if (route.redirect) {
                    return (
                        <Route
                            path={route.path}
                            render={()=>(<Redirect to={route.redirectTo}/>)}
                        />
                    )
                }

                if (route.component == null) {
                    return null
                }
                return (
                    <Route
                        exact
                        key={key}
                        path={route.path}
                        component={route.component}
                    />
                )
            })}
            <Route
                // redirect all traffic that does not match a path to sign in
                path={''}
                render={()=>(<Redirect to={'/sign-in'}/>)}
            />
        </Switch>
    )
}

export default Public