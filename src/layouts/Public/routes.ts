import RouteType from 'types/Route'

export const routes: RouteType[] = [
    {
        redirect: false,
        name: 'Login',
        path: '/login',
        icon: null,
        component: View1View,

        // views null since collapse is false
        collapse: false,
        views: null,
    },
];