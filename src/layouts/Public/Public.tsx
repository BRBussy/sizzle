import React from 'react'
import {Route, Switch, Redirect} from "react-router";
import routes from './routes'

const Public = () => {
    return (
        <Switch>
            {routes.map((route, key) => {
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
                path={''}
                render={()=>(<Redirect to={'/login'}/>)}
            />
        </Switch>
    )
}

export default Public