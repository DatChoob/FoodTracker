import React, { useCallback, useContext, useEffect } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { useAuth } from "reactfire";
import AuthContext from "../AuthContext";
export default function LoginContainer() {
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
      <Grid container justify="center">
        <Button variant="contained" onClick={signInWithGoogle}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
            alt="google icon"
          />
          <span> Continue with Google</span>
        </Button>
      </Grid>
    </Container>
  );
}
