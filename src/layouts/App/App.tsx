import React, {useState} from 'react'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import cx from 'classnames'
import useStyles from './style'

export const App: React.FC = () => {
    const classes = useStyles()
    const [miniActive, setMiniActive] = useState(false)

    return (
        <div className={classes.wrapper}>
            <Sidebar
                miniActive={false}
                open={true}
                handleSidebarToggle={() => undefined}
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
            />
            <Header
                miniActive={false}
                sidebarMinimize={() => undefined}
                handleSidebarToggle={() => undefined}
            />
        </div>
    )
}