import React from 'react';
import AdminLogin from "./home";
import './App.css';
import ErrorS from "./components/ErrorPage";
import { BrowserRouter as Router,Route,Redirect , Switch} from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import AuthRoute from "./components/AuthRoute";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/admin/Dashboard";
import ForgetPassword from './forgetpassword';
import ResetPassword from './resetPassword';
function App() {
  return (
    <div>
      <Router>
      <Switch>  
        <Route exact component={AdminLogin} path="/" />
          <GuestRoute path="/forget-password" exact component={ForgetPassword} />
          <GuestRoute path="/change-password/:slug" component={ResetPassword} />
          {/* <AuthRoute path="/user" exact component={} /> */}
          <PrivateRoute path="/admin" exact component={Dashboard} />
        <Route path ="/error"  component={ ErrorS  } />
          <Redirect to="/error"/>
        </Switch> 
      </Router>
    </div>
  );
}

export default App;
