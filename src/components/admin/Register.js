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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile:"",
      description:"",
      birth: "",
      errors: {},
      list:[],
      lisst:[],
      courseid:"",
      coursename:"",
      batchid:"",
      batchname:"",
      listt:[],
      finaly:""
    };
  }
  componentWillMount = ()=>{
    this.fetchCategory();
    this.fetchBatch();
  }
   fetchBatch=()=>{
    const token = localStorage.getItem("token");  
    axios.get("http://localhost:9000/api/batches/find",{
  headers: {
    Authorization: token,
  },
}).then((result)=>{
  this.setState({listt:result.data.userlist})
})
.catch((err)=>
{console.log(err)})
    }
  handleForm = e => {
    e.preventDefault();
    if( this.state.courseid!=this.state.finaly){
      return NotificationManager.error("CourseName And BatchName Must Be Same")
     }
    const data = {
      name: this.state.name,
      email: this.state.email,
      birth:this.state.birth,
      description:this.state.description,
mobile:this.state.mobile,
courseid:this.state.courseid,
coursename:this.state.coursename,
batchname:this.state.batchname
    };
    const token = localStorage.getItem("token");
   // console.log(this.state.courseid)
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
mobile:"",
courseid:"",
coursename:"",
batchname:"",
batchid:"",
finaly:""
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
   
 handleCategory=(event)=>{
  var text = event.nativeEvent.target.outerText
  this.setState({courseid:event.target.value,
  coursename:text})
  }
  fetchCategory=()=>{
    const token = localStorage.getItem("token");  

    axios
    .get("http://localhost:9000/api/courses/find",{
      headers: {
        Authorization: token,
      }
    })
    .then(result => {
     //alert(JSON.stringify(result.data.userlist))
    // const arr=[]
    // result.data.userlist.map(e => {
    //   arr.push(e._id)
    // })
    this.setState({
    //  list:[...arr],
      lisst:result.data.userlist
   })
  }) 
    .catch(err => {
console.log(err)
    });
    }

handleBatch=(event)=>{
      var text = event.nativeEvent.target.outerText
      this.setState({ 
        batchid:event.target.value,
      batchname:text
    ,finaly:event.nativeEvent.target.attributes.name.value});
      }
  
   fillCategories=()=>{
      return this.state.lisst.map(function(item){
        return (
            <MenuItem  value={item._id} key={item._id}>
             {item.name}
            </MenuItem>
        )
      })
     }
     fillBatches=()=>{
     let a=  this.state.listt.length
      return this.state.listt.map(function(item){
        return (
       a > 10 ? 
            (<MenuItem className="yoho" style={window.innerWidth> 500 ? {width:"50%",float:"left"}: {}} 
            name={item.courseid} value={item._id} key={item._id}>
             {item.coursename}{" "}{item.week}{" "}{item.timing}
            </MenuItem>) :
            (<MenuItem  name={item.courseid}  value={item._id} key={item._id}>
            {item.coursename}{" "}{item.week}{" "}{item.timing}
           </MenuItem>)
        )
            }
      )
     }
       

  render() {
   // console.log(this.state.list)
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
                 <div className="col-md-6  p-0">
       <FormControl style={{width:"95%"}} >
        <InputLabel id="demo-simple-select-label">Course Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.courseid}
          onChange={(event)=>this.handleCategory(event)}
        >  
       
          {this.fillCategories()}
        </Select>
      </FormControl> 
          </div>    
       <div className="col-md-6  p-0">
       <FormControl style={{width:"95%"}}  >
        <InputLabel id="demo-simple-select-label">Select Batch</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.batchid}
          onChange={(event)=>this.handleBatch(event)}
        >  
          {this.fillBatches()}
        </Select>
      </FormControl> 
               </div>     
       
                  </div>
  <div className="grey-text row m-0 p-0">
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
        style={{ marginLeft: "7px",
        marginTop: "19px"}}
        onChange={this.getPickerValue} 
        value={this.state.birth || ""}
        InputLabelProps={{
          shrink: true,
        }}
      />
       <hr style={{marginTop:" -0.1rem",width:"94%"}} />
                  </div>
               <div className="col-md-12 m-0 p-0">
       <MDBInput
                    label="Description"
                    icon="user-md"
                    group
                    value={this.state.description}
                    type="text"
                     name="description" onChange={this.handleInput}
                  /> 
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
