import React from "react";
import { Login } from "./Authent/Login/Login";
import { MessageBoard } from "./Messages/MessageBoard";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProtectedRoute from "./Authent/ProtectedRoute";
import AppHeader from "./AppHeader";
import { MessageDetail } from "./Messages/MessageDetail";

export const App = () => (
  <div>
    <Router>
      <AppHeader />
      <ProtectedRoute exact path="/" component={MessageBoard} />
      <Route path="/login" render={(props) => <Login {...props} />} />
      <ProtectedRoute exact path="/message/:id" component={MessageDetail} />
    </Router>
  </div>
);
