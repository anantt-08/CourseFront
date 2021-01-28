import React, { Component } from 'react';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdbreact';

export default class Forgetpassword extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", errors: {} };
        this.handleInput = this.handleInput.bind(this);
    }
    handleInput = e => {
        // e.preventDefault();
        console.log(e.target.value);
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }
    handleForm = e => {
        e.preventDefault();
        if (this.state.email === '') {
            NotificationManager.warning("Email is Required");
            return false;
        }
        const data = { email: this.state.email };
        axios
            .post("http://localhost:9000/api/users/reset", data)
            .then(result => {
                console.log("yo")
                NotificationManager.success("Password Reset link sent to your email .Please check the your email.Link Will be Valid For 30 min");
            })
            .catch(err => {
                  if (err.response && err.response.status === 404)
                    NotificationManager.error(err.response.data.msg);
                  else
                    NotificationManager.error("Something Went Wrong");
                  this.setState({ errors: err.response })
            });

    }
    render() {
        return (
          <div  style={{
             height: '100%', position: 'absolute', left: '0px', overflow: 'hidden',
            width:"100%",
            backgroundImage:
              "url(" + require("./cover.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}>
            <div className="content">
                <NotificationContainer />
                <form onSubmit={this.handleForm}>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1 col-md-3"></div>
                        <div className="col-sm-10 col-md-6">
                         <MDBContainer>
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <div className="header pt-3 grey lighten-2">
              <MDBRow className="d-flex justify-content-start">
                <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">
                  Forgot Password? 
                                 </h3>
              </MDBRow>
            </div>
            <MDBCardBody className="mx-2">
              <MDBInput label="Your email" group type="text" name="email" value={this.state.email} onChange={this.handleInput}/>
              <div className="text-center mb-4 mt-5">
                <MDBBtn
                  color="danger"
                  type="button"
                  className="btn-block z-depth-2"
                  value="send Mail" onClick={this.handleForm} 
                >
                  Send MAIL   
                               </MDBBtn>
              </div>
             
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
                        </div>
                        <div className="col-sm-1 col-md-3"></div>
                    </div>
                </form>
            </div>
            </div>
        )
    }
}
