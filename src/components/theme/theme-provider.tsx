"use client";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const themeOptions = {
    colorSchemes: {
      light: {
        palette: {
          primary: { main: "#D3131D" },
          secondary: { main: "#000000" },
        },
      },
      dark: {
        palette: {
          primary: { main: "#D3131D" },
          secondary: { main: "#FFFFFF" },
        },
      },
    },
  };
  const theme = useMemo(() => extendTheme(themeOptions), []);

  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      {props.children}
    </CssVarsProvider>
  );
}

export default ThemeProvider;
