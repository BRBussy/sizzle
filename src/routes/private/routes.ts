import {
    Mail as MailIcon,
    Map as MapIcon,
    Money as MoneyIcon
} from '@material-ui/icons';
import {RouteType} from 'routes/Route';
import ExerciseView from 'views/Exercise';
import {Party1HomeView} from 'views/Home';
import ProfileView from 'views/Profile';
import SessionView from 'views/Session';

export const routes: RouteType[] = [
    // single route, no collapsible menu
    {
        name: 'Exercise',
        path: '/app/exercise',
        icon: MoneyIcon,
        component: ExerciseView,

        // views null since collapse is false
        collapse: false,
        views: null
    },
    {
        name: 'Session',
        path: '/app/session',
        icon: MoneyIcon,
        component: SessionView,

        // views null since collapse is false
        collapse: false,
        views: null
    },

    // multiple routes accessed from collapsible menu
    {
        name: 'Setup',
        path: '/app/setup',
        icon: MailIcon,
        component: null,

        collapse: true,
        views: [
            {
                name: 'Role',
                path: '/app/setup/role',
                icon: MapIcon,
                component: ProfileView
            }
        ]
    }
];

export const routeBuilder: (partyType: string) => ({
    homeRoute: RouteType,
    profileRoute: RouteType,
    sidebarRoutes: RouteType[]
}) = (partyType: string) => {
    // do processing on party type and permissions to return routes

    return {
        homeRoute: {
            name: 'Home',
            path: '/app',
            icon: MoneyIcon,
            component: Party1HomeView,
            collapse: false,
            views: null
        },
        profileRoute: {
            name: 'Profile',
            path: '/app/profile',
            icon: MoneyIcon,
            component: ProfileView,
            collapse: false,
            views: null
        },
        sidebarRoutes: routes
    };
};
