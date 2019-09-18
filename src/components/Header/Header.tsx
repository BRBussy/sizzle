import {
  AppBar, Fab, Toolbar, useMediaQuery, useTheme
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import {
  Menu, MoreVert, ViewList
} from '@material-ui/icons';
import logo from 'assets/images/logo/logo_emblem_transparent.png';
import cx from 'classnames';
import React from 'react';
import useStyles from './style';

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

interface HeaderProps {
  miniActive: boolean;
  sidebarMinimize: () => void;
  handleSidebarToggle: () => void;
}

export const Header = (props: HeaderProps) => {
  const classes = useStyles();
  const width = useWidth();

  if (isWidthUp('md', width)) {
    return (
      <AppBar
        className={cx(classes.appBar, classes.primary)}
        style={{ padding: 0 }}
      >
        <Toolbar className={classes.toolbarDesktop}>
          <div className={classes.sidebarMinimize}>
            <Fab
              size={'small'}
              onClick={props.sidebarMinimize}
            >
              {props.miniActive
                ? <ViewList className={classes.sidebarMiniIcon}/>
                : <MoreVert className={classes.sidebarMiniIcon}/>
              }
            </Fab>
          </div>
          <div className={classes.desktopViewName}>
            {'home'}
          </div>
        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar
        className={cx(classes.appBar, classes.primary)}
        style={{ padding: 0 }}
      >
        <Toolbar className={classes.toolbarMini}>
          <div className={classes.logoWrapperMini}>
            <img src={logo} alt='logo' className={classes.logoMini}/>
          </div>
          <div>
            {'home'}
          </div>
          <Fab
            size={'small'}
            onClick={props.handleSidebarToggle}
          >
            <Menu/>
          </Fab>
        </Toolbar>
      </AppBar>
    );
  }

};
