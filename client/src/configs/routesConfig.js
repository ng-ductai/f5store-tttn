import { ROUTES } from "../constants/index";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import React from "react";
import { Route } from "react-router-dom";

// lazy loading
const SignUp = React.lazy(() => import("../pages/SignUp"));
const Login = React.lazy(() => import("../pages/Login"));
const ForgotPassword = React.lazy(() =>
  import("../pages/Login/ForgotPassword")
);
const NotFound = React.lazy(() => import("../components/NotFound"));
const Cart = React.lazy(() => import("../components/Cart"));
const SearchResult = React.lazy(() =>
  import("../pages/ProductPage/Search")
);
const AccountPage = React.lazy(() => import("../pages/AccountPage"));
const PaymentPage = React.lazy(() => import("../pages/PaymentPage"));
const routes = [
  {
    path: ROUTES.HOME,
    exact: true,
    main: () => <HomePage />,
  },
  {
    path: ROUTES.PRODUCT,
    main: () => <ProductDetailPage />,
  },
  {
    path: ROUTES.SIGNUP,
    exact: true,
    main: () => <SignUp />,
  },
  {
    path: ROUTES.LOGIN,
    exact: true,
    main: () => <Login />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    exact: true,
    main: () => <ForgotPassword />,
  },
  {
    path: ROUTES.CART,
    exact: false,
    main: () => <Cart list={[]} />,
  },
  {
    path: ROUTES.NOT_FOUND,
    exact: true,
    main: () => <NotFound />,
  },
  {
    path: ROUTES.SEARCH,
    exact: true,
    main: () => <SearchResult />,
  },
  {
    path: ROUTES.ACCOUNT,
    exact: false,
    main: () => <AccountPage />,
  },
  {
    path: ROUTES.PAYMENT,
    exact: true,
    main: () => <PaymentPage />,
  },
];

// render routes
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, exact, main } = route;
    return <Route key={index} path={path} exact={exact} component={main} />;
  });
};

export {
  routes,
  renderRoutes,
};
