import { ROUTES } from "../constants/index";
import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import ProductAdd from "../pages/ProductPage/AddProduct";
import EditProduct from "../pages/ProductPage/EditProduct";
import ProductAll from "../pages/ProductPage";
import CustomerList from "../pages/CustomerPage";
import OrderList from "../pages/OrderPage";
import AdminUser from "../pages/AdminPage";
import AddAdmin from "../pages/AdminPage/AddAdmin";
import Slider from "../pages/SliderPage";
import AddSlider from "../pages/SliderPage/AddSlider";

const routes = [
  {
    path: ROUTES.DASHBOARD,
    exact: true,
    main: () => <Dashboard />,
  },
  {
    path: ROUTES.ADMIN,
    exact: true,
    main: () => <AdminUser />,
  },
  {
    path: ROUTES.ADMIN_ADD,
    exact: true,
    main: () => <AddAdmin />,
  },
  {
    path: ROUTES.CUSTOMERS,
    exact: true,
    main: () => <CustomerList />,
  },
  {
    path: ROUTES.PRODUCTS,
    exact: true,
    main: () => <ProductAll />,
  },
  {
    path: ROUTES.PRODUCT_ADD,
    exact: true,
    main: () => <ProductAdd />,
  },
  {
    path: ROUTES.PRODUCT_EDIT,
    exact: true,
    main: () => <EditProduct />,
  },
  {
    path: ROUTES.ORDERS,
    exact: true,
    main: () => <OrderList />,
  },
  {
    path: ROUTES.SLIDERS,
    exact: true,
    main: () => <Slider />,
  },
  {
    path: ROUTES.SLIDERS_ADD,
    exact: true,
    main: () => <AddSlider />,
  },
];

// render routes
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, exact, main } = route;
    return <Route key={index} path={path} exact={exact} component={main} />;
  });
};

export { routes, renderRoutes };
