import React, {useState} from 'react'
import logo from 'assets/images/logo/logo_emblem_transparent.png'
import cx from 'classnames'
import {
    makeStyles, Drawer, List,
    ListItem, ListItemIcon, ListItemText,
    Hidden, Collapse,
} from '@material-ui/core'
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

interface SidebarProps {
    children?: React.ReactNode,
    open: boolean,
    miniActive: boolean,
    handleSidebarToggle: () => void,
}

export const Sidebar = (props: SidebarProps) => {
    const [miniActive, setMiniActive] = useState(true)
    const classes = useStyles()

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
                    <div className={classes.background}/>
                </Drawer>
            </Hidden>
        </div>
    )
}