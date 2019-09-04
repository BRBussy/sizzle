import React from 'react'
import Sidebar from 'components/Sidebar'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles({
    wrapper: {
        position: "relative",
        top: "0",
        height: "100vh",
        "&:after": {
            display: "table",
            clear: "both",
            content: '" "'
        }
    },
})

export const App: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Sidebar
                open={true}
                handleSidebarToggle={() => undefined}
            />
        </div>
    )
}