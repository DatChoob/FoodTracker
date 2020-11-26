import React, { useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
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
import { useUser } from "reactfire";
import { User } from "firebase";
import AuthContext from "./AuthContext";
import Header from "./Header";

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
        <Header />
        <CssBaseline />
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
        {/* <FooterNavbar /> */}
      </Router>
    </AuthContext.Provider>
  );
}
