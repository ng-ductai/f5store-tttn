import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { cartReducer } from "./carts";
import { userReducer } from "./user";

const rootReducer = combineReducers({
  authenticate: authReducer,
  user: userReducer,
  carts: cartReducer,
});

export default rootReducer;
