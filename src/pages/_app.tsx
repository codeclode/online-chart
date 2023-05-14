import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import type { AppType, AppProps } from "next/app";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  createContext,
  Dispatch,
  SetStateAction,
  StrictMode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TokenOverTimeERROR } from "~/server/utils/const/errors";
import { setHeaderToken, trpc } from "../utils/trpc";
import "./styles/index.global.css";
export const TokenContext = createContext<{
  token: string;
  setToken: Dispatch<SetStateAction<string>> | null;
  refreshToken: null | (() => Promise<boolean>);
}>({
  token: "",
  setToken: null,
  refreshToken: null,
});
const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  trpc.useContext().client.user.getTokenWithRefreshToken;
  const theme = createTheme({
    palette: {
      primary: {
        main: red[100],
      },
      secondary: {
        main: blue[100],
      },
    },
  });
  const [token, setToken] = useState("");
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        let token =
          await trpcContext.client.user.getTokenWithRefreshToken.query({
            refreshToken,
          });
        setToken(token.token);
        setHeaderToken(token.token);
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      if (
        typeof e === "object" &&
        e.message &&
        e === TokenOverTimeERROR.messageString
      ) {
        localStorage.removeItem("refreshToken");
        return false;
      } else {
        alert("网络错误");
        return false;
      }
    }
  }, []);
  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <TokenContext.Provider value={{ token, setToken, refreshToken }}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </TokenContext.Provider>
  );
};

export default trpc.withTRPC(MyApp);
