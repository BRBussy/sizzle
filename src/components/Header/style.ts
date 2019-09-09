import {Theme, createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        position: 'absolute',
        width: '100%',
        zIndex: 1029,
        color: '#555555',
        border: '0',
        transition: 'all 150ms ease 0s',
        height: '50px',
        display: 'flex',
        padding: 0,
    },
    container: {
        paddingRight: "15px",
        paddingLeft: "15px",
        marginRight: "auto",
        marginLeft: "auto",
        "&:before,&:after": {
            display: "table",
            content: '" "'
        },
        "&:after": {
            clear: "both" as "both"
        },
        minHeight: '50px',
    },
    toolbarDesktop: {
        height: '50px',
        minHeight: '50px',
        display: 'flex',
    },
    toolbarMini: {
        height: '50px',
        minHeight: '50px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: "0",
        borderRadius: "3px",
        boxShadow:
            "0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
        padding: "10px 0",
        transition: "all 150ms ease 0s",
    },
    sidebarMinimize: {
        float: 'left',
        color: '#555555',
    },
    sidebarMiniIcon: {
        width: '20px',
        height: '17px',
    },
    logoWrapperMini: {
    },
    logoMini: {
        width: '30px',
        verticalAlign: 'middle',
        border: '0',
    },
    desktopViewName: {
        paddingLeft: '10px'
    },
    miniViewName: {

    },
}));

export default useStyles