import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import InputLabel from '@material-ui/core/InputLabel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'; 
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from '@material-ui/core/TextField';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import "./batch.css";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdbreact';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker
  } from '@material-ui/pickers';
  import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    alignContent:'center',
     justifyContent:'center'
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


const Addbatch = () => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(null);
  const[list,setList]=useState([]);
  const[coursename,setCoursename]=useState("");
  const[birth,setBirth]=useState(null);
  const[date,setDate]=useState(null);
  const[time,setTime]=useState("");
  const[courseid,setCourseid]=useState("");
  const [week,setWeek]=useState("select");
  const[duration,setDuration]=useState("select");
  const  handleSubmit= (e)=> {
    e.preventDefault();
     if(week=="select"){
         return NotificationManager.error("Select WeekDays (Cant Be Empty)!") 
     }
     if(duration=="select"){
      return NotificationManager.error("Select Duration (Cant Be Empty)!") 
  }
  let dateee=new Date().toString().split(" ").slice(1, 4).join(" ")
     const data = {
        coursename:coursename,
        timing:time,
        week:week,
        startdate:date,
        courseid:courseid,
        duration:duration,
        status:"Upcomming",
        lastdate:dateee
      };
      const token = localStorage.getItem("token");
      axios
      .post("http://localhost:9000/api/batches/batch",data,{
        headers: {
          Authorization: token,
        }
      })
      .then(result => {
          console.log(result)
          setSelectedDate(null);
          setCoursename("");
          setBirth(null);
          setDate(null);
          setTime("");
          setCourseid("");
          setWeek("select");
          setDuration("select");
        NotificationManager.success(result.data.msg);
      })
      .catch((err) => {
        console.log(err)
    })
}  
const handleSelectt=(e)=>{
  setDuration(e)
  }

    const handleSelect=(e)=>{
        setWeek(e)
        }
     
  useEffect(() => {
   fetchCategory();
  //  var d=new Date(new Date().toString().split(" ").slice(1, 4).join(" "))
  // alert(new Date(d.setMonth(d.getMonth() + 3)))
  }, []);

 
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

   const handleDateChange = (newValue) => {
    let hours = newValue.getHours().toString().padStart(2, "0");
    const minutes = newValue.getMinutes().toString().padStart(2, "0")
    let yoho=[]
    if(hours>=12){
        hours=12-parseInt(hours)
        if(hours==0){
            hours=12
        }
        yoho.push(hours)
        yoho.push(minutes)
        yoho.push("PM") 
    }
      else{
       if(hours=="00"){
         yoho.push(12)
       }  
       else{
        yoho.push(parseInt(hours))
       }
        yoho.push(minutes)
        yoho.push("AM")
      }
      if(yoho[0].toString().slice(0,1)=="-"){
        yoho[0]="0"+yoho[0].toString().slice(1,2)
      }
       var textValue= yoho.join(":") 
    setTime(textValue);
    console.log(textValue)
    setSelectedDate(newValue); 
};  

  return (
    <>
   <NotificationContainer />
   <MDBContainer style={{ marginTop: 20 }} >
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
             
 <div className={classes.root} >
    <div className={classes.maindiv}>
      <div className={classes.headingdiv}>
       <i> <h3  style={{textAlign:"center",color:"#337d54",justifyContent:"center",fontWeight:"bold",fontFamily:"'Vazir', sans-serif"}}>Add New Batches!</h3>
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
             height="20px"
             width="40px"
             minDate={new Date().setDate(new Date().getDate() + 1)}
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
         <Grid item xs={12} sm={6} style={{display:"block"}}>
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
     <Grid item xs={12} sm={6} style={{display:"block"}}>
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
      <span style={{fontSize:"22px",fontStyle:"italic",marginTop:"22px",textDecoration:"underline",position:"absolute",color:"red",fontWeight:"600"}}>Months</span>
     </Grid>
     <Grid item xs={12} sm={6} style={{marginTop:"7px"}} id="yohooney" >
        <TextField
        value="Upcoming"
       label="Batch Status" variant="outlined" disabled  fullWidth />
        </Grid>
     <MuiPickersUtilsProvider utils={DateFnsUtils}>
     <Grid item xs={12} sm={6}>
     <FormControl fullWidth > 
     <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Batch Timings"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
        </FormControl >
     </Grid>
    </MuiPickersUtilsProvider>
      <Grid item style={{display:'flex',justifyContent:'center' , marginTop:"10px"}} xs={12}>
        <Button variant="contained"  style={{
        backgroundColor: "lightgreen",
        fontSize: "18px",
        color:"#337d54"
    }} type="button" onClick={handleSubmit} >
        Submit
       </Button>
      </Grid>
     </Grid>
     </div>
 </div>
 
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
 </>
  );
};
export default Addbatch;