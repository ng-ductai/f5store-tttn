import "antd/dist/antd.min.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import GlobalLoading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import ScrollTo from "../../components/ScrollTo";
import "../../configs/message.config";
import { renderRoutes, routes } from "../../configs/routesConfig";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { getIsAuth } from "../../reducers/auth";
import { getUserRequest } from "../../reducers/user";
import BackupCharger from "../ProductPage/BackupCharger";
import Phone from "../ProductPage/Phone";
import Headphone from "../ProductPage/Headphone";

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

  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoading />}>
        <div className="App" id="app">
          <div className="container">
            <Header />

            <div className="main">
              <ScrollTo />

              <Switch>
                {renderRoutes(routes)}

                <Route path="/sacduphong">
                  <BackupCharger />
                </Route>
                <Route path="/dienthoai">
                  <Phone />
                </Route>
                <Route path="/tainghe">
                  <Headphone />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
