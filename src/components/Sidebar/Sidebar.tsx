import React, {useState} from 'react'
import {NavLink} from 'react-router-dom'
import cx from 'classnames'
import logo from 'assets/images/logo/logo_emblem_transparent.png'
import avatar from 'assets/images/user.png'
import RouteType from 'types/Route'
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

    console.log('item text mini!!', props.miniActive && miniActive)

    const user = (
        <div className={classes.user}>
            <div className={classes.photo}>
                <img src={avatar} className={classes.avatarImg} alt={'...'}/>
            </div>
            <List className={classes.list}>
                <ListItem className={classes.item + ' ' + classes.userItem}>
                    <NavLink
                        to={'#'}
                        className={classes.itemLink + ' ' + classes.userCollapseButton}
                        onClick={() => openCollapse('userMenu')}
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
                                        (collapseState['userMenu'] ? classes.caretActive : '')
                                    }
                                />
                            }
                            disableTypography={true}
                            className={itemText + ' ' + classes.userItemText}
                        />
                    </NavLink>
                    <Collapse in={collapseState['userMenu']} unmountOnExit>
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
            {props.appRoutes.map((prop, key) => {
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
                                onClick={() => openCollapse(prop.name)}
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
                                                (collapseState[prop.name] ? classes.caretActive : '')
                                            }
                                        />
                                    }
                                    disableTypography={true}
                                    className={itemText}
                                />
                            </NavLink>
                            <Collapse in={collapseState[prop.name]} unmountOnExit>
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

    const sidebarWrapperClass =
        classes.sidebarWrapper +
        ' ' +
        cx({
            [classes.drawerPaperMini]:
            props.miniActive && miniActive,
            [classes.sidebarWrapperWithPerfectScrollbar]:
            navigator.platform.indexOf('Win') > -1,
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
                    <div className={sidebarWrapperClass}>
                        {user}
                        {links}
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
                    <div className={sidebarWrapperClass}>
                        {user}
                        {links}
                    </div>
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
        </div>
    )
}