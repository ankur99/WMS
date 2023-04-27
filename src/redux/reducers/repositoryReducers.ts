import { ActionTypes } from "../action-types/index";
import { Action } from "../actions/index";

interface RepositoriesState {
  loading: boolean;
  error: string | null;
  data: string[];
}

const initialState = {
  loading: false,
  data: [],
  error: null
};

const repositoryReducers = (
  state: RepositoriesState = initialState,
  action: Action
): RepositoriesState => {
  switch (action.type) {
    case ActionTypes.SEARCH_REPOSITORIES:
      return {
        ...state,
        loading: true,
        error: null,
        data: []
      };
    case ActionTypes.SEARCH_REPOSITORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case ActionTypes.SEARCH_REPOSITORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default repositoryReducers;
