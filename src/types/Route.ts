import React from 'react'

interface Route {
    redirect: boolean,
    name: string,
    collapse: boolean,
    views: {
        redirect: boolean,
        name: string,
        path: string,
        mini: string,
        icon: React.ComponentType,
    }[],
    path: string,
    icon: React.ComponentType,
}

export default Route