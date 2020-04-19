import {
    Collapse, Drawer,
    Hidden, List, ListItem,
    ListItemIcon, ListItemText
} from '@material-ui/core';
import {
    Lock as LockIcon,
    Menu as MenuIcon
} from '@material-ui/icons';
import logo from 'assets/images/logo/logo_emblem_transparent.png';
import cx from 'classnames';
import {useAppContext} from 'context/App';
import {History} from 'history';
import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {RouteType} from 'routes/Route';
import useStyles from './style';

interface User {
    name: string;
}

interface SidebarProps {
    children?: React.ReactNode;
    open: boolean;
    miniActive: boolean;
    handleSidebarToggle: () => void;
    user: User;
    appRoutes: {
        homeRoute: RouteType,
        profileRoute: RouteType,
        sidebarRoutes: RouteType[]
    };
    history: History;
}

interface CollapseState {
    [key: string]: boolean;
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(true);
    const [collapseState, setCollapseState] = React.useState<CollapseState>({});
    const classes = useStyles();
    const {appContextLogout} = useAppContext();

    const openCollapse = (state: string) => {
        setCollapseState({
            ...collapseState,
            [state]: !collapseState[state]
        });
    };

    const sidebarMinimized = props.miniActive && miniActive;

    const userMenuLinks = (
        <div className={classes.userMenuLayout}>
            <List>
                <ListItem
                    onClick={() => openCollapse('userMenu')}
                    className={cx(
                        classes.listItem,
                        {[classes.listItemSidebarMinimized]: sidebarMinimized}
                    )}
                >
                    <ListItemIcon className={classes.itemIcon}>
                        <MenuIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={'Username'}
                        secondary={
                            <b
                                className={cx(
                                    classes.caret,
                                    {[classes.caretActive]: collapseState.userMenu}
                                )}
                            />
                        }
                        disableTypography={true}
                        className={cx(
                            classes.listItemText,
                            {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                        )}
                    />
                </ListItem>
                <Collapse in={collapseState.userMenu} unmountOnExit>
                    <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.itemIcon}>
                            <MenuIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <NavLink to={props.appRoutes.profileRoute.path}>
                                    {props.appRoutes.profileRoute.name}
                                </NavLink>
                            }
                            disableTypography={true}
                            className={cx(
                                classes.listItemText,
                                {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                            )}
                        />
                    </ListItem>
                    <ListItem
                        className={classes.listItem}
                        onClick={appContextLogout}
                    >
                        <ListItemIcon className={classes.itemIcon}>
                            <LockIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={'Logout'}
                            disableTypography={true}
                            className={cx(
                                classes.listItemText,
                                {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                            )}
                        />
                    </ListItem>
                </Collapse>
            </List>
        </div>
    );

    const viewLinks = (
        <div>
            <List>
                {props.appRoutes.sidebarRoutes.map((route, key) => {
                    // route items with collapse
                    if (route.collapse) {
                        if (route.views == null) {
                            return null;
                        }
                        return (
                            <React.Fragment key={key}>
                                <ListItem
                                    key={key}
                                    onClick={() => openCollapse(route.name)}
                                    className={classes.listItem}
                                >
                                    <ListItemIcon className={classes.itemIcon}>
                                        <route.icon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={route.name}
                                        secondary={
                                            <b
                                                className={cx(
                                                    classes.caret,
                                                    {[classes.caretActive]: collapseState[route.name]}
                                                )}
                                            />
                                        }
                                        disableTypography={true}
                                        className={cx(
                                            classes.listItemText,
                                            {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                                        )}
                                    />
                                </ListItem>
                                <Collapse in={collapseState[route.name]} unmountOnExit>
                                    {route.views.map((viewsRoute, viewsKey) => {
                                        return (
                                            <ListItem
                                                key={viewsKey}
                                                className={classes.listItem}
                                                onClick={() => props.history.push(viewsRoute.path)}
                                            >
                                                <ListItemIcon className={classes.itemIcon}>
                                                    <viewsRoute.icon/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <NavLink to={viewsRoute.path}>
                                                            {viewsRoute.name}
                                                        </NavLink>
                                                    }
                                                    disableTypography={true}
                                                    className={cx(
                                                        classes.listItemText,
                                                        {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                                                    )}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </Collapse>
                            </React.Fragment>
                        );
                    }

                    // other route items
                    return (
                        <ListItem
                            key={key}
                            className={classes.listItem}
                            onClick={() => props.history.push(route.path)}
                        >
                            <ListItemIcon className={classes.itemIcon}>
                                <route.icon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <NavLink to={route.path}>
                                        {route.name}
                                    </NavLink>
                                }
                                disableTypography={true}
                                className={cx(
                                    classes.listItemText,
                                    {[classes.listItemTextSidebarMinimized]: sidebarMinimized}
                                )}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    const brand = (
        <div className={classes.brandLayout}>
            <img
                src={logo}
                alt={'logo'}
                className={classes.logoImg}
                onClick={() => props.history.push('/')}
            />
            <div
                className={cx(
                    classes.logoNormal,
                    {[classes.logoNormalSidebarMini]: sidebarMinimized}
                )}
            >
                Sizzle
            </div>
        </div>
    );

    const drawerPaper = cx(
        classes.drawerPaper,
        classes.blackBackground,
        {
            [classes.drawerPaperMini]:
            sidebarMinimized
        }
    );

    return (
        <div>
            <Hidden mdUp>
                <Drawer
                    variant={'temporary'}
                    anchor={'right'}
                    open={props.open}
                    classes={{paper: drawerPaper}}
                    onClose={props.handleSidebarToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
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
                    classes={{paper: drawerPaper}}
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
    );
};
