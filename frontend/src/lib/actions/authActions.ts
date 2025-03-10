export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginSuccess = (accessToken: string) => ({
  type: LOGIN_SUCCESS,
  payload: accessToken,
});

export const loginFailure = (errorMessage: string) => ({
  type: LOGIN_FAILURE,
  payload: errorMessage,
});
