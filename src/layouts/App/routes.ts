import RouteType from 'types/Route'
import {
    Mail as MailIcon,
    Money as MoneyIcon,
    Map as MapIcon,
} from '@material-ui/icons'

const routes: RouteType[] = [
    {
        redirect: false,
        name: 'View 1',
        collapse: false,
        views: [],
        path: 'app/view1',
        icon: MoneyIcon,
    },
    {
        redirect: false,
        name: 'Views',
        collapse: true,
        icon: MailIcon,
        views: [
            {
                redirect: false,
                name: 'View 2',
                path: 'app/views/view2',
                mini: 'V',
                icon: MapIcon,
            },
        ],
        path: 'app/views',
    },
];

export default routes