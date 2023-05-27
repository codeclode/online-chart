import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
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
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
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
} from "@mui/icons-material";
import {
  colorSettings,
  loginPath,
  workSpacePath,
} from "~/pages/utils/const/routers";
import { authorColor, bookColor } from "~/pages/utils/const/color";
import { useRouter } from "next/router";
import { indexGuideStepsID } from "~/pages";
export const AppHeader = forwardRef(function (
  _props,
  ref: ForwardedRef<HTMLDivElement | null>
) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);
  const optOpen = Boolean(anchorAvatar);
  const tokenCtx = useContext(TokenContext);
  const [userName, setUserName] = useState("用户名");
  const trpcContext = trpc.useContext();
  useEffect(() => {
    async function getUserInfo() {
      try {
        if (tokenCtx.token !== "") {
          let user = await trpcContext.client.user.getUserInfoByToken.query();
          if (user) setUserName(user.username);
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
      <MenuItem>
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
