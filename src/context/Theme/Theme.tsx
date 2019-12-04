import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {ThemeProvider} from '@material-ui/styles';
import React from 'react';

function Context({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            theme={createMuiTheme({
                palette: {
                    type: 'dark'
                }
            })}
        >
            {children}
        </ThemeProvider>
    );
}

export default Context;
