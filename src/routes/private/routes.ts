import {
    Money as MoneyIcon,
    List as ListIcon,
    Settings as ConfigIcon,
    Dashboard as SummaryIcon,
    CloudUpload as ImportIcon
} from '@material-ui/icons';
import {RouteType} from 'routes/Route';
import BudgetImportView from 'views/Budget/Import';
import BudgetSummaryView from 'views/Budget/Summary';
import BudgetEntryListView from 'views/Budget/EntryList'
import BudgetEntryCategoryRuleListView from 'views/Budget/CategoryRuleList';
import ConfigurationView from 'views/Budget/Configuration';
import ProfileView from 'views/Profile';
import HomeView from 'views/Home';

export const routes: RouteType[] = [
    {
        name: 'Budget',
        path: '/app/budget',
        icon: MoneyIcon,
        component: null,

        collapse: true,
        views: [
            {
                name: 'Budget Summary',
                path: '/app/budget/summary',
                icon: SummaryIcon,
                component: BudgetSummaryView
            },
            {
                name: 'Import Statements',
                path: '/app/budget/import',
                icon: ImportIcon,
                component: BudgetImportView
            },
            {
                name: 'Budget Entry List',
                path: '/app/budget/list',
                icon: ListIcon,
                component: BudgetEntryListView
            },
            {
                name: 'Budget Entry Category Rules',
                path: '/app/budget/categories',
                icon: ListIcon,
                component: BudgetEntryCategoryRuleListView
            },
            {
                name: 'Budget Config',
                path: '/app/budget/configuration',
                icon: ConfigIcon,
                component: ConfigurationView
            }
        ]
    }
];

export const routeBuilder: () => ({
    homeRoute: RouteType,
    profileRoute: RouteType,
    sidebarRoutes: RouteType[]
}) = () => {
    // do processing on party type and permissions to return routes

    return {
        homeRoute: {
            name: 'Home',
            path: '/app',
            icon: MoneyIcon,
            component: HomeView,
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
