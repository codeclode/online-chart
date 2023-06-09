import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import type { AppType, AppProps } from "next/app";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TokenOverTimeERROR } from "~/server/utils/const/errors";
import { setHeaderToken, trpc } from "../utils/trpc";
import "./styles/index.global.css";
import { rt } from "./utils/const/anchorOrigin";
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
        setHeaderToken(token.token);
        setToken(token.token);
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      if (
        typeof e === "object" &&
        e.message &&
        e.message === TokenOverTimeERROR.messageString
      ) {
        localStorage.removeItem("refreshToken");
        enqueueSnackbar({
          message: "登录过期",
          variant: "info",
          anchorOrigin: rt,
        });
        return false;
      } else {
        enqueueSnackbar({
          message: "网络错误",
          variant: "error",
          anchorOrigin: rt,
        });
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
          <DndProvider backend={HTML5Backend}>
            <Component {...pageProps} />
          </DndProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </TokenContext.Provider>
  );
};

export default trpc.withTRPC(MyApp);
