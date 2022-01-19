import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from "@material-ui/core/CssBaseline";


const MainTheme = ({ children }) => {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      background: {
        main: '#282c34',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
);
}

export default MainTheme;
