import { createStyles, makeStyles, Theme } from '@material-ui/core';

const drawerWidth = 260;
const drawerMiniWidth = 80;

const useStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    'position': 'relative',
    'top': '0',
    'height': '100vh',
    '&:after': {
      display: 'table',
      clear: 'both',
      content: '" "'
    }
  },
  mainPanel: {
    transitionProperty: 'top, bottom, width',
    transitionDuration: '.2s, .2s, .35s',
    transitionTimingFunction: 'linear, linear, ease',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: 'hidden',
    position: 'relative',
    float: 'right',
    transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch'
  },
  mainPanelSidebarMini: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerMiniWidth}px)`
    }
  },
  mainPanelWithPerfectScrollbar: {
    overflow: 'hidden !important'
  },
  content: {
    marginTop: '50px',
    padding: theme.spacing(1),
    height: 'calc(100vh)',
    overflowY: 'hidden'
  },
  container: {
    height: 'calc(100vh - 55px)',
    overflowY: 'scroll',
    overflowX: 'hidden'
  }
}));

export default useStyles;
