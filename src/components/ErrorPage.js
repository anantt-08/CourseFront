import React from 'react';
import logo from "./404.png";
 import { MDBBtn
} from "mdbreact";
import { Link } from 'react-router-dom';
const ErrorS = () => {
    return(
        <div className="col-12">
         <div className="container" style={{textAlign:"center"}}>
          <img  src={logo} height='29%' width='90%' alt="error" />
          <Link to = "/" >
          <MDBBtn 
                        type="button"
                        color="white"
                        gradient="blue"
                        rounded="true"
                        outline="true"
                        className="rounded-circle"
                      >
                        Home Page
                      </MDBBtn>
          </Link>
          </div>               
        </div>
    );
};
export default ErrorS;
