import React, { useState,useEffect } from 'react';
import axios from "axios";
const Status = (props) => {
const [status,setStatus]=useState("")
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
    return (
        <div>
            {props.name} {status}
        </div>
    );
};

export default Status;