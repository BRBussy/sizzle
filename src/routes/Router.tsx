import React from 'react';
import { Route, Switch } from 'react-router';
import { RouteType } from './Route';

interface RouterProps {
  routes: RouteType[];
}

const Router = (props: RouterProps) => {
  return (
    <Switch>
      {props.routes.map((route, key) => {
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
    </Switch>
  );
};

export default Router;
