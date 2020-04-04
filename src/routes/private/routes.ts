import {
    Map as MapIcon,
    Money as MoneyIcon,
    Pages as BudgetIcon,
    List as CategoryRuleListIcon,
    Settings as ConfigIcon
} from '@material-ui/icons';
import {RouteType} from 'routes/Route';
import BudgetImportView from 'views/Budget/Import';
import BudgetSummaryView from 'views/Budget/Summary';
import BudgetEntryListView from 'views/Budget/EntryList'
import BudgetEntryCategoryRuleListView from 'views/Budget/CategoryRuleList';
import ConfigurationView from 'views/Budget/Configuration';
import ExerciseView from 'views/Exercise';
import {Party1HomeView} from 'views/Home';
import ProfileView from 'views/Profile';

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
        name: 'Budget',
        path: '/app/budget',
        icon: BudgetIcon,
        component: null,

        collapse: true,
        views: [
            {
                name: 'Summary',
                path: '/app/budget/summary',
                icon: MapIcon,
                component: BudgetSummaryView
            },
            {
                name: 'Import',
                path: '/app/budget/import',
                icon: MapIcon,
                component: BudgetImportView
            },
            {
                name: 'List',
                path: '/app/budget/list',
                icon: MapIcon,
                component: BudgetEntryListView
            },
            {
                name: 'Categories',
                path: '/app/budget/categories',
                icon: CategoryRuleListIcon,
                component: BudgetEntryCategoryRuleListView
            },
            {
                name: 'Config',
                path: '/app/budget/configuration',
                icon: ConfigIcon,
                component: ConfigurationView
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
