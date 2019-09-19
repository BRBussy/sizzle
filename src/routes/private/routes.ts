import {
  Mail as MailIcon,
  Map as MapIcon,
  Money as MoneyIcon
} from '@material-ui/icons';
import {RouteType} from 'routes/Route';
import { Party1HomeView } from 'views/Home';
import ProfileView from 'views/Profile';
import View1View from 'views/View1';
import RoleView from 'views/Role';

export const routes: RouteType[] = [
  // single route, no collapsible menu
  {
    name: 'View 1',
    path: '/app/view1',
    icon: MoneyIcon,
    component: View1View,

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
        component: RoleView
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
