import React from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SuspenseWithPerf
        fallback={<p>loading burrito status...</p>}
        traceId={"load-burrito-status"}
      >
        <AppRouter />
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
}

export default App;
