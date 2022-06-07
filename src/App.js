import CssBaseline from "@mui/material/CssBaseline";
import React, { useRef } from "react";

import { Route, Switch } from "react-router-dom";
import {
  Actors,
  Navbar,
  MovieInformation,
  Movies,
  Profile,
} from "./components";
import useStyles from "./components/styles";
import useAlan from "./components/Alan";

const App = () => {
  const classes = useStyles();

  const alanBtnContainer = useRef();

  useAlan();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Navbar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/movies/:id">
            <MovieInformation />
          </Route>
          <Route exact path="/actors/:id">
            <Actors />
          </Route>
          <Route exact path={["/", "/approved"]}>
            <Movies />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />
          </Route>
        </Switch>
      </main>
      <div ref={alanBtnContainer} />
    </div>
  );
};

export default App;
