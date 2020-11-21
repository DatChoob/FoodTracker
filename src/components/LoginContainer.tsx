import React, { useCallback, useContext, useEffect } from "react";
import { Container, Grid } from "@material-ui/core";
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
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((user: firebase.auth.UserCredential) => {
        console.log(user);
        if (user) {
          console.log("routing to home");
          history.push("/");
          setLoggedIn(true);
        }
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
        <button onClick={signInWithGoogle}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
            alt="google icon"
          />
          <span> Continue with Google</span>
        </button>
      </Grid>
    </Container>
  );
}