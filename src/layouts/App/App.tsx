import React, {useState} from 'react'
import {Switch, Route} from 'react-router-dom'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import cx from 'classnames'
import useStyles from './style'

export const App: React.FC = () => {
    const classes = useStyles()
    const [miniActive, setMiniActive] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className={classes.wrapper}>
            <Sidebar
                appRoutes={{
                    sidebarLinkRoutes: [],
                }}
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
                                path={"/"}
                                component={() => (<div>home</div>)}
                            />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    )
}