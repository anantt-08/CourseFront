import React,{useState,useEffect} from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toggle from 'react-toggle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {isEmpty} from '../Checks';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
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
         width:"100%", 
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
  const[duration,setDuration]=useState("select");
  const [open, setOpen] = React.useState(false);
  const [getErrorPic,setErrorPic]=useState({cn:'',cd:'',cdu:'',cp:''})
  const [loading,setloading]=useState(true)
  const[coursename,setCoursename]=useState("");
  const[getBatchid,setBatchid]=useState("");
  const[birth,setBirth]=useState(null);
  const[date,setDate]=useState(null);
  const[time,setTime]=useState("");
  const [week,setWeek]=useState("select");
  const[list,setList]=useState([]);
  const [show, setShow] = useState(false);
  const[courseid,setCourseid]=useState("");
  const[batchidyo,setbatchidyo]=useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    const getDocumentTypeForRow = status => {
      const color = status=="Completed"? 'red' :  status=="Upcoming" ? "blue" : "green"
      return  <div style={{color:color,fontWeight:"500",fontStyle:"italic"}}> 
      {status}
      </div>
    };
    const [columns, setColumns] = useState([
        { title: 'CourseName', field: 'coursename' },
        { title: 'StartDate', field: 'startdate' },
        { title: 'WeekDays', field: 'week' },
        { title: 'Batch Timings', field: 'timing' },
        { title: 'Batch Duration', field: 'duration' ,
        render: row => <span>{ `${row["duration"]} Months` }</span> },
        {title:"Status",field:"status",
        headerStyle: {
          fontWeight: "bold",
          paddingLeft:"40px",
          paddingRight:"40px"
        },
       lookup: { "Upcoming": 'Upcoming', "Ongoing":  "Ongoing","Completed":" Completed" },
       render: rowData => 
       getDocumentTypeForRow(rowData.status)
      },
      {
        // field: "action",
        title: "Change Status",
        headerStyle: { fontWeight: "bold" },
        render: (rowData) => (
          <>
            {rowData.status =="Upcoming" ? <> </> :
      rowData.status =="Ongoing" ? <>  <Toggle
      name="changeStatus"
      defaultChecked={false}
      onClick={() => {setShow(true);setbatchidyo(rowData._id) }} />
 </> : <></> }         

      </>
        ),
      }
      ]);
      const handleClose = () => {
        setOpen(false);
      };

    const fetchData=()=>{
      const token = localStorage.getItem("token");  
axios.get("http://localhost:9000/api/batches/finnnnd",{
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
    var d=new Date()
      var e=new Date(d.setDate(d.getDate() - 1))
       var lastt=((e.toString().split(" ").slice(1, 4).join(" ")))
    var body={coursename:coursename,
        timing:time,
        week:week,
        courseid:courseid,
        startdate:date,
      duration:duration,
      lastdate:lastt
    }
    console.log(body)
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
const handleSelectt=(e)=>{
  setDuration(e)
  }

const updatestatuss=()=>{
  
  const token = localStorage.getItem("token");  
  axios.put(`http://localhost:9000/api/batches/editbatchstatus/${batchidyo}`,{},{
    headers: {
      Authorization: token,
    },
  }).then((result)=>{
    setbatchidyo("");
    setShow(false);
    NotificationManager.success("Status Updated!!")
    fetchData(); 
  }).catch((err)=>{
    NotificationManager.error("Failed To update!!") 
  })
}  
const showEditContent=()=>{
 //   console.log(coursename,courseid,"hey")
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
        
           
         <Grid item xs={8}>     
         
         <img src={`/${getErrorPic.cd}`} className={classes.yoo}/>   
         <CalendarTodayIcon style={{ fontSize: 32,marginTop:"14px",marginRight:"3px" }}/>
          <div className="customDatePickerWidth">
          <DatePicker
            className="myDatePicker"
             height="20px"
             width="40px"
            dateFormat="dd/MM/yyyy"
            isClearable={true}
            placeholderText="Select Starting Date Of Batch:"
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
      <span style={{marginTop:"22px"}}>{date}</span>   


        <Grid item xs={12} sm={6} style={{display:"block"}}>
         <img src={`/${getErrorPic.cp}`} className={classes.yoo}/> 
      <label style={{fontFamily:"cursive",fontStyle:"italic",fontWeight:"500",fontSize:"18px", marginTop:"20px",width:"100%"}} >
                        
                             Choose Duration Of Batch:
                            </label> 
      <DropdownButton
      alignRight
      title={duration}
      onSelect={handleSelectt}
      className="dropdownnn"
        >
           <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="1">1</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="2">2</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="3">3</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="4">4</Dropdown.Item>
          <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="5">5</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="6">6</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}} eventKey="7">7</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="8">8</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}} eventKey="9">9</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}} eventKey="10">10</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}} eventKey="11">11</Dropdown.Item>
              <Dropdown.Item className="dropdownnn" style={{width:"50%"}}eventKey="12">12</Dropdown.Item>
      </DropdownButton>
      <span style={{fontSize:"22px",fontStyle:"italic",marginTop:"22px",textDecoration:"underline",position:"relative",color:"red",fontWeight:"600"}}>Months</span>
     </Grid> 
         <Grid item xs={12}  style={{display:"block"}}>
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
  setBirth(new Date(rowData.startdate))
  setTime(rowData.timing)
  setWeek(rowData.week)
  setCourseid(rowData.courseid)
  setDuration(rowData.duration)
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
        options={{
          filtering: true
        }}
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

<Modal
        show={show}
        onHide={() => {setShow(false);setbatchidyo("");}}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton style={{backgroundColor:"#143d59"}}>
          <Modal.Title id="example-custom-modal-styling-title"style={{color: '#f4b41a' }} >
            Change Status?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Button variant="contained" color="secondary" onClick={updatestatuss} style={{float:"right",marginBottom:"15px",marginTop:"15px"}} >
      Update Status To Completed? 
    </Button>
        </Modal.Body>
      </Modal>
</div>)
}

