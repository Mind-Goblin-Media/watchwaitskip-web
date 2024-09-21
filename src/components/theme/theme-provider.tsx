"use client";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(() => {
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
            background: { default: "#000000", paper: "rgba(33, 33, 33, 0.49)" },
            primary: { main: "#D3131D" },
            secondary: { main: "#FFFFFF" },
          },
        },
      },
      colorSchemeSelector: "dark",
    };
    return extendTheme(themeOptions);
  }, []);

  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      {props.children}
    </CssVarsProvider>
  );
}

export default ThemeProvider;
