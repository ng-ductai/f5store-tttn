import adminApi from "../apis/adminApi";
import { REFRESH_TOKEN_KEY } from "../constants/index";

const SET_IS_AUTHOR = "SET_IS_AUTHOR";

// refresh token nếu access token hết hạn không có
const refreshToken = () => {
  return async (dispatch) => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      //if not exist refresh token in local storage -> set isAuth: false
      if (!refreshToken) {
        return dispatch(setIsAuth(false));
      }
      //else request refresh token
      const result = await adminApi.postRefreshToken({
        refresh_token: refreshToken,
      });
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
      const result = await adminApi.getAuth();
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
  return { type: SET_IS_AUTHOR, payload: { isAuth } };
};

// ! reducers
const initialState = { isAuth: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTHOR:
      const { isAuth } = action.payload;
      return { ...state, isAuth };
    default:
      return { ...state };
  }
};

export { authReducer, SET_IS_AUTHOR, setIsAuth, getIsAuth };
