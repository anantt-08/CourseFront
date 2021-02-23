import React,{useState,useEffect} from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {isEmpty} from '../Checks';
import axios from "axios";
import { Spinner } from "react-bootstrap";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import InputLabel from '@material-ui/core/InputLabel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'; 
import "bootstrap/dist/css/bootstrap.min.css";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import "./batch.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';

const useStyles = makeStyles((theme) => ({
    root: {
      display:'flex',
      alignContent:'center',
       justifyContent:'center',
       
    },

    subdiv:{
        display:'flex',
        alignContent:'center',
         justifyContent:'center',
         padding:10, 
         width:"90%", 
         '& .MuiPaper-root ':{
           width:"100%"
         }  
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
    yoo:{
      width:20,
      height:20
    }
}))  

export default function Showbatch()
{ const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [getErrorPic,setErrorPic]=useState({cn:'',cd:'',cdu:'',cp:''})
  const [loading,setloading]=useState(true)
  const[coursename,setCoursename]=useState("");
  const[getBatchid,setBatchid]=useState("");
  const[date,setDate]=useState(null);
  const[time,setTime]=useState("");
  const [week,setWeek]=useState("select");
  const[list,setList]=useState([]);
  const[courseid,setCourseid]=useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    
    const [columns, setColumns] = useState([
        { title: 'CourseName', field: 'coursename' },
        { title: 'StartDate', field: 'startdate' },
        { title: 'WeekDays', field: 'week' },
        { title: 'Batch Timings', field: 'timing' }
      ]);
    
      const handleClose = () => {
        setOpen(false);
      };

    const fetchData=()=>{
      const token = localStorage.getItem("token");  
axios.get("http://localhost:9000/api/batches/find",{
  headers: {
    Authorization: token,
  },
}).then((res)=>{
  setTimeout(() => {    
  setloading(false)
  setData(res.data.userlist)
 // console.log(data)
  }, 300);
}).catch((err)=>{console.log(err)})
}


const handleSelect=(e)=>{
    setWeek(e)
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
  var text = event.nativeEvent.target.outerText;
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
useEffect(function(){
fetchData();
fetchCategory();
},[])    

    const handleSubmit=async(e)=>{
      const token = localStorage.getItem("token");  
      var error=false
    var cn=isEmpty(coursename)
    var cd=isEmpty(date)
    var cdu=isEmpty(time)
    var cp=isEmpty(week)
    if(cn.err)
    { error=cn.err
     }

    if(cd.err)
    { error=cd.err
      }
    if(cdu.err)
    {error=cdu.err}

    if(cp.err)
    {error=cp.err}
    
    setErrorPic({cn:cn.img,cd:cd.img,cdu:cdu.img,cp:cp.img})
    
  //alert(error)
  if(!error)
  
  {
 
    var body={coursename:coursename,
        timing:time,
        week:week,
        courseid:courseid,
        startdate:date}
 var result=await axios.put(`http://localhost:9000/api/batches/editbatch/${getBatchid}`,body,{
  headers: {
    Authorization: token,
  },
})
if(result)
NotificationManager.success("Record Updated!!") 
else
NotificationManager.error("Failed To update!!") 
  fetchData()
 setOpen(false)
  }
}


const showEditContent=()=>{
    console.log(coursename,courseid,"hey")
return( 
<Dialog
  fullScreen={fullScreen}
  open={open}
  onClose={handleClose}
  aria-labelledby="responsive-dialog-title">
  <DialogTitle id="responsive-dialog-title">{"Edit Batch"}</DialogTitle>
  <DialogContent>
    <Grid container spacing={2}>
    <Grid item xs={12}>
        
    <img src={`/${getErrorPic.cn}`} className={classes.yoo}/> 
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
        
        
         <Grid item xs={12}>     
         <img src={`/${getErrorPic.cd}`} className={classes.yoo}/>         
        <TextField value={date} onChange={(event)=>setDate(event.target.value)} id="outlined-basic" label="StartDate" variant="outlined" fullWidth />
        </Grid>    
         <Grid item xs={12}  style={{display:"block"}}>
         <img src={`/${getErrorPic.cp}`} className={classes.yoo}/> 
      <label style={{fontFamily:"cursive",fontStyle:"italic",fontWeight:"500",fontSize:"18px", marginTop:"20px",width:"100%"}} >
                        
                             Choose WeekDays Of Batch:
                            </label> 
      <DropdownButton
      alignRight
      title={week}
      id="dropdown-menu-align-right"
      onSelect={handleSelect}
        >
              <Dropdown.Item eventKey="MWF">MWF</Dropdown.Item>
               <Dropdown.Divider />
              <Dropdown.Item eventKey="TTS">TTS</Dropdown.Item>
               <Dropdown.Divider />
              <Dropdown.Item eventKey="REGULAR">REGULAR</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="WEEKENDs">WEEKENDs</Dropdown.Item>
      </DropdownButton>
     </Grid>
     <Grid item xs={12}>
        <img src={`/${getErrorPic.cdu}`} className={classes.yoo}/> 
        <TextField value={time} onChange={(event)=>setTime(event.target.value)}
        id="outlined-basic" label="BatchSlot Timing" variant="outlined" fullWidth />
        </Grid> 

     <Grid item style={{display:'flex'}} xs={12} >
     <Button variant="contained" color="primary" onClick={()=>handleSubmit()}>
      Edit Data
     </Button>
     </Grid>
     <Grid item xs={12} >
      <Divider />
     </Grid>
    </Grid> 
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary" autoFocus>
      Close
    </Button>
  </DialogActions>
</Dialog>
)}

const handleEdit=(rowData)=>

{  
  setBatchid(rowData._id)
  setCoursename(rowData.coursename)
  setDate(rowData.startdate)
  setTime(rowData.timing)
  setWeek(rowData.week)
  setCourseid(rowData.courseid)
  setErrorPic({cn:'tic.png',cd:'tic.png',cdu:'tic.png',cp:'tic.png'})
  setOpen(true)
}
const handleDelete=(oldData)=>{
  const token = localStorage.getItem("token");  
 //alert(oldData.categoryname)
axios.delete(`http://localhost:9000/api/batches/deletebatch/${oldData._id}`,{
  headers: {
    Authorization: token,
  }
}).then((res)=>{
  NotificationManager.success("Success!!") 
}).catch((err)=>{
  NotificationManager.error(err.response.data.msg)     
})  
}

function Editable() {
  
    return (

        <div className={classes.subdiv}>
      {!loading ? (
              <div></div>
            ) : (
              <div style={{ position: 'fixed',zIndex:999, 
                top: '48%',
                                left: '58%' ,  transform: 'translate(-50%, -50%)'
                              }}>
                <Spinner animation="border" variant="danger" size="xl" />
                    <Spinner animation="border" variant="danger" size="xl" />
              </div>
            )}
              <MaterialTable
        title="Batch List"
        columns={columns}
        data={data}
        
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              handleEdit(rowData)
            }
          }
        ]}

        editable={{
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                handleDelete(oldData)
                resolve()
              }, 1000)
            }),
        }}
      />
      </div>
    )
  }
  




return(
<div className={classes.root}>
<NotificationContainer />
{Editable()}
{showEditContent()}
</div>)
}

