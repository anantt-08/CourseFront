import React, { useState,useEffect } from 'react';
import axios from "axios";
import Grid from '@material-ui/core/Grid';

const Status = (props) => {
const [status,setStatus]=useState("loading....")
    useEffect(()=>{
        const token = localStorage.getItem("token");
 axios
 .get(`http://localhost:9000/api/batches/findbyid/${props.id}`, {
   headers: {
     Authorization: token,
   },
 }).then((res)=>{
setStatus(res.data.userlist.status)
 })
    },[props])
    const color = status=="Completed"? 'red' :  status=="Upcoming" ? "blue" : "darkgreen"
    return (

           <Grid item xs={12}> 
                 {props.name.split(" ")[0]} <span style={{color:color,fontWeight:"500",fontStyle:"italic"}}> 
    &nbsp;&nbsp;{status}
    </span>
         </Grid>
    );
};

export default Status;