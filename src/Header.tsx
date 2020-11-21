import { AppBar, Button, Grid, Toolbar } from "@material-ui/core";
import { User } from "firebase";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth, useUser } from "reactfire";

export default function Header() {
  const user: User = useUser();
  const auth = useAuth();
  const history = useHistory();

  const logout = async () => {
    await auth.signOut();
    history.push("/login");
  };
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            {/* <img
                src="/turtleicon.png"
                style={{ transform: "scaleX(-1)", height: "96px" }}
              /> */}
          </Grid>
          <Grid item>
            <Grid
              container
              alignItems="center"
              justify="space-around"
              style={{ width: 300 }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                Home
              </Link>
              <Link
                to="/history"
                style={{ textDecoration: "none", color: "white" }}
              >
                History
              </Link>
            </Grid>
          </Grid>
          <Grid item>
            {!auth.currentUser && (
              <Link
                to="/login"
                style={{
                  paddingRight: "10px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Login
              </Link>
            )}
            {auth.currentUser && (
              <div style={{ paddingRight: "10px" }}>
                <span>Hello {user.displayName}</span>
                <Button
                  style={{ textDecoration: "none", color: "white" }}
                  onClick={logout}
                >
                  Log out
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
