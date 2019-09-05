import React from 'react'

interface Route {
    redirect: boolean,
    name: string,
    path: string,
    icon: React.ComponentType,
    component: React.ComponentType | null,

    collapse: boolean,
    views: {
        redirect: boolean,
        name: string,
        path: string,
        icon: React.ComponentType,
        component: React.ComponentType,
    }[] | null,
}

export default Route