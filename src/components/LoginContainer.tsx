import React, { useCallback, useContext, useEffect } from "react";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { useAuth } from "reactfire";
import AuthContext from "../AuthContext";
import { ReactComponent as GoogleLogo } from "../googlelogo.svg";

const useStyles = makeStyles((theme) => ({
  googleButton: {
    background: "#FFF",
    borderRadius: "1px",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.25)",
  },
  googleButtonContent: {
    display: "flex",
    alignItems: "center",
    width: "300px",
    height: "50px",
  },
  googleButtonLogo: {
    padding: "15px",
    height: "inherit",
  },
  signInGoogleText: {
    flexGrow: 1,
    textAlign: "center",
  },
}));
export default function LoginContainer() {
  const classes = useStyles();
  const { setLoggedIn } = useContext(AuthContext);

  const auth = useAuth();
  const history = useHistory();
  const signInWithGoogle = useCallback(() => {
    auth
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .catch((err) => {
        console.log(err);
      });
  }, [auth, history, setLoggedIn]);

  useEffect(() => {
    if (auth.currentUser) {
      history.push("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <Button onClick={signInWithGoogle} className={classes.googleButton}>
          <div className={classes.googleButtonContent}>
            <div className={classes.googleButtonLogo}>
              <GoogleLogo style={{ width: "18px", height: "18px" }} />
            </div>
            <p className={classes.signInGoogleText}>Sign in with Google</p>
          </div>
        </Button>
      </Grid>
    </Container>
  );
}
