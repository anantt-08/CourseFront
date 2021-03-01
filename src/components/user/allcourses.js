import React, { useEffect, useState } from 'react';
import "./allcourses.css";
import axios from "axios";
import Spinner from "../../spinner";
const Allcourses = () => {
    const [data,setData]=useState([]);
    const[loading,setloading]=useState(false);
    useEffect(() => { 
       setdata();
      }, [])
      const setdata=()=>{
        const token = localStorage.getItem("token");  
  axios.get("http://localhost:9000/api/courses/find",{
    headers: {
      Authorization: token,
    },
  }).then((res)=>{
    setTimeout(()=>{
      setData(res.data.userlist)
      setloading(true)
    },600)
   
  }).catch((err)=>{console.log(err)})
  }
    return (
      <>
      {loading ? <></>:<div style={{marginLeft:"-50px"}}><Spinner /></div> }
        <div className="course-cats-area default-padding bottom-less">
            <div className="container">
            <div className="row text-center text-light">
                {data.map((item)=>{
             return(       
            <div className="single-item equal-height col-md-4 col-sm-6" style={{height: "133px"}}>
                <div className="item"><a 
                 style={{backgroundImage:`url(${process.env.PUBLIC_URL + '/images/' + item.image})` }}>
                     <h5>{item.name}</h5>
                     <span>Duration:{item.duration}</span>
                     <span style={{fontStyle:"italic",fontWeight:"500"}}>PreRequisite-{item.prerequisie}</span>
                     <span>{item.description}</span>
                     </a>
                     </div> 
                     </div>
             )
                })
                
   }
                </div>
              </div>
           </div> 
</>
    );
};

export default Allcourses;