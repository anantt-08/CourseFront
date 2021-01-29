import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';

import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
  },
  paper: {
    flexGrow: 1,
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image:{
    backgroundImage: 'url(https://images.pexels.com/photos/572061/pexels-photo-572061.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  }
  ,
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forget:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"16px",
  }
  ,
  yo:{
    color: "blue",
    backgroundColor: "transparent",
    textDecoration: "none",
    "&:hover": {
      color: "red",
      textDecoration: "underline",  
    }
  }
}));
export default function AdminLogin(props) {
  let history = useHistory();
  const classes = useStyles();
  const [email,setemail]=useState('')
  const [password,setpassword]=useState('')
  const dispatch = useDispatch()
  const handleForm = (e) => {
    //console.log("home",history)
    e.preventDefault();
    if (email === "" || password === "") {
      NotificationManager.warning("Email And Password Required");
      return false;
    }
    const data = { email: email, password: password };
    axios
      .post("http://localhost:9000/api/users/login", data)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        NotificationManager.success(result.data.msg);
        setTimeout(() => {
          dispatch({ type: "SET_LOGIN", payload: JSON.stringify(result.data.user) })
          NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({ id: n.id })
          );
          if(result.data.user.canlogin){
          if (result.data.user.admin) {
            history.push("/admin");
          } else {
            history.push("/user");
          }
        }
        else{
          history.push("/reset");
        }
        }, 1000);
      })
      .catch((err) => {
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 401)
        )
          NotificationManager.error(err.response.data.msg);
        else NotificationManager.error("Something Went Wrong");
      });
  };
  
  return (
    <>
    
    <NotificationContainer />
    <Grid container component="main" className={classes.root}>
  <CssBaseline />
  <Grid item xs={false} sm={4} md={7} className={classes.image} />
  <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form  onSubmit={handleForm}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Id"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e)=>setemail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e)=>setpassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
</form>
        <Grid container 
         >
          <Grid item md  className={classes.forget}>
          <Link to="/forget-password" className={classes.yo}>Forgot Password?</Link>
          </Grid>
        </Grid>
        </div>
  </Grid>
</Grid>
  </>
  );
}

