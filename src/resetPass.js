import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';

class ResetPass extends Component {
    constructor(props) {
        super(props);
        this.state = { email:"",password: "",confirm_password: "", errors: {} };
    }
     componentDidMount(){
         if(JSON.parse(localStorage.getItem("user")).admin){
            this.props.history.replace("/admin");
         }
         else if(JSON.parse(localStorage.getItem("user")).canlogin){
           this.props.history.replace("/user");
        }
         this.setState({
             email:JSON.parse(localStorage.getItem("user")).email
         })
     }
    handleInput = e => {
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
        if (this.state.password !== this.state.confirm_password) {
            NotificationManager.warning("Password Must Be same");
            return false;
        }
        axios
            .post("http://localhost:9000/api/users/updatePass", this.state)
            .then(result => {
                NotificationManager.success(result.data.msg);
            })
            .then(r=>{
                setTimeout(() => {
                 NotificationManager.listNotify.forEach(n => NotificationManager.remove({ id: n.id }));
                 let storage=JSON.parse(localStorage.getItem("user"))
                  storage.canlogin=true
                 localStorage.setItem("user",JSON.stringify(storage)) 
                 this.props.history.replace("/user");
                }, 1000);
             })
            .catch(err => {
                if (err.response && err.response.status === 400)
                    NotificationManager.error(err.response.data.msg);
                else
                    NotificationManager.error("Something Went Wrong");
                this.setState({ errors: err.response })
            });

    }
    render() {
        return (
            <div className="content">
                <NotificationContainer />
                <form onSubmit={this.handleForm}>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-3"></div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header text-center">Reset Password</div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label >Password</label>
                                        <input type="password" name="password" value={this.state.password} onChange={this.handleInput} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label >Confirm Password</label>
                                        <input type="password" name="confirm_password" value={this.state.confirm_password} onChange={this.handleInput} className="form-control" />
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <input type="submit" value="Reset" onClick={this.handleForm} className="btn btn-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3"></div>
                    </div>
                </form>
            </div>
        )
    }
}


export default withRouter(ResetPass);