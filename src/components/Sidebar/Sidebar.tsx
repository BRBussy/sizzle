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

interface SidebarProps {
    children?: React.ReactNode,
    open: boolean,
    miniActive: boolean,
    handleSidebarToggle: () => void,
    user: User,
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(true)
    const [openAvatar, setOpenAvatar] = useState(true)
    const [collapseState, setCollapseState] = useState({})
    const classes = useStyles()

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
                        onClick={() => setCollapseState({
                            ...collapseState,
                            openAvatar: false,
                        })}
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