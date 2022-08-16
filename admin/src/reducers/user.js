
import adminApi from "../apis/adminApi";

//======= constant action type =======//
const GET_ADMIN = "GET_ADMIN";

//======= actions request =======//
const getUserRequest = () => {
  return async (dispatch) => {
    try {
      const response = await adminApi.getUser();
      const { user } = response.data;
      console.log("user", user);
      dispatch(getUser(user));
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

//======= actions =======//
const getUser = (user) => {
  return {
    type: GET_ADMIN,
    payload: user,
  };
};

//======= initial state =======//
const initialState = {};

//======= reducer =======//
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADMIN: {
      return { ...action.payload };
    }
    default:
      return { ...state };
  }
};

export  {
  userReducer,
  getUserRequest,
  getUser,
  GET_ADMIN,
};
