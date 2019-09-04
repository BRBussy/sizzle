import React from 'react'
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
    handleSidebarToggle: () => undefined,
}

export const Sidebar = (props: SidebarProps) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor={'right'}
                    open={props.open}
                    classes={{
                        paper: classes.blackBackground,
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
                    variant="permanent"
                    open
                    classes={{
                        paper: classes.blackBackground,
                    }}
                >
                    <div>stuff in drawer</div>
                </Drawer>
            </Hidden>
        </div>
    )
}