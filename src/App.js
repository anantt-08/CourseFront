import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Redirect , Switch} from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import AuthRoute from "./components/AuthRoute";
import PrivateRoute from "./components/PrivateRoute";
import Spinner from "./spinner";

import { Worker } from '@react-pdf-viewer/core';

const ErrorS = lazy(() => import("./components/ErrorPage"));
const AdminLogin = lazy(() => import("./home"));
const DashboardUser = lazy(() => import("./components/user/Dashboard"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const  ForgetPassword= lazy(() => import("./forgetpassword"));
const  ResetPassword= lazy(() => import("./resetPassword"));
const  ResetPass= lazy(() => import("./resetPass"));

const Error = () => (
  <Suspense fallback={<Spinner />}>
    <ErrorS />
  </Suspense>
);

const adminLogin = () => (
  <Suspense fallback={<Spinner />}>
    < AdminLogin/>
  </Suspense>
);

const dashboard = () => (
  <Suspense fallback={<Spinner />}>
    < Dashboard/>
  </Suspense>
);

const dashboarduser = () => (
  <Suspense fallback={<Spinner />}>
    < DashboardUser/>
  </Suspense>
);

const  forgetPassword= () => (
  <Suspense fallback={<Spinner />}>
    < ForgetPassword/>
  </Suspense>
);

const resetPassword = () => (
  <Suspense fallback={<Spinner />}>
    <ResetPassword />
  </Suspense>
);

const resetP = () => (
  <Suspense fallback={<Spinner />}>
    <ResetPass />
  </Suspense>
);


function App() {
  return (
    <Worker
    workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"
>
<div>
      <Router>
      <Switch>  
        <GuestRoute exact component={adminLogin} path="/" />
          <GuestRoute path="/forget-password" exact component={forgetPassword} />
          <GuestRoute path="/change-password/:slug" component={resetPassword} />
          <AuthRoute path="/user" exact component={dashboarduser} />
          <AuthRoute path="/reset" exact component={resetP} />
          <PrivateRoute path="/admin" exact component={dashboard} />
        <Route path ="/error"  component={ Error  } />
          <Redirect to="/error"/>
        </Switch> 
      </Router>
    </div>

</Worker>
  );
}

export default App;
