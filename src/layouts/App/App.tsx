import React, {useState} from 'react'
import Sidebar from 'components/Sidebar'
import cx from 'classnames'
import {makeStyles} from '@material-ui/core'
import styles from './style'

const useStyles = makeStyles(styles)

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
        </div>
    )
}