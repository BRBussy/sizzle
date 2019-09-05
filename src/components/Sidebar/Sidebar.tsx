import React, {useState} from 'react'
import cx from 'classnames'
import logo from 'assets/images/logo/logo_emblem_transparent.png'
import RouteType from 'types/Route'
import {History} from 'history'
import {
    Drawer, List,
    ListItem, ListItemIcon, ListItemText,
    Hidden, Collapse,
} from '@material-ui/core'
import {
    Menu as MenuIcon,
    Lock as LockIcon,
} from "@material-ui/icons"
import useStyles from './style'

interface User {
    name: string,
}

interface SidebarProps {
    children?: React.ReactNode,
    open: boolean,
    miniActive: boolean,
    handleSidebarToggle: () => void,
    user: User,
    appRoutes: RouteType[],
    history: History,
}

interface CollapseState {
    [key: string]: boolean,
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(true)
    const [collapseState, setCollapseState] = React.useState<CollapseState>({})
    const classes = useStyles()

    const openCollapse = (state: string) => {
        setCollapseState({
            ...collapseState,
            [state]: !collapseState[state],
        })
    }

    const userMenuLinks = (
        <div className={classes.userMenuLayout}>
            <List>
                <ListItem
                    onClick={() => openCollapse('userMenu')}
                    className={classes.listItem}
                >
                    <ListItemIcon className={classes.itemIcon}>
                        <MenuIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={'User'}
                        secondary={
                            <b
                                className={cx(
                                    classes.caret,
                                    {[classes.caretActive]: collapseState['userMenu']},
                                )}
                            />
                        }
                        disableTypography={true}
                        className={cx(
                            classes.listItemText,
                            {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                        )}
                    />
                </ListItem>
                <Collapse in={collapseState['userMenu']} unmountOnExit>
                    <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.itemIcon}>
                            <MenuIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={'Profile'}
                            disableTypography={true}
                            className={cx(
                                classes.listItemText,
                                {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                            )}
                        />
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.itemIcon}>
                            <LockIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={'Logout'}
                            disableTypography={true}
                            className={cx(
                                classes.listItemText,
                                {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                            )}
                        />
                    </ListItem>
                </Collapse>
            </List>
        </div>
    )

    const viewLinks = (
        <div>
            <List>
                {props.appRoutes.map((prop, key) => {
                    // ignore redirects, these do not get links as they are used
                    // in the browser router to force a redirect
                    if (prop.redirect) {
                        return null
                    }

                    // route items with collapse
                    if (prop.collapse) {
                        return (
                            <React.Fragment key={key}>
                                <ListItem
                                    key={key}
                                    onClick={() => openCollapse(prop.name)}
                                    className={classes.listItem}
                                >
                                    <ListItemIcon className={classes.itemIcon}>
                                        <prop.icon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={prop.name}
                                        secondary={
                                            <b
                                                className={cx(
                                                    classes.caret,
                                                    {[classes.caretActive]: collapseState[prop.name]},
                                                )}
                                            />
                                        }
                                        disableTypography={true}
                                        className={cx(
                                            classes.listItemText,
                                            {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                                        )}
                                    />
                                </ListItem>
                                <Collapse in={collapseState[prop.name]} unmountOnExit>
                                    {prop.views.map((prop, key) => {
                                        return (
                                            <ListItem
                                                key={key}
                                                className={classes.listItem}
                                                onClick={() => props.history.push(prop.path)}
                                            >
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <prop.icon/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={prop.name}
                                                    disableTypography={true}
                                                    className={cx(
                                                        classes.listItemText,
                                                        {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                                                    )}
                                                />
                                            </ListItem>
                                        )
                                    })}
                                </Collapse>
                            </React.Fragment>
                        )
                    }

                    // other route items
                    return (
                        <ListItem
                            key={key}
                            className={classes.listItem}
                            onClick={() => props.history.push(prop.path)}
                        >
                            <ListItemIcon className={classes.itemIcon}>
                                <prop.icon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={prop.name}
                                disableTypography={true}
                                className={cx(
                                    classes.listItemText,
                                    {[classes.listItemTextSidebarMinimized]: props.miniActive && miniActive}
                                )}
                            />
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )

    const brand = (
        <div className={classes.brandLayout}>
            <img src={logo} alt="logo" className={classes.logoImg}/>
            <div
                className={cx(
                    classes.logoNormal,
                    {[classes.logoNormalSidebarMini]: props.miniActive && miniActive}
                )}
            >
                Sizzle
            </div>
        </div>
    )

    const drawerPaper =
        classes.drawerPaper +
        ' ' +
        cx({
            [classes.drawerPaperMini]:
            props.miniActive && miniActive,
        })

    return (
        <div>
            <Hidden mdUp>
                <Drawer
                    variant={'temporary'}
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
                    {brand}
                    <div className={classes.sidebarLinksLayout}>
                        {userMenuLinks}
                        {viewLinks}
                    </div>
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    onMouseOver={() => setMiniActive(false)}
                    onMouseOut={() => setMiniActive(true)}
                    anchor={'left'}
                    variant={'permanent'}
                    open
                    classes={{
                        paper: drawerPaper + ' ' + classes.blackBackground,
                    }}
                >
                    {brand}
                    <div className={classes.sidebarLinksLayout}>
                        {userMenuLinks}
                        {viewLinks}
                    </div>
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
        </div>
    )
}