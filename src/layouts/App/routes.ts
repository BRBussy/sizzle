import {
    Mail as MailIcon,
    Money as MoneyIcon,
    Map as MapIcon,
} from '@material-ui/icons'

import View1View from 'views/View1'
import View2View from 'views/View2'
import ProfileView from 'views/Profile'
import {Party1HomeView} from 'views/Home'
import React from "react";

export interface AppRouteType {
    redirect: boolean,
    redirectTo: string,

    name: string,
    path: string,
    icon: React.ComponentType,
    component: React.ComponentType | null,

    collapse: boolean,
    views: {
        name: string,
        path: string,
        icon: React.ComponentType,
        component: React.ComponentType,
    }[] | null,
}

/**
 * General Routes, specified with view permissions etc.
 */
export const routes: AppRouteType[] = [
    // single route, no collapsible menu
    {
        redirect: false,
        redirectTo: '',

        name: 'View 1',
        path: '/app/view1',
        icon: MoneyIcon,
        component: View1View,

        // views null since collapse is false
        collapse: false,
        views: null,
    },

    // multiple routes accessed from collapsible menu
    {
        redirect: false,
        redirectTo: '',

        name: 'More Views',
        path: '/app/views',
        icon: MailIcon,
        component: null,

        collapse: true,
        views: [
            {
                name: 'View 2',
                path: '/app/views/view2',
                icon: MapIcon,
                component: View2View,
            },
        ],
    },
];


export const routeBuilder: (partyType: string) => ({
    homeRoute: AppRouteType,
    profileRoute: AppRouteType,
    sidebarRoutes: AppRouteType[],
}) = (partyType: string) => {
    // do processing on party type and permissions to return routes

    return {
        homeRoute: {
            redirect: false,
            redirectTo: '',

            name: 'Home',
            path: '/app',
            icon: MoneyIcon,
            component: Party1HomeView,
            collapse: false,
            views: null,
        },
        profileRoute: {
            redirect: false,
            redirectTo: '',

            name: 'Profile',
            path: '/app/profile',
            icon: MoneyIcon,
            component: ProfileView,
            collapse: false,
            views: null,
        },
        sidebarRoutes: routes,
    }
}