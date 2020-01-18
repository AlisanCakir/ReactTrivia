import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styles.css";

import MainQuiz from "./components/MainQuiz";
import Category from "./components/Category";

export default function App() { 
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Category} />
        <Route path="/MainQuiz" exact component={MainQuiz} />
        <Route path="/none" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
}