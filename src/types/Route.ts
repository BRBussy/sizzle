interface Route {
    redirect: boolean,
    name: string,
    collapse: boolean,
    views: {
        redirect: boolean,
        name: string,
        path: string,
        mini: string,
    }[],
    path: string,
}

export default Route