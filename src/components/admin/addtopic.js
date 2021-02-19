import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./progress.css";
import {ProgressBar} from 'react-bootstrap';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import InputLabel from '@material-ui/core/InputLabel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'; 
import "bootstrap/dist/css/bootstrap.min.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Viewer } from '@react-pdf-viewer/core';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { Icon, InlineIcon } from '@iconify/react';
import filePpt2Fill from '@iconify-icons/ri/file-ppt-2-fill';

const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    alignContent:'center',
     justifyContent:'center'
  },
  batchyo:{
    '&::after': {
      content: '"*Only One Alphabet (A->Z)"',
      display: 'block',
      height: 60,
      marginLeft:200,
      marginTop: -24,
      fontStyle:"italic",
      color: "red"    }
  }
  ,
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
  }
}));


const Topic = () => {
  const classes = useStyles();
  const hiddenFileInput1 = React.useRef(null);
  const hiddenFileInput2 = React.useRef(null);
  const hiddenFileInput3 = React.useRef(null);
  const [ uploadPercentage,setupload]=useStateWithCallbackLazy(0);
  const [files, setFiles] = useState([]);
  const [topic,setTopic]=useState("");
  const [batch,setBatch]=useState("");
  const [url, setUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [urll,setUrll]= useState("");
  const [filename,setFilename]=useState("");
  const[list,setList]=useState([]);
  const[courseid,setCourseid]=useState("");
  const[coursename,setCoursename]=useState("");
  const[birth,setBirth]=useState(null);
  const[date,setDate]=useState(null);
  const [hover, setHover] = useState(false);
   const [locate,setLocate]=useState(false);
  const  onFileUpload =(event) => {
    
    event.preventDefault();

    let id = event.target.id;
    let file = event.target.files[0];
    let file_reader = new FileReader();
    let duplicateFile = {};
    duplicateFile = files.find((doc) => doc.file_id === id);
    let index=files.indexOf(duplicateFile);
    if(id==1){
      if(event.target.files[0]){
        setFilename(file.name.toUpperCase()); 
      }
      else{
        var filtered = files.filter(function(value){ 
          return value.file_id!=1;
      });
        setFiles(filtered);
        setFilename("")
      }
}
    if(id==2){
      file_reader.onload = () => {
       
      setUrl(file_reader.result);

      };
      if(event.target.files[0]){
        file_reader.readAsDataURL(file);
      }
      else{
        var filtered = files.filter(function(value){ 
          return value.file_id!=2;
      });
      setUrl("");
        setFiles(filtered);
      }
    }
    if(id==3){
          file_reader.onload = () => {
       
      setUrll(file_reader.result);
      
      };
      if(event.target.files[0]){
        file_reader.readAsDataURL(file);
      }
      else{
        
        var filtered = files.filter(function(value){ 
          return value.file_id!=3;
      });
        setFiles(filtered);
        setUrll("");
      }
    }
   
      if (duplicateFile=== undefined) {
     setFiles([...files, { file_id:id,uploaded_file: file }]);
      }
      else{
      let a=files[index]={
         file_id:id,
         uploaded_file:file
       }
     
      }
   }
  const  handleSubmit=(e)=> {
    setLocate(false);
    e.preventDefault();
    console.log(files);
   
    let FINDD = files.find((doc) => doc.file_id == 1);
     if(FINDD===undefined){
       NotificationManager.error("Program Field Cant Be Empty!")
     }
     let filterr=filename.split(".")
     if( filterr[filterr.length-1]=="pdf" || filterr[filterr.length-1]=="PDF"){
      return NotificationManager.error("Program Cant Be Of Format PDF's")
     }
    const token = localStorage.getItem("token");  
    var formData=new FormData()
    //sorting oF FILES! in Correct ORDER
    files.sort(function(a, b) {
      return a.file_id - b.file_id;
    });
    for (const f of files) {
      formData.append("files",f.uploaded_file)
      if(f.file_id==2){
        setLocate(true)
      }
}
    formData.append("courseid",courseid);
    formData.append("topicname",topic);
    formData.append("batch",batch.toUpperCase());
    formData.append("time",date);
    formData.append("coursename",coursename);
    if(setLocate){
      formData.append("locate",true);
    }
    else{
      formData.append("locate",false);
    }
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
  let body={
    
    topicname:topic,
    courseid:courseid,
    batch:batch,
    time:date
  }
  axios
  .post("http://localhost:9000/api/topics/check", body,{
    headers: {
      Authorization: token,
    },
  })
  .then((res) => {
      axios
      .post("http://localhost:9000/api/topics/topicsubmit",formData,config)
      .then((res) => {
        console.log(res);
         setupload(100, ()=>{
          setTimeout(() => {
            setupload(0)
         setFiles([])
         setEnabled(false)
  setBatch('')
  setTopic("")
  setUrl("")
  setUrll("")
  setBirth(null)
  setDate(null)
  setFilename("")
  setCourseid("")
  setCoursename("")
  setLocate(false)
        NotificationManager.success("Success!!") 
          }, 1000);
        })
     }).catch((err) => {
      if(err.response.status === 405){
        setupload(0)
              NotificationManager.error("Only Accepts PDF/RAR/ZIP Files!") 
      }
      else{
      NotificationManager.error(err.response.data.msg)
      setupload(0)  
    }
    });
    }).catch((err)=>{
      //console.log(err.response.data.success)
      setupload(0)
      if (err.response && err.response.status === 400)
      NotificationManager.error(err.response.data.msg);
     else
      NotificationManager.error("Something Went Wrong");     
    })
    return false;
    }
    const reset=()=>{
      setupload(0)
         setFiles([])
         setEnabled(false)
  setBatch('')
  setTopic("")
  setUrl("")
  setUrll("")
  setBirth(null)
  setDate(null)
  setFilename("")
  setCourseid("")
  setCoursename("")
  setLocate(false)
            NotificationManager.success("Reset Values!") 
    }
  useEffect(() => {
   fetchCategory();
  }, []);

  useEffect(() => {
    if (files.length === 0) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [files]);
   
  const getPickerValue = (value) => {
    if(value!=null){
   let A=value.toString().split(" ").slice(1, 4).join(" ")
    setDate(A)
 }
    else{
    setDate(null)
    }
    setBirth(value)
  }

 const fetchCategory=()=>{
    const token = localStorage.getItem("token");  
    axios
    .get("http://localhost:9000/api/courses/find",{
      headers: {
        Authorization: token,
      }
    })
    .then(result => {
    setList(result.data.userlist)
  }) 
    .catch(err => {
console.log(err)
    });
    }
   
  const  handleCategory=(event)=>{
      var text = event.nativeEvent.target.outerText
      setCourseid(event.target.value);
      setCoursename(text);
      }

 const fillCategories=()=>{
    return list.map(function(item){
      return (
          <MenuItem  value={item._id} key={item._id}>
           {item.name}
          </MenuItem>
      )
    })
   }

  
   const handleClickA = event => {
    hiddenFileInput1.current.click();
  };
  const handleClickB = event => {
    hiddenFileInput2.current.click();
  };
  const handleClickC = event => {
    hiddenFileInput3.current.click();
  };

console.log(files,"mm")
  return (
    <>
   <NotificationContainer />
 <div className={classes.root} >
    <div className={classes.maindiv}>
      <div className={classes.headingdiv}>
       <i> <h3  style={{textAlign:"center",justifyContent:"center",fontWeight:"bold",fontFamily:"'Vazir', sans-serif"}}>Add Topic Wise Programs!</h3>
       </i>  </div>
      <form onSubmit={handleSubmit}> 
     <Grid container spacing={2}>
     <Grid item xs={12} sm={6}>
     <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Course Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={courseid}
          onChange={(event)=>handleCategory(event)}
        >  
          {fillCategories()}
        </Select>
      </FormControl> 
         </Grid>
        
        
         <Grid item xs={12} sm={6}>     
         <CalendarTodayIcon style={{ fontSize: 32,marginTop:"14px",marginRight:"3px" }}/>
          <div className="customDatePickerWidth">
          <DatePicker
            className="myDatePicker"
             showTimeSelect
             height="20px"
             width="40px"
            dateFormat="dd/MM/yyyy HH:mm:ss"
            isClearable={true}
            placeholderText="Select Date And Timings Of Batch:"
            fixedHeight={true}
            tetherConstraints={ [] }
            popperPlacement="bottom-top"
            popperModifiers={{
             flip: {
               enabled: false
             },
             preventOverflow: {
               enabled: true,
               escapeWithReference: false
             }
           }}
            selected={birth} onChange={getPickerValue} 
           selectsStart
            startDate={null}
           showMonthDropdown
           showYearDropdown
          />
</div>
         </Grid>
         <Grid item xs={12} sm={6}>
         <TextField
         value={topic}
         id="outlined-basic" label="Topic Name" variant="outlined"   fullWidth onChange={(event)=>setTopic(event.target.value)} />
         </Grid>
 
         
         <Grid item xs={12} sm={6}>
         <TextField
         value={batch}
         id="outlined-basic" label="Batch Name" variant="outlined" className={classes.batchyo}
           fullWidth onChange={(event)=>setBatch(event.target.value)} />
         </Grid>
  
         <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center",background:"#858796",color:"white"}}>
       
        <input
        className={classes.input}
          onChange={onFileUpload}
          type="file"
          name="files"
          ref={hiddenFileInput1}
          id={1}
        />
       <Button
         onClick={handleClickA}
         variant="contained"
         color="default"
         className={classes.button}
         startIcon={<CloudUploadIcon />}
       >
         Upload Program
       </Button>
         </Grid>
         <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center",background:"#858796",color:"white"}}>
       {filename}
        </Grid>
        <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
       
       <input
       className={classes.input}
         onChange={onFileUpload}
         type="file"
         name="files"
         ref={hiddenFileInput2}
         id={2}
         accept=".pdf" 
       />
      <Button
        onClick={handleClickB}
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<PictureAsPdfIcon />}
      >
        Upload PDF
      </Button>
        </Grid>
        <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
       
       <input
       className={classes.input}
         onChange={onFileUpload}
         type="file"
         name="files"
         ref={hiddenFileInput3}
         id={3}
         accept=".pdf" 
       />
      <Button
        onClick={handleClickC}
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<Icon icon={filePpt2Fill} />}
      >
        Upload PPT
      </Button>
        </Grid>
        <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
        <div style={{ height: '400px',width:"400px" }}>
       {
           url
               ? (
                   <div
                       style={{
                           border: '1px solid rgba(0, 0, 0, 0.3)',
                           height: '100%',
                       }}
                   >
                       <Viewer fileUrl={url} />
                   </div>
               )
               : (
                   <div
                       style={{
                           alignItems: 'center',
                           border: '2px dashed rgba(0, 0, 0, .3)',
                           display: 'flex',
                           fontSize: '2rem',
                           height: '100%',
                           justifyContent: 'center',
                           width: '100%',
                       }}
                   >
                       Preview area of PDF
                   </div>
               )
       }
   </div>
        </Grid>
        <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
        <div className="mt4" style={{ height: '400px' ,width:"400px"}}>
                {
                    urll
                        ? (
                            <div
                                style={{
                                    border: '1px solid rgba(0, 0, 0, 0.3)',
                                    height: '100%',
                                }}
                            >
                                <Viewer fileUrl={urll} />
                            </div>
                        )
                        : (
                            <div
                                style={{
                                    alignItems: 'center',
                                    border: '2px dashed rgba(0, 0, 0, .3)',
                                    display: 'flex',
                                    fontSize: '2rem',
                                    height: '100%',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                Preview area Of PPT
                            </div>
                        )
                }
            </div>
        </Grid> 
      <Grid item style={{display:'flex',justifyContent:'flex-end',width:"1.5em"}} xs={12} sm={6}>
      {enabled ? (
        <Button variant="contained" color="primary" type="submit" >
        Submit
       </Button>
      ) : (
        <div   style={ hover ? {'cursor':"not-allowed"}: null 
      }
      onMouseEnter={()=>{
        setHover(true);
      }}
      onMouseLeave={()=>{
        setHover(false);
      }}>
        <Button disabled variant="contained" color="primary" type="submit" >
       Submit
      </Button>
      </div>
      )}
      </Grid>
      <Grid item style={{display:'flex',justifyContent:'left'}} xs={12} sm={6}>
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
  );
};

export default Topic;
