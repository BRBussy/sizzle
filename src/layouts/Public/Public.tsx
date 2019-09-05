import React from 'react'
import {Route, Switch} from "react-router";
import routes from './routes'

const Public = () => {
    return (
        <Switch>
            {routes.map((route, key) => {
                if (route.redirect) {
                    // TODO: return redirect object here
                    return null
                }

                if (route.component == null) {
                    return null
                }

                return (
                    <Route
                        path={route.path}
                        component={route.component}
                    />
                )
            })}
        </Switch>
    )
}

export default Public