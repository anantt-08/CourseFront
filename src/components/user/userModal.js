// const fetchData=async()=>{
//     var result=await getData('category/fetchallcategory')
//     setList(result)
    
//     }
//     useEffect(function(){
// fetchData()

//     },[])

import React, { Component } from 'react'
import axios from 'axios';
import { connect } from "react-redux";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Toggle from 'react-toggle'
import "react-toggle/style.css"

class UserModal extends Component {
    constructor(props) {
        super(props)
        this.state = this.initialState
    }
     initialState={
        _id: JSON.parse(localStorage.getItem('user'))._id,
            name: JSON.parse(localStorage.getItem('user')).name,
            email: JSON.parse(localStorage.getItem('user')).email,
            mobile: JSON.parse(localStorage.getItem('user')).mobile,
            description: JSON.parse(localStorage.getItem('user')).description,
            changePassword: false,
            currentPassword: '',
            password: '',
            password_confirmation: ''
    }
    reset =  e =>{
        setTimeout(() => {
            NotificationManager.success("Reset to Normal")
            this.setState(this.initialState)
        
        }, 400);
    }
    handleInput = e => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }
    handleToggleInput=e=>{
        this.setState({ changePassword: e.target.checked ,password:'',password_confirmation:''})
    }
    handleForm = event => {
        event.preventDefault();
        console.log(this.state.description)
        if(this.state.currentPassword==='')
        {
            NotificationManager.warning("Please Enter Current Password");
            return false;
        }
        if(this.state.changePassword && (this.state.password==='' || this.state.password_confirmation===''))
        {
            NotificationManager.warning("Please Enter Password and Confirm Password");
            return false;
        }else if(this.state.changePassword && (this.state.password!==this.state.password_confirmation))
        {
            NotificationManager.warning("Your Password Not Matched ! Please Check your password and confirm password");
            return false;
        }
        axios
            .put("http://localhost:9000/api/users/update", this.state)
            .then(result => {
                localStorage.setItem("user", JSON.stringify(result.data.updatedData));
                if (result.data.success) NotificationManager.success(result.data.msg);
                this.setState(prevState =>{
                    return{
                         prevState:this.initialState
                    }
                 })
                 
            })
            .catch(erro => {
                this.setState({ errors: erro })
                if(erro.response && erro.response.status===401)
                    NotificationManager.error(erro.response.data.msg);
                else
                NotificationManager.error("Something Went Wrong");
            });
    }
    render() {
        return (
            <div>
                <NotificationContainer />
                {/* <button onClick={this.handleEvent} className="btn" style={{ background: "rgb(3, 182, 252)",
                color:"white" }} data-toggle="modal" data-target="#myModal" >
                    <i className="fa fa-pencil-square-o fa-2x mx-0 my-0 px-0 py-0" aria-hidden="true" 
                    style={{color:"yellow"}}></i> Edit Details</button> */}
                <div>
                    <div>
                        <div>
                            <form onSubmit={this.handleForm}  >
                                <div  style={{textAlign:"center",justifyContent:"space-between",display:"flex"}}>
                                    <h4>Update User Details</h4>
                                       
                                    <button type="button" className="btn btn-danger" value="Cancel" onClick={this.reset}>Reset</button>
                                </div>
                                <div>

                                    <div className="row">
                                        <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label >Name</label>
                                                <input type="text" className="form-control"  placeholder="Name" name="name" onChange={this.handleInput} value={this.state.name} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label >Email</label>
                                                <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleInput} placeholder="Email" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label >MobileNo</label>
                                                <input type="number" className="form-control" name="mobile" value={this.state.mobile} onChange={this.handleInput} placeholder="MobileNo" />
                                            </div>
                                        </div>
                                         <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label >Description</label>
                                                <input type="text" className="form-control" name="description" value={this.state.description} onChange={this.handleInput} placeholder="description" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label >Current Password</label>
                                                <input type="password" className="form-control" required name="currentPassword" value={this.state.currentPassword} onChange={this.handleInput} placeholder="Current Password" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6" >
                                            <div className="form-group">
                                                <label htmlFor='changePassword'>Want To change Password?</label><br/>
                                                <Toggle
                                                    name="changePassword"
                                                    id='changePassword'
                                                    checked={this.state.changePassword}
                                                    onChange={this.handleToggleInput} />
                                            </div>
                                        </div>
                                        {this.state.changePassword ? (
                                            <React.Fragment>
                                                <div className="col-sm-6" >
                                                    <div className="form-group">
                                                        <label >New Password</label>
                                                        <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleInput} placeholder="New Password" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6" >
                                                    <div className="form-group">
                                                        <label >Confirm Password</label>
                                                        <input type="password" className="form-control" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleInput} placeholder="Confirm New Password" />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : null}


                                    </div>
                                </div>
                                <div style={{display:"flex",justifyContent:"center"}}>
                                    <input type="submit" className="btn btn-primary" value="Confirm" />
                                    <button type="button" className="btn btn-danger" value="Cancel" onClick={this.reset}>Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setLogin: user => dispatch({ type: "SET_LOGIN", payload: user })
    };
};
export default connect(
    null,
    mapDispatchToProps
)(UserModal);