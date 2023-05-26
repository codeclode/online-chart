import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Tab,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Container } from "@mui/system";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AccountCircleOutlined,
  HowToRegOutlined,
  LoginOutlined,
  PasswordOutlined,
  RestartAltOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { setHeaderToken, trpc } from "~/utils/trpc";
import {
  PwdNotCorrectOrNoUserError,
  RepeatUserError,
} from "~/server/utils/const/errors";
import { encrypt } from "~/utils/encrypt";
import { Message } from "../utils/const/types";
import { TokenContext } from "../_app";
import { useRouter } from "next/router";
import {
  loginOptionsColor,
  loginOptionsSelectdColor,
} from "../utils/const/color";

function CustomInput(prop: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  vaildFn?: (value: string) => string;
  password?: boolean;
  label: string;
  icon: SvgIconComponent;
  optional?: boolean;
}) {
  const theme = useTheme();
  const LLsm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "80%" }}>
      {LLsm ? null : (
        <prop.icon
          sx={{
            color: "action.active",
            mr: 1,
            my: 0.5,
            transition: "all 0.6s ease",
          }}
        />
      )}
      <TextField
        color="secondary"
        error={prop.vaildFn ? prop.vaildFn(prop.value) !== "" : false}
        helperText={
          prop.vaildFn && prop.vaildFn(prop.value) !== ""
            ? prop.vaildFn(prop.value)
            : "验证成功"
        }
        required={!prop.optional}
        value={prop.value}
        type={prop.password ? "password" : "text"}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          prop.setValue(e.target.value.trim());
        }}
        sx={{ flex: "1" }}
        label={prop.label}
        variant="outlined"
      />
    </Box>
  );
}

function Registe() {
  const registerMutation = trpc.user.register.useMutation();
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [twicePwd, setTwicePwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Message>({
    message: "网络错误",
    open: false,
    type: "error",
  });
  const valid = useMemo(
    () => ({
      userName: (value: string) => {
        return value.trim().length === 0
          ? "用户名不能为空"
          : value.trim().length > 16
          ? "用户名在16位以内"
          : "";
      },
      pwd: (value: string) => {
        return /^[\w_-]{6,16}$/.test(value)
          ? ""
          : "密码需要在6-16位之间，并且只能使用字母数字下划线";
      },
      twicePwd: (value: string) => {
        return value === pwd ? "" : "两次密码不一致";
      },
    }),
    [pwd]
  );
  const register = useCallback(() => {
    if (
      [valid.pwd(pwd), valid.twicePwd(twicePwd), valid.userName(userName)].some(
        (v) => {
          return v !== "";
        }
      )
    ) {
      setAlert({
        message: "输入的信息不符合要求",
        open: true,
        type: "warning",
      });
      return;
    } else {
      setLoading(true);
      registerMutation.mutate(
        {
          userName: userName,
          password: encrypt(pwd),
        },
        {
          onError(error) {
            if (error.message === RepeatUserError.messageString) {
              setAlert({
                message: "用户名已存在",
                open: true,
                type: "error",
              });
            } else {
              setAlert({
                message: "网络错误",
                open: true,
                type: "error",
              });
            }
            setLoading(false);
          },
          onSuccess() {
            setAlert({
              message: "创建成功",
              open: true,
              type: "success",
            });
            setLoading(false);
          },
        }
      );
    }
  }, [userName, pwd, twicePwd]);
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4vh",
        alignItems: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alert.open}
        onClose={() => {
          setAlert({
            ...alert,
            open: false,
          });
        }}
      >
        <Alert
          onClose={() => {
            setAlert({
              ...alert,
              open: false,
            });
          }}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Typography variant="h6">注册</Typography>
      <CustomInput
        vaildFn={valid.userName}
        icon={AccountCircleOutlined}
        label="用户名"
        value={userName}
        setValue={setUserName}
      ></CustomInput>
      <CustomInput
        vaildFn={valid.pwd}
        icon={PasswordOutlined}
        label="密码"
        password
        value={pwd}
        setValue={setPwd}
      ></CustomInput>
      <CustomInput
        vaildFn={valid.twicePwd}
        icon={PasswordOutlined}
        label="确认密码"
        password
        value={twicePwd}
        setValue={setTwicePwd}
      ></CustomInput>
      <ButtonGroup variant="contained" color="secondary">
        <Button
          startIcon={<RestartAltOutlined />}
          color="error"
          onClick={() => {
            setTwicePwd("");
            setPwd("");
            setUserName("");
          }}
        >
          重置
        </Button>
        <LoadingButton
          color="info"
          variant="contained"
          loading={loading}
          onClick={register}
          endIcon={<HowToRegOutlined />}
        >
          注册
        </LoadingButton>
      </ButtonGroup>
    </Container>
  );
}

function Login() {
  const router = useRouter();
  const tokenProvider = useContext(TokenContext);
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const contextTRPC = trpc.useContext();
  const [valid] = useState({
    userName: (value: string) => {
      return value.trim().length === 0
        ? "用户名不能为空"
        : value.trim().length > 16
        ? "用户名在16位以内"
        : "";
    },
    pwd: (value: string) => {
      return /^[\w_-]{6,16}$/.test(value)
        ? ""
        : "密码需要在6-16位之间，并且只能使用字母数字下划线";
    },
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Message>({
    message: "网络错误",
    type: "error",
    open: false,
  });
  const login = useCallback(async () => {
    if ([valid.pwd(pwd), valid.userName(userName)].every((v) => v === "")) {
      try {
        setLoading(true);
        let tokens = await contextTRPC.client.user.login.query({
          userName: userName,
          password: encrypt(pwd),
        });
        localStorage.setItem("refreshToken", tokens.refreshToken);
        if (tokenProvider.setToken) {
          setHeaderToken(tokens.token);
          tokenProvider.setToken(tokens.token);
          if (router.query["from"]) {
            router.push(router.query["from"].toString());
          } else {
            router.push("/");
          }
        } else throw new Error();
      } catch (e: any) {
        if (
          typeof e === "object" &&
          e.message === PwdNotCorrectOrNoUserError.messageString
        ) {
          setAlert({
            message: "用户不存在或密码错误",
            type: "error",
            open: true,
          });
        } else {
          setAlert({
            message: "网络错误",
            type: "error",
            open: true,
          });
        }
        setLoading(false);
      }
    } else {
      setAlert({
        open: true,
        type: "warning",
        message: "请检查输入参数",
      });
    }
  }, [userName, pwd]);
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4vh",
        alignItems: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alert.open}
        onClose={() => {
          setAlert({
            ...alert,
            open: false,
          });
        }}
      >
        <Alert
          onClose={() => {
            setAlert({
              ...alert,
              open: false,
            });
          }}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Typography variant="h6">登录</Typography>
      <CustomInput
        icon={AccountCircleOutlined}
        label="用户名"
        vaildFn={valid.userName}
        value={userName}
        setValue={setUserName}
      ></CustomInput>
      <CustomInput
        icon={PasswordOutlined}
        label="密码"
        password
        value={pwd}
        vaildFn={valid.pwd}
        setValue={setPwd}
      ></CustomInput>
      <ButtonGroup variant="contained" color="secondary">
        <LoadingButton
          loading={loading}
          onClick={login}
          variant="contained"
          startIcon={<LoginOutlined />}
        >
          登录
        </LoadingButton>
      </ButtonGroup>
    </Container>
  );
}

export default function () {
  const [action, setAction] = useState(1);
  const theme = useTheme();
  const LLsm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        background: "url(/image/loginBackGround.jpg)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        position: "fixed",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          overflow: "auto",
          width: LLsm ? "90%" : "60%",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          height: LLsm ? "90%" : "70%",
          backgroundColor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ p: "0" }}>
          <TabContext value={String(action)}>
            <Grid container>
              <Grid item xs={LLsm ? 12 : "auto"}>
                <TabList
                  orientation={LLsm ? "horizontal" : "vertical"}
                  onChange={(_e, newValue) => {
                    setAction(newValue);
                  }}
                  centered
                  aria-label="lab API tabs example"
                >
                  <Tab
                    sx={{
                      color: loginOptionsColor,
                      "&.Mui-selected": {
                        color: loginOptionsSelectdColor,
                      },
                    }}
                    label="注册"
                    value="1"
                  />
                  <Tab
                    sx={{
                      color: loginOptionsColor,
                      "&.Mui-selected": {
                        color: loginOptionsSelectdColor,
                      },
                    }}
                    label="登录"
                    value="2"
                  />
                </TabList>
              </Grid>
              <Grid item xs>
                <TabPanel value="1">
                  <Registe></Registe>
                </TabPanel>
                <TabPanel value="2">
                  <Login></Login>
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
        </CardContent>
      </Card>
    </Box>
  );
}
