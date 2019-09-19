import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { paletteDefault } from './palette';

const theme = createMuiTheme({
  palette: paletteDefault,
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  }
});

function MuiThemeContext({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

export default MuiThemeContext;
