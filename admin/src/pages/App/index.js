import React, { Suspense, useEffect } from "react";
import "antd/dist/antd.min.css";
import "../../scss/index.scss";
import "../../configs/message.config";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { getIsAuth } from "../../reducers/auth";
import { getUserRequest } from "../../reducers/user";
import Login from "../Login";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { renderRoutes, routes } from "../../configs/routesConfig";

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authenticate.isAuth);

  useEffect(() => {
    //authentication
    dispatch(getIsAuth());
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    //get user -> store redux
    if (isAuth) dispatch(getUserRequest());
    return () => {};
  }, [dispatch, isAuth]);

  console.log("auth", isAuth);
  return (
    <BrowserRouter>
      <Suspense>
        <div className="App" id="app">
          <Switch>
            <Redirect exact from="/" to="login" />
            {isAuth ? (
              <>
                <Header />
                <div className="wrapper">
                  <Sidebar />
                  <Switch>
                    <div className="route">{renderRoutes(routes)}</div>
                  </Switch>
                </div>
              </>
            ) : (
              <>
                <Route exact path="/login">
                  <Login />
                </Route>
              </>
            )}
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
