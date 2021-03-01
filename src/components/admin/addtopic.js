import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./javascript";
import "./progress.css";
//import $ from "jquery";
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
  // batchyo:{
  //   '&::after': {
  //     content: '"*Only One Alphabet (A->Z)"',
  //     display: 'block',
  //     height: 60,
  //     marginLeft:200,
  //     marginTop: -24,
  //     fontStyle:"italic",
  //     color: "red"    }
  // }
  // hmm: {
  //   display: 'flex',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //   },
  // },
  // esmall: {
  //   width: theme.spacing(3),
  //   height: theme.spacing(3),
  // },
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
  const [url, setUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [urll,setUrll]= useState("");
  const [filename,setFilename]=useState("");
  const[list,setList]=useState([]);
  const[courseid,setCourseid]=useState("");
  const[coursename,setCoursename]=useState("");
  const[birth,setBirth]=useState(null);
  const[date,setDate]=useState(null);
  const[batchid,setBatchid]=useState("");
  const[batchname,setBatchname]=useState("");
  const[listt,setListt]=useState([]);
  const[finaly,setFinally]=useState("");
  const [hover, setHover] = useState(false);
  const  onFileUpload =(event) => {
    
    // (function ($) {
    //   $(document).ready(function(){
    //   $('#demo-simple-select').change(function(){
    //     $(".yoho").parents('ul').css("max-width", "527px");
    //   })
    //   })
    // })(jQuery);
    event.preventDefault();

    let id = parseInt(event.target.id);
    let file = event.target.files[0];
    let file_reader = new FileReader();
    let duplicateFile = {};
  //  console.log("woooohu",id)
    duplicateFile = files.find((doc) => parseInt(doc.file_id) ===parseInt(id) );
    let index=files.indexOf(duplicateFile);
  //  console.log(duplicateFile,"yeah")
    if(id===1){
      if(event.target.files[0]){
        setFilename(file.name.toUpperCase()); 
      }
      else{
        var filtered = files.filter(function(value){ 
          return parseInt(value.file_id)!==1;
      });
     // console.log(filtered,"opo")
        setFiles(filtered);
        setFilename("")
      }
}
    if(id===2){
      file_reader.onload = () => {
       
      setUrl(file_reader.result);

      };
      if(event.target.files[0]){
        file_reader.readAsDataURL(file);
      }
      else{
        var filtered = files.filter(function(value){ 
          return parseInt(value.file_id)!==2;
      });
     // console.log(filtered,"yo")
      setUrl("");
        setFiles(filtered);
      }
    }
    if(id===3){
          file_reader.onload = () => {
       
      setUrll(file_reader.result);
      
      };
      if(event.target.files[0]){
        file_reader.readAsDataURL(file);
      }
      else{
        
        var filtered = files.filter(function(value){ 
          return parseInt(value.file_id)!==3;
      });
  //    console.log(filtered,"yp")
        setFiles(filtered);
        setUrll("");
      }
    }
   
      if (duplicateFile=== undefined) {
     setFiles([...files, { file_id:parseInt(id),uploaded_file: file }]);
      }
      else{
       // console.log("HMM NOW PROCCED")
      let a=files[index]={
         file_id:parseInt(id),
         uploaded_file:file
       }
      
      }
   }
  const  handleSubmit=async (e)=> {
//    console.log(files);
    e.preventDefault();
    let FINDD = files.find((doc) => parseInt(doc.file_id) === 1);
     if(FINDD===undefined){
     return  NotificationManager.error("Program Field Cant Be Empty!")
     }
     let filterr=filename.split(".")
     if( filterr[filterr.length-1]=="pdf" || filterr[filterr.length-1]=="PDF"){
      return NotificationManager.error("Program Cant Be Of Format PDF's")
     }
     if( courseid!=finaly){
      return NotificationManager.error("CourseName And BatchName Must Be Same")
     }
    const token = localStorage.getItem("token");  
    var formData=new FormData()
    //sorting oF FILES! in Correct ORDER
    files.sort(function(a, b) {
      return a.file_id - b.file_id;
    });
    for (const f of files) {
      formData.append("files",f.uploaded_file)
}
    
    formData.append("courseid",courseid);
    formData.append("topicname",topic);
    formData.append("batch",batchname);
    formData.append("time",date);
    formData.append("coursename",coursename);
    if(files.find((doc) => parseInt(doc.file_id) === 2) != undefined){
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
    batch:batchname,
    time:date
  }
  try{
    const res=await  axios
    .post("http://localhost:9000/api/topics/check", body,{
      headers: {
        Authorization: token,
      },
    })

    try {
     console.log(res) 
   const ress= await axios
   .post("http://localhost:9000/api/topics/topicsubmit",formData,config)
  setupload(100, ()=>{
    setTimeout(() => {
      setupload(0)
   setFiles([])
   setEnabled(false)
setBatchname('')
setTopic("")
setUrl("")
setUrll("")
setBirth(null)
setBatchid("")
setDate(null)
setFilename("")
setCourseid("")
setCoursename("")
setFinally("")
  NotificationManager.success("Success!!") 
    }, 1000);
  })
    }
    catch(err){
      if(err.response.status === 405){
          setupload(0)
                NotificationManager.error("Only Accepts PDF/RAR/ZIP Files!") 
        }
        else{
          setupload(0)
        NotificationManager.error(err.response.data.msg)
    }
  }
}
  catch(err){
    if (err.response && err.response.status === 400){
    setupload(0)
    NotificationManager.error(err.response.data.msg);
    }
   else{
    NotificationManager.error("Something Went Wrong");   
    setupload(0) 
  }
  }
  
    }
    const reset=()=>{
      setupload(0)
         setFiles([])
         setEnabled(false)
  setBatchname('')
  setBatchid("")
  setTopic("")
  setUrl("")
  setUrll("")
  setBirth(null)
  setDate(null)
  setFilename("")
  setCourseid("")
  setCoursename("")
  setFinally("")
            NotificationManager.success("Reset Values!") 
    }
  useEffect(() => {
    //$('.yoho').css('background-color', "red");
   fetchCategory();
   fetchBatch();
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
   let A=value.toString().split(" ").slice(1, 5).join(" ")
    setDate(A)
 }
    else{
    setDate(null)
    }
    setBirth(value)
  }

  const fetchBatch=()=>{
    const token = localStorage.getItem("token");  
    axios.get("http://localhost:9000/api/batches/find",{
  headers: {
    Authorization: token,
  },
}).then((result)=>{
  setListt(result.data.userlist) 
})
.catch((err)=>
{console.log(err)})
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
   const  handleBatch=(event)=>{
    var text = event.nativeEvent.target.outerText
    setBatchid(event.target.value);
    setBatchname(text);
    setFinally(event.nativeEvent.target.attributes.name.value)
    }

const fillBatches=()=>{
  return listt.map(function(item){
    return (
     listt.length > 10 ? 
        (<MenuItem className="yoho" style={window.innerWidth> 500 ? {width:"50%",float:"left"}: {}} name={item.courseid} value={item._id} key={item._id}>
         {item.coursename}{" "}{item.week}{" "}{item.timing}
        </MenuItem>) :
        (<MenuItem  value={item._id} name={item.courseid} key={item._id}>
        {item.coursename}{" "}{item.week}{" "}{item.timing}
       </MenuItem>)
    )
        }
  )
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
         <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Select Batch</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-selectt"
          value={batchid}
          onChange={(event)=>handleBatch(event)}
        >  
          {fillBatches()}
        </Select>
      </FormControl> 
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
        <Grid item xs={12}>
  { uploadPercentage > 0 && <ProgressBar now={uploadPercentage}  label={`${uploadPercentage}%`} className="meter" style={{marginBottom:"5px",width:"100%"}}/> }
  </Grid>
       
      <Grid item style={{display:'flex',justifyContent:'flex-end',width:"1.5em"}} xs={12} sm={6}>
      {enabled ? (
        <Button variant="contained" color="primary" type="button" onClick={handleSubmit} >
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
        <Button disabled variant="contained" color="primary" type="button" onClick={handleSubmit} >
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
     </div>
 </div>
 
 </>
  );
};

export default Topic;

