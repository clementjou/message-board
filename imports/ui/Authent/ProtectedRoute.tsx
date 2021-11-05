import React from "react";
import { Meteor } from "meteor/meteor";
import { Redirect, Route } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  // const user = useTracker(() => Meteor.user());
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLoggedIn = Meteor.userId() !== null;
        if (isLoggedIn) {
          return <Component {...rest} {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
