import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../themes/dark';

export type ThemeProps = { theme: typeof darkTheme };

// export type PropsWithTheme = { theme: typeof darkTheme };

export type PropsWithTheme<P = unknown> = P & {
  theme: typeof darkTheme;
};

function Theme({ children }: PropsWithChildren<any>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}

export default Theme;
