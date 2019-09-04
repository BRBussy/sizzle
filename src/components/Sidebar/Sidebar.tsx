import React, {useState} from 'react'
import {NavLink} from 'react-router-dom'
import cx from 'classnames'
import logo from 'assets/images/logo/logo_emblem_transparent.png'
import avatar from 'assets/images/user.png'
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

interface SidebarContentWrapperProps {
    className: string,
    links: any,
    user: any,
}

const SidebarContentWrapper = (props: SidebarContentWrapperProps) => {
    return (
        <div className={props.className}>
            {props.links}
            {props.user}
        </div>
    )
}

interface User {
    name: string,
}

interface View {
    redirect: boolean,
    path: string,
    mini: string
    name: string,
}

interface LinkRoute {
    state: string,
    name: string,
    redirect: boolean,
    collapse: boolean,
    views: View[],
    path: string,
}

interface AppRoute {
    sidebarLinkRoutes: LinkRoute[],
}

interface SidebarProps {
    children?: React.ReactNode,
    open: boolean,
    miniActive: boolean,
    handleSidebarToggle: () => void,
    user: User,
    appRoutes: AppRoute,
}

interface CollapseState {
    [key: string]: boolean,
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(true)
    const [openAvatar, setOpenAvatar] = useState(true)
    const [collapseState, setCollapseState] = React.useState<CollapseState>({})
    const classes = useStyles()

    const openCollapse = (state: string) => {
        setCollapseState({
            ...collapseState,
            [state]: false,
        })
    }

    const itemText =
        classes.itemText +
        ' ' +
        cx({
            [classes.itemTextMini]: props.miniActive && miniActive,
        })
    const collapseItemText =
        classes.collapseItemText +
        ' ' +
        cx({
            [classes.collapseItemTextMini]:
            props.miniActive && miniActive,
        })

    const user = (
        <div className={classes.user}>
            <div className={classes.photo}>
                <img src={avatar} className={classes.avatarImg} alt="..."/>
            </div>
            <List className={classes.list}>
                <ListItem className={classes.item + ' ' + classes.userItem}>
                    <NavLink
                        to={'#'}
                        className={classes.itemLink + ' ' + classes.userCollapseButton}
                        onClick={() => openCollapse('avatar')}
                    >
                        <ListItemText
                            primary={props.user.name}
                            secondary={
                                <b
                                    className={
                                        classes.caret +
                                        ' ' +
                                        classes.userCaret +
                                        ' ' +
                                        (openAvatar ? classes.caretActive : '')
                                    }
                                />
                            }
                            disableTypography={true}
                            className={itemText + ' ' + classes.userItemText}
                        />
                    </NavLink>
                    <Collapse in={openAvatar} unmountOnExit>
                        <List className={classes.list + ' ' + classes.collapseList}>
                            <ListItem className={classes.collapseItem}>
                                <NavLink
                                    to={'#'}
                                    className={
                                        classes.itemLink + ' ' + classes.userCollapseLinks
                                    }
                                >
                                    <ListItemIcon className={classes.collapseItemIcon}>
                                        <MenuIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={'Profile'}
                                        disableTypography={true}
                                        className={collapseItemText}
                                    />
                                </NavLink>
                            </ListItem>
                            <ListItem className={classes.collapseItem}>
                                <NavLink
                                    to={'#'}
                                    className={
                                        classes.itemLink + ' ' + classes.userCollapseLinks
                                    }
                                >
                                    <ListItemIcon className={classes.collapseItemIcon}>
                                        <MenuIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={'User'}
                                        disableTypography={true}
                                        className={collapseItemText}
                                    />
                                </NavLink>
                            </ListItem>
                            <ListItem className={classes.collapseItem}>
                                <NavLink
                                    to={'#'}
                                    id={'sidebarLogoutLink'}
                                    className={
                                        classes.itemLink + ' ' + classes.userCollapseLinks
                                    }
                                >
                                    <ListItemIcon className={classes.collapseItemIcon}>
                                        <LockIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={'Logout'}
                                        disableTypography={true}
                                        className={collapseItemText}
                                    />
                                </NavLink>
                            </ListItem>
                        </List>
                    </Collapse>
                </ListItem>
            </List>
        </div>
    )
    const links = (
        <List className={classes.list}>
            {props.appRoutes.sidebarLinkRoutes.map((prop, key) => {
                if (prop.redirect) {
                    return null
                }
                if (prop.collapse) {
                    const navLinkClasses =
                        classes.itemLink +
                        ' ' +
                        cx({
                            [' ' + classes.collapseActive]: false,
                        })
                    const itemText =
                        classes.itemText +
                        ' ' +
                        cx({
                            [classes.itemTextMini]:
                            props.miniActive && miniActive,
                        })
                    const collapseItemText = cx(
                        classes.collapseItemText,
                        {
                            [classes.collapseItemTextMini]:
                            props.miniActive && miniActive,
                        },
                    )

                    return (
                        <ListItem key={key} className={classes.item}>
                            <NavLink
                                to={'#'}
                                className={navLinkClasses}
                                onClick={() => openCollapse(prop.state)}
                            >
                                <ListItemIcon className={classes.itemIcon}>
                                    <MenuIcon/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={prop.name}
                                    secondary={
                                        <b
                                            className={
                                                classes.caret +
                                                ' ' +
                                                (collapseState[prop.state] ? classes.caretActive : '')
                                            }
                                        />
                                    }
                                    disableTypography={true}
                                    className={itemText}
                                />
                            </NavLink>
                            <Collapse in={collapseState[prop.state]} unmountOnExit>
                                <List className={classes.list + ' ' + classes.collapseList}>
                                    {prop.views.map((prop, key) => {

                                        if (prop.redirect) {
                                            return null
                                        }

                                        return (
                                            <ListItem key={key} className={classes.collapseItem}>
                                                <NavLink
                                                    to={prop.path}
                                                    className={cx(
                                                        classes.collapseItemLink,
                                                        {[classes.blue]: false},
                                                    )}
                                                >
                                                    {<span className={classes.collapseItemMini}>
                                                        {prop.mini}
                                                     </span>}
                                                    <ListItemText
                                                        primary={prop.name}
                                                        disableTypography={true}
                                                        className={collapseItemText}
                                                    />
                                                </NavLink>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Collapse>
                        </ListItem>
                    )
                }
                const navLinkClasses =
                    classes.itemLink +
                    ' ' +
                    cx({
                        [' ' + classes.blue]: false,
                    })
                const itemText =
                    classes.itemText +
                    ' ' +
                    cx({
                        [classes.itemTextMini]:
                        props.miniActive && miniActive,
                    })
                return (
                    <ListItem key={key} className={classes.item}>
                        <NavLink
                            to={prop.path}
                            className={navLinkClasses}
                        >
                            <ListItemIcon className={classes.itemIcon}>
                                <MenuIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={prop.name}
                                disableTypography={true}
                                className={itemText}
                            />
                        </NavLink>
                    </ListItem>
                )
            })}
        </List>
    )

    const logoNormal =
        cx(
            classes.logoNormal,
            {
                [classes.logoNormalSidebarMini]:
                props.miniActive && miniActive,
            }
        )

    const brand = (
        <div className={classes.logo}>
            <img src={logo} alt="logo" className={classes.logoImg}/>
            <div className={logoNormal}>
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
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
        </div>
    )
}