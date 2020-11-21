import React from "react";
import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Tooltip,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useAuth } from "reactfire";
import { Link, useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
  link: {
    textDecoration: "none",
    color: "white",
    "&:hover": {
      color: "orange",
    },
    padding: "0px 10px",
  },
}));

export default function FooterNavbar() {
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const logout = async () => {
    await auth.signOut();
    history.push("/login");
  };
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        {auth.currentUser && (
          <>
            <div>Hello {auth.currentUser.displayName}</div>
            <div className={classes.grow} style={{ textAlign: "center" }}>
              <Link to="/" className={classes.link}>
                Home
              </Link>
              <Link to="/history" className={classes.link}>
                History
              </Link>
            </div>
          </>
        )}
        {/* <Fab color="secondary" aria-label="add" className={classes.fabButton}>
          <AddIcon />
        </Fab> */}

        {auth.currentUser && (
          <Tooltip title="Logout">
            <IconButton edge="end" color="inherit" onClick={logout}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        )}
        {!auth.currentUser && (
          <Tooltip title="Login">
            <Button
              style={{ color: "white" }}
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
