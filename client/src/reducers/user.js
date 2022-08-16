import userApi from "../apis/userApi";
const GET_USER = "GET_USER";
const initialState = {};

//======= actions request (call API) =======//
const getUserRequest = () => {
  return async (dispatch) => {
    try {
      const response = await userApi.getUser();
      const { user } = response.data;
      dispatch(getUser(user));
    } catch (error) {
      throw error;
    }
  };
};

//======= actions =======//
const getUser = (user) => {
  return {
    type: GET_USER,
    payload: user,
  };
};

//======= reducer =======//
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER: {
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
  GET_USER,
};
