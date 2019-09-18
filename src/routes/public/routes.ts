import { Money as MoneyIcon } from '@material-ui/icons';
import PubView from 'views/PubView';
import { RouteType } from '../Route';

export const routes: RouteType[] = [
  {
    name: 'Public Route',
    path: '/pubView',
    icon: MoneyIcon,
    component: PubView,

    // views null since collapse is false
    collapse: false,
    views: null
  }
];
