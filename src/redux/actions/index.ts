import { ActionTypes } from "../action-types/index";

interface SearchRepositoriesAction {
  type: ActionTypes.SEARCH_REPOSITORIES;
}

interface SearchRepositoriesActionSuccess {
  type: ActionTypes.SEARCH_REPOSITORIES_SUCCESS;
  payload: string[];
}

interface SearchRepositoriesActionFailure {
  type: ActionTypes.SEARCH_REPOSITORIES_FAILURE;
  payload: string;
}

export type Action =
  | SearchRepositoriesAction
  | SearchRepositoriesActionSuccess
  | SearchRepositoriesActionFailure;
