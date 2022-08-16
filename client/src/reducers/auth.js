import loginApi from "../apis/loginApi";
import {REFRESH_TOKEN_KEY} from "../constants/index";

const SET_IS_AUTH = "SET_IS_AUTH";

// refresh token nếu access token hết hạn không có
const refreshToken = () => {
  return async (dispatch) => {
    try {
      const refToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      //if not exist refresh token in local storage -> set isAuth: false
      if (!refToken) {
        return dispatch(setIsAuth(false));
      }
      //else request refresh token
      const result = await loginApi.postRefreshToken({
        refresh_token: refToken,
      });

      console.log("result.status", result.status)
      //if success
      if (result.status === 200) {
        dispatch(setIsAuth(true));
      } else {
        dispatch(setIsAuth(false));
      }
    } catch (error) {
      dispatch(setIsAuth(false));
    }
  };
};

// xác thực mã access token
const getIsAuth = () => {
  return async (dispatch) => {
    try {
      const result = await loginApi.getAuth();
      dispatch(setIsAuth(result.data.isAuth));
    } catch (error) {
      if (error.response) {
        //Unauthorized -> refresh token
        if (error.response.status === 401) {
          dispatch(refreshToken());
        }
      } else {
        dispatch(setIsAuth(false));
      }
    }
  };
};


// set authentication cho người dùng
const setIsAuth = (isAuth) => {
  return { type: SET_IS_AUTH, payload: { isAuth } };
};

// ! reducers
const initialState = { isAuth: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTH:
      const { isAuth } = action.payload;
      return { ...state, isAuth };
    default:
      return { ...state };
  }
};

export {
  authReducer,
  SET_IS_AUTH,
  setIsAuth,
  getIsAuth,
};
