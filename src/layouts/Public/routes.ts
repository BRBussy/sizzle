import React from "react";

export interface PublicRouteType {
    redirect: boolean,
    path: string,
    component: React.ComponentType | null,
}

export const routes: PublicRouteType[] = [
    {
        redirect: false,
        path: '/login',
        component: null,
    },
];