// authReducer.ts
import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/authActions';

// Define the types for the action payloads
interface AuthState {
  accessToken: string | null;
  error: string | null;
}

interface Action {
  type: string;
  payload: string | null;  // Adjust this depending on the action's payload type
}

// Initial state with proper type definition
const initialState: AuthState = {
  accessToken: null,
  error: null,
};

// The reducer function
const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, accessToken: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default authReducer;
