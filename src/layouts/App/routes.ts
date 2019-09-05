import RouteType from 'types/Route'

const routes: RouteType[] = [
    {
        redirect: false,
        name: 'View 1',
        collapse: false,
        views: [],
        path: 'app/view1',
    },
    {
        redirect: false,
        name: 'Views',
        collapse: true,
        views: [
            {
                redirect: false,
                name: 'View 2',
                path: 'app/views/view2',
                mini: 'V',
            },
        ],
        path: 'app/views',
    },
];

export default routes