import React, { useEffect, useState } from "react";
import { Container, CssBaseline } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginContainer from "./components/LoginContainer";
import HomeContainer from "./components/HomeContainer";
import HistoryContainer from "./components/HistoryContainer";
import FoodDateContainer from "./components/FoodDateContainer";
import FooterNavbar from "./FooterNavbar";
import { useUser } from "reactfire";
import { User } from "firebase";
import AuthContext from "./AuthContext";

export default function AppRouter() {
  const user: User = useUser();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [context] = useState({ isLoggedIn, setLoggedIn });

  useEffect(() => {
    if (user && !isLoggedIn) {
      setLoggedIn(true);
    } else if (!user && isLoggedIn) {
      setLoggedIn(false);
    }
  }, [user, isLoggedIn]);
  return (
    <AuthContext.Provider value={context}>
      <Router basename="food-tracker">
        {/* <Header /> */}
        <CssBaseline />
        <Container>
          <Switch>
            <Route path="/login" component={LoginContainer} />
            {isLoggedIn && (
              <>
                <Route exact path="/history" component={HistoryContainer} />
                <Route exact path="/foodDate" component={FoodDateContainer} />
                <Route path="/" exact component={HomeContainer} />
              </>
            )}
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Container>
        <FooterNavbar />
      </Router>
    </AuthContext.Provider>
  );
}
