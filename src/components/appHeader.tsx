import {
  ChangeEvent,
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { TokenContext } from "~/pages/_app";
import { trpc } from "~/utils/trpc";
import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {
  Menu as MenuIcon,
  Settings,
  Logout,
  BubbleChartOutlined,
  SendRounded,
  BookOutlined,
  ContactsOutlined,
  Person,
} from "@mui/icons-material";
import {
  colorSettings,
  loginPath,
  workSpacePath,
} from "~/pages/utils/const/routers";
import { authorColor, bookColor } from "~/pages/utils/const/color";
import { useRouter } from "next/router";
import { indexGuideStepsID } from "~/pages";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
export const AppHeader = forwardRef(function (
  _props,
  ref: ForwardedRef<HTMLDivElement | null>
) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);
  const optOpen = Boolean(anchorAvatar);
  const tokenCtx = useContext(TokenContext);
  const [userName, setUserName] = useState("用户名");
  const trpcContext = trpc.useContext();
  const [infoChanging, setInfoChanging] = useState<boolean>(false);
  const [newUserInfo, setNewUserInfo] = useState<{
    username: string;
  }>({
    username: userName,
  });
  const [infoModal, setInfoModal] = useState<boolean>(false);
  useEffect(() => {
    async function getUserInfo() {
      try {
        if (tokenCtx.token !== "") {
          let user = await trpcContext.client.user.getUserInfoByToken.query();
          if (user) {
            setUserName(user.username);
            setNewUserInfo({ username: user.username });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    getUserInfo();
  }, [tokenCtx.token]);
  let Opts = (
    <Button
      color="info"
      endIcon={<SendRounded />}
      variant="contained"
      href={loginPath}
      id={indexGuideStepsID.avatarStep}
    >
      登录
    </Button>
  );
  if (tokenCtx.token !== "") {
    Opts = (
      <>
        <IconButton
          id={indexGuideStepsID.avatarStep}
          onClick={(e) => {
            setAnchorAvatar(e.currentTarget);
          }}
        >
          <Avatar>{userName.substring(0, 1)}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorAvatar}
          open={optOpen}
          id="account-menu"
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 22,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          onClose={() => {
            setAnchorAvatar(null);
          }}
          onClick={() => {
            setAnchorAvatar(null);
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Typography variant="h6" noWrap>
              {userName}
            </Typography>
          </MenuItem>
          <Divider></Divider>
          <MenuItem
            onClick={() => {
              router.push(workSpacePath);
            }}
          >
            <ListItemIcon>
              <BubbleChartOutlined fontSize="small" />
            </ListItemIcon>
            图表绘制
          </MenuItem>
          <Divider></Divider>
          <MenuItem
            onClick={() => {
              router.push(colorSettings);
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            预设
          </MenuItem>
          <MenuItem
            onClick={() => {
              setInfoModal(true);
            }}
          >
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            信息修改
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (tokenCtx.setToken) {
                tokenCtx.setToken("");
              }
              localStorage.removeItem("refreshToken");
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            登出
          </MenuItem>
        </Menu>
        <Modal
          open={infoModal}
          onClose={() => {
            return;
          }}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={infoModal}>
            <Box
              sx={{
                position: "absolute",
                bgcolor: "background.paper",
                p: 4,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min-content",
              }}
              overflow="auto"
            >
              <Typography
                minWidth="30vw"
                whiteSpace="nowrap"
                id="transition-modal-title"
                variant="h4"
                component="h4"
                textAlign="center"
              >
                信息修改
              </Typography>
              <Stack mt={2} gap={2}>
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setNewUserInfo({
                      username: e.target.value.trim(),
                    });
                  }}
                  value={newUserInfo.username}
                  color="info"
                  label="新用户名"
                />
                {/* <TextField color="info" label="密码" /> */}
                <ButtonGroup fullWidth>
                  <LoadingButton
                    loading={infoChanging}
                    onClick={async () => {
                      if (newUserInfo.username === userName) {
                        enqueueSnackbar({
                          message: "用户名无变化",
                          variant: "warning",
                        });
                        return;
                      }
                      try {
                        setInfoChanging(true);
                        await trpcContext.client.user.changeUserInfo.mutate({
                          username: newUserInfo.username,
                        });
                        setInfoModal(false);
                        if (tokenCtx.setToken) {
                          tokenCtx.setToken("");
                        }
                        localStorage.removeItem("refreshToken");
                        enqueueSnackbar({
                          message: "成功，请重新登录",
                          variant: "success",
                        });
                        return;
                      } catch {
                        enqueueSnackbar({
                          message: "用户名重复或网络错误",
                          variant: "warning",
                        });
                      } finally {
                        setInfoChanging(false);
                      }
                    }}
                    variant="contained"
                    color="success"
                  >
                    确认
                  </LoadingButton>
                  <Button
                    onClick={() => {
                      setInfoModal(false);
                    }}
                    variant="contained"
                    color="info"
                  >
                    取消
                  </Button>
                </ButtonGroup>
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </>
    );
  }
  return (
    <AppBar ref={ref} position="static">
      <Toolbar>
        <IconButton
          id={indexGuideStepsID.appHeaderMenuStep}
          onClick={(e) => {
            setOpen(!open);
            setAnchorEl(e.currentTarget);
          }}
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
          <AppMenu open={open} setOpen={setOpen} anchor={anchorEl}></AppMenu>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ONLINE CHARTS
        </Typography>
        {Opts}
      </Toolbar>
    </AppBar>
  );
});
function AppMenu(prop: {
  anchor: HTMLElement | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Menu
      open={prop.open}
      onClose={() => {
        prop.setOpen(false);
      }}
      anchorEl={prop.anchor}
    >
      <MenuItem onClick={()=>{
        window.open("/docs/acg","__blank")
      }}>
        <ListItemIcon>
          <BookOutlined style={{ color: bookColor }} />
        </ListItemIcon>
        文档
      </MenuItem>
      <MenuItem
        onClick={() => {
          window.open("https://github.com/codeclode", "__blank");
        }}
      >
        <ListItemIcon>
          <ContactsOutlined style={{ color: authorColor }} />
        </ListItemIcon>
        作者
      </MenuItem>
    </Menu>
  );
}
