import React, {useState} from 'react'
import cx from 'classnames'
import {
    makeStyles, Drawer, List,
    ListItem, ListItemIcon, ListItemText,
    Hidden, Collapse,
} from '@material-ui/core'
import styles from './style'

const useStyles = makeStyles(styles)

interface SidebarProps {
    children?: React.ReactNode,
    open: boolean,
    miniActive: boolean,
    handleSidebarToggle: () => undefined,
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(false)
    const classes = useStyles()

    const drawerPaper =
        classes.drawerPaper +
        ' ' +
        cx({
            [classes.drawerPaperMini]:
            props.miniActive && miniActive,
        })

    return (
        <div className={classes.wrapper}>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor={'right'}
                    open={props.open}
                    classes={{
                        paper: drawerPaper + ' ' + classes.blackBackground,
                    }}
                    onClose={props.handleSidebarToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <div>stuff</div>
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    anchor={'left'}
                    variant={'permanent'}
                    open
                    classes={{
                        paper: drawerPaper + ' ' + classes.blackBackground,
                    }}
                >
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
        </div>
    )
}