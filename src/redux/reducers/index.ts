import { combineReducers } from "redux";

import repositoryReducers from "./repositoryReducers";

const reducers = combineReducers({
  repositories: repositoryReducers
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
