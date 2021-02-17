import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {isEmpty} from '../Checks';
import { useHistory } from 'react-router-dom';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {ProgressBar} from 'react-bootstrap';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';
import { IconButton } from '@material-ui/core';
import "./progress.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    alignContent:'center',
     justifyContent:'center'
  },
  hmm: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  esmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  headingdiv:{
   display:'flex',
   flexDirection:'column',
   width:'auto',
   padding:3,
   border:'1 solid #000000'
 
  },
  maindiv:{
     display:'flex',
     alignContent:'center',
     justifyContent:'center',
     flexDirection:'column',
   
     padding:10,
     marginTop:15,
     width:'100%'

  },
  input: {
    display: 'none',
  },
  large: {
    width:70 ,
    height:70,
    margin:5,
    padding:3,
    
    
  },
   button: {
    margin: theme.spacing(1),
  },
}));

export default function CategoryInterface(props)
{
    const classes = useStyles();
    const hiddenFileInput = React.useRef(null);
    const [ uploadPercentage,setupload]=useStateWithCallbackLazy(0)
    const [getCategoryName,setCategoryName]=useState('')
    const [getCategoryDescription,setCategoryDescription]=useState('')
    const [getCategoryIcon,setCategoryIcon]=useState({fileBytes:'',fileUrl:'/noimage.png'})
    const [getCategoryPrerequisie,setCategoryPrerequisie]=useState('')
    const [getCategoryDuration,setCategoryDuration]=useState('')
    const [getErrorPic,setErrorPic]=useState({cn:'tp.png',cd:'tp.png',ci:'tp.png',cdu:'tp.png',cp:'tp.png'})
    let history = useHistory();
    const checkStorage=()=>{
      if(!localStorage.getItem("user"))
      {
        history.replace({pathname:'/'})
      }}
      useEffect(function(){
        checkStorage()
      },[])
    const handleIcon=(event)=>{
    setCategoryIcon({fileBytes:event.target.files[0],fileUrl:URL.createObjectURL(event.target.files[0])})
    }
  const handleSubmit=(e)=>{
    
    e.preventDefault(); 
    var error=false
    var cn=isEmpty(getCategoryName)
    var cd=isEmpty(getCategoryDescription)
    var ci=isEmpty(getCategoryIcon.fileBytes)
    var cdu=isEmpty(getCategoryDuration)
    var cp=isEmpty(getCategoryPrerequisie)
    if(cn.err)
    { error=cn.err
     }

    if(cd.err)
    { error=cd.err
      }
    if(ci.err)
    {error=ci.err}

    if(cdu.err)
    {error=cdu.err}

    if(cp.err)
    {error=cp.err}
    
    setErrorPic({cn:cn.img,cd:cd.img,ci:ci.img,cdu:cdu.img,cp:cp.img})
    
    if(!error)
    {
      const token = localStorage.getItem("token");  
    var formData=new FormData()
    formData.append('name',getCategoryName)
    formData.append('description',getCategoryDescription)
    formData.append('image',getCategoryIcon.fileBytes) 
    formData.append('duration',getCategoryDuration) 
    formData.append('prerequisie',getCategoryPrerequisie) 

    
    const config = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total )

        if( percent < 100 ){
          setupload(percent)
        }
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      Authorization: token
    }
  }
    axios.get(`http://localhost:9000/api/courses/coursecheck/${getCategoryName}`, {
      headers: {
        Authorization: token,
      }
    })
    .then((res) => {
     // console.log(res.data.success)
      axios
      .post("http://localhost:9000/api/courses/coursesubmit",formData,config)
      .then((res) => {
        console.log(res)
       setupload(100, ()=>{
          setTimeout(() => {
            setupload(0)
            setCategoryDescription('')
  setCategoryName('')
  setCategoryIcon({fileBytes:'',fileUrl:'/noimage.png'})
  setCategoryPrerequisie('')
  setCategoryDuration('')
  setErrorPic({cn:'tp.png',cd:'tp.png',ci:'tp.png',cdu:'tp.png',cp:'tp.png'})
        NotificationManager.success("Success!!") 
          }, 1000);
        })
     }).catch((err) => {
      if(err.response.status === 405){
        setupload(0)
              NotificationManager.error("Only Accepts Image's") 
      }
      else{
      NotificationManager.error(err.response.data.msg)
      setupload(0)  
    }
    });
    }).catch((err)=>{
      //console.log(err.response.data.success)
      setupload(0)
      NotificationManager.error(err.response.data.msg)     
    })
    }
  }
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
 
  const reset=()=>{
    setCategoryDescription('')
    setCategoryName('')
    setCategoryIcon({fileBytes:'',fileUrl:'/noimage.png'})
    setCategoryPrerequisie('')
    setCategoryDuration('')
    setErrorPic({cn:'tp.png',cd:'tp.png',ci:'tp.png',cdu:'tp.png',cp:'tp.png'})
          NotificationManager.success("Reset Values!") 
  }
return(
<>
  <NotificationContainer />
<div className={classes.root} >
   <div className={classes.maindiv}>
     <div className={classes.headingdiv}>
       <h3  style={{textAlign:"center",justifyContent:"center"}}>Courses Interface</h3>
     </div>
     <form onSubmit={handleSubmit}> 
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <img src={`/${getErrorPic.cn}`}/> 
        <TextField
        value={getCategoryName}
        id="outlined-basic" label="Course Name" variant="outlined"   fullWidth onChange={(event)=>setCategoryName(event.target.value)} />
        </Grid>

        <Grid item xs={12} sm={6}>
        <img src={`/${getErrorPic.cd}`}/> 
        <TextField 
        value={getCategoryDescription}
        onChange={(event)=>setCategoryDescription(event.target.value)} id="outlined-basic" label="Course Description" variant="outlined" fullWidth />
        </Grid>
         
        <Grid item xs={12} sm={6}>
        <img src={`/${getErrorPic.cdu}`}/> 
        <TextField 
                value={getCategoryDuration}
        onChange={(event)=>setCategoryDuration(event.target.value)} id="outlined-basic" label="Course Duration" variant="outlined" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
        <img src={`/${getErrorPic.cp}`}/> 
        <TextField 
        value={getCategoryPrerequisie}
        onChange={(event)=>setCategoryPrerequisie(event.target.value)} id="outlined-basic" label="Course Prerequisite" variant="outlined" fullWidth />
        </Grid>
        
        <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
        <img src={`/${getErrorPic.ci}`}/> 
        <input
        className={classes.input}
        type="file"
        name="image" 
        ref={hiddenFileInput}
        onChange={(event)=>handleIcon(event)}
      />
      <Button
        onClick={handleClick}
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<CloudUploadIcon />}
      >
        Upload
      </Button>
      
        </Grid>
      <Grid item style={{display:'flex',justifyContent:'center',alignItems:"center"}} xs={12} sm={6}>
      <IconButton component="span" className="hmm">
                  <Avatar
                    src={getCategoryIcon.fileUrl}
                    style={{
                      width: "105px",
                      height: "105px"
                    }}
                    className="esmall"
                  />
                </IconButton>
       </Grid>
      
     <Grid item style={{display:'flex',justifyContent:'center',width:"1.5em"}} xs={12} sm={6}>
     <Button variant="contained" color="primary" type="submit">
      Submit
     </Button>
     </Grid>
     <Grid item style={{display:'flex',justifyContent:'center'}} xs={12} sm={6}>
     <Button variant="contained" color="secondary" type="button" onClick={reset} >
      Reset
     </Button>
     </Grid>
    </Grid>
    </form>
    </div>
</div>
{ uploadPercentage > 0 && <ProgressBar now={uploadPercentage}  label={`${uploadPercentage}%`} className="meter" style={{marginBottom:"5px"}}/> }
</>
)
}