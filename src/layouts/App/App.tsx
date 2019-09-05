import React, {useState} from 'react'
import {Switch, Route} from 'react-router-dom'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import cx from 'classnames'
import useStyles from './style'
import {routeBuilder} from './routes'
import {History} from 'history'

interface appProps {
    history: History,
}

export const App = (props: appProps) => {
    const classes = useStyles()
    const [miniActive, setMiniActive] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const routes = routeBuilder('partyType')

    return (
        <div className={classes.wrapper}>
            <Sidebar
                history={props.history}
                appRoutes={routes.sidebarRoutes}
                user={{
                    name: 'Test',
                }}
                miniActive={miniActive}
                open={sidebarOpen}
                handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <div
                className={
                    classes.mainPanel + ' ' +
                    cx({
                        [classes.mainPanelSidebarMini]: miniActive,
                        [classes.mainPanelWithPerfectScrollbar]:
                        navigator.platform.indexOf('Win') > -1,
                    })
                }
            >
                <Header
                    miniActive={false}
                    sidebarMinimize={() => setMiniActive(!miniActive)}
                    handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className={classes.content}>
                    <div className={classes.container}>
                        <Switch>
                            <Route
                                exact
                                path={'/app'}
                                component={() => (<div>Home</div>)}
                            />
                            {routes.sidebarRoutes.map((route, key) => {
                                // if route is a redirect a redirect route object is rendered
                                if (route.redirect) {
                                    // TODO: return redirect object
                                    return null
                                }

                                // for collapsed routes, we return a route object for each embedded view
                                if (route.collapse) {
                                    if (route.views == null) {
                                        return null
                                    }
                                    return (
                                        <React.Fragment key={key}>
                                            {route.views.map((route, key) => {
                                                return (
                                                    <Route
                                                        key={key}
                                                        exact
                                                        path={route.path}
                                                        component={() => (<div>{route.name}</div>)}
                                                    />
                                                )
                                            })}
                                        </React.Fragment>
                                    )
                                }

                                // for normal route objects, we return a route object
                                return (
                                    <Route
                                        key={key}
                                        exact
                                        path={route.path}
                                        component={() => (<div>{route.name}</div>)}
                                    />
                                )
                            })}
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    )
}