import React from "react";

export interface PublicRouteType {
    redirect: boolean,
    path: string,
    component: React.ComponentType | null,
}

const routes: PublicRouteType[] = [
    {
        redirect: false,
        path: '/login',
        component: null,
    },
];

export default routes