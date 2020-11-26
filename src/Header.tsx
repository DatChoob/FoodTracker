import {
  AppBar,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { User } from "firebase";
import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth, useUser } from "reactfire";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import EventIcon from "@material-ui/icons/Event";
import LockIcon from "@material-ui/icons/Lock";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  offset: theme.mixins.toolbar,
  image: {
    height: theme.mixins.toolbar.minHeight,
  },
}));

export default function Header() {
  const classes = useStyles();
  const user: User = useUser();
  const auth = useAuth();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const logout = async () => {
    handleClose();
    await auth.signOut();
    history.push("/login");
  };
  const handleMenu = (event: { currentTarget: any }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const routeToPage = (pageURL: string) => {
    history.push(pageURL);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <img className={classes.image} src={"/images/turtleicon.png"} />
          <Typography variant="h6" className={classes.title}>
            Food Tracker
          </Typography>

          {user && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => routeToPage("/")}>
                  <HomeIcon />
                  Home
                </MenuItem>
                <MenuItem onClick={() => routeToPage("/history")}>
                  <EventIcon />
                  History
                </MenuItem>
                <MenuItem onClick={logout}>
                  <LockIcon />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}
