import React from "react";
import SignInView from "views/SignIn"
import SignUpView from "views/SignUp"

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

        path: '/sign-in',
        component: SignInView,
    },
    {
        redirect: false,
        redirectTo: '',

        path: '/sign-up',
        component: SignUpView,
    },
];

export default routes