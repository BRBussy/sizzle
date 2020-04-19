import React from 'react';
import {Route, Switch} from 'react-router';
import {RouteType} from './Route';

interface RouterProps {
    routes: RouteType[];
}

const Router = (props: RouterProps) => {
    const routesToRender: React.ReactNode[] = [];
    props.routes.forEach((route, routeKey) => {
        // for collapsed routes, we return a route object for each embedded view
        if (route.collapse) {
            if (route.views == null) {
                return;
            }
            route.views.forEach((viewsRoute, viewsKey) => {
                routesToRender.push(
                    <Route
                        key={`${routeKey}-${viewsKey}`}
                        exact
                        path={viewsRoute.path}
                        component={viewsRoute.component}
                    />
                );
            })
            return;
        }

        // for normal route objects, we return a route object
        if (route.component == null) {
            return;
        }

        routesToRender.push(
            <Route
                key={`${routeKey}`}
                exact
                path={route.path}
                component={route.component}
            />
        )
    });

    return (
        <Switch>
            {routesToRender}
        </Switch>
    );
};

export default Router;
