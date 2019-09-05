import React from "react";
import Login from "views/Login"

export interface PublicRouteType {
    // props for redirection
    redirect: boolean,
    redirectTo: string,

    // props for routes
    path: string,
    component: React.ComponentType | null,
}

const routes: PublicRouteType[] = [
    {
        redirect: false,
        redirectTo: '',

        path: '/login',
        component: Login,
    },
];

export default routes