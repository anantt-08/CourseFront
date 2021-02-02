import React, { Component } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios';
import "./styles.css";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'; 
import { MDBContainer, MDBRow, MDBCol, MDBInput , MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons'
import TextField from '@material-ui/core/TextField';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile:"",
      description:"",
      birth: "",
      errors: {}
    };
  }
  handleForm = e => {
    e.preventDefault();
    const data = {
      name: this.state.name,
      email: this.state.email,
      birth:this.state.birth,
      description:this.state.description,
mobile:this.state.mobile
    };
    console.log(data)
    const token = localStorage.getItem("token");
    console.log(token)
    axios
    .post("http://localhost:9000/api/users/register",data,{
      headers: {
        Authorization: token,
      }
    })
    .then(result => {
      this.setState({
        name: "",
      email: "",
      birth:"",
      description:"",
mobile:""
      })
      NotificationManager.success(result.data.msg);
    })
    .then(r=>{
       setTimeout(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({ id: n.id }));
       }, 800);
    })
    .catch(err => {
      if (err.response && err.response.status === 400)
        NotificationManager.error(err.response.data.msg);
       else
        NotificationManager.error("Something Went Wrong");
      this.setState({ errors: err.response })  
    });
};
  getPickerValue = (e) => {    
    this.setState({birth:e.target.value});
    console.log(this.state.birth)
  }
  handleInput = e => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div className="content">
        <NotificationContainer />
                      
    <MDBContainer style={{ marginTop: 20 }} >
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <form onSubmit={this.handleForm}>
                <p className="h4 text-center py-1" style={{color:"green"}}>Register Up</p>
                <div className="grey-text row  m-0 p-0">
                <div className="col-md-6  m-0 p-0">
                  <MDBInput
                    label="Enter Name"
                    icon="user"
                    group
                    value={this.state.name}
                    type="text"
                     name="name" onChange={this.handleInput}
                  />
                 </div> 
                 <div className="col-md-6  m-0 p-0"> 
                  <MDBInput
                    label="Enter Email"
                    icon="envelope"
                    group
                    value={this.state.email}
                    type="email"
                    name="email" onChange={this.handleInput} 
                  />
                </div>
                </div>  
                 <div className="grey-text row  m-0 p-0">
                 <div className="col-md-6 m-0 p-0">
                   <MDBInput
                    label="Mobile Number"
                    icon="phone"
                    group
                    value={this.state.mobile}
                    type="Number"
                     name="mobile" onChange={this.handleInput}
                  />
                </div>
                 <div className="col-md-6 m-0 p-0">
                 <FontAwesomeIcon icon={faBirthdayCake} className="fa-2x" style={{display:"inline-block",marginTop:"29px"}}/>
                 <TextField
        id="date"
        label="Birthday"
        type="date"
        style={{width: "400", marginLeft: "7px",
        marginTop: "19px"}}
        onChange={this.getPickerValue} 
        value={this.state.birth || ""}
        InputLabelProps={{
          shrink: true,
        }}
      />
       <hr style={{marginTop:" -0.1rem",width:"94%"}} />
                  </div>
                  </div>
  <div className="grey-text row m-0 p-0">
  <div className="col-md-12 m-0 p-0">
       <div className="col-md-12 mt-4 p-0">
       <MDBInput
                    label="Description"
                    icon="user-md"
                    group
                    value={this.state.description}
                    type="text"
                     name="description" onChange={this.handleInput}
                  /> 
          </div>
               </div>
                <div className="text-center py-1 " style={{ display:"block",margin:"auto"}}>
                  <MDBBtn color="cyan" type="submit" >
                    Register
                  </MDBBtn>
                </div>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
            </div>
    );
  }
}


export default Register;
