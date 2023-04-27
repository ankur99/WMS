import { createStore, applyMiddleware, compose } from "redux";
import * as Sentry from "@sentry/react";

import thunk from "redux-thunk";

import reducers from "./reducers";

// Used to remove sensitive information from actions. The first parameter passed to the function is the Redux action.
// Return null to not send the action to Sentry. By default we send all actions.
const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
  actionTransformer: (action) => {
    if (action.type === "GOVERNMENT_SECRETS") {
      // Return null to not log the action to Sentry
      return null;
    }
    if (action.type === "SET_PASSWORD") {
      // Return a transformed action to remove sensitive information
      return {
        ...action,
        password: null
      };
    }

    return action;
  }
});

export const store = createStore(
  reducers,
  {},
  compose(applyMiddleware(thunk), sentryReduxEnhancer)
);
