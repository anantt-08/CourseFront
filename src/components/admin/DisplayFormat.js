import React,{useState,useEffect} from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {isEmpty} from '../Checks';
import axios from "axios";
import { Spinner } from "react-bootstrap";
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

export default function DisplayFormat()
{ const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [yo, setYo] = useState("");
  const [getCategoryId,setCategoryId]=useState('')
  const [getCategoryName,setCategoryName]=useState('')
  const [getCategoryDescription,setCategoryDescription]=useState('')
  const [getCategoryIcon,setCategoryIcon]=useState({fileBytes:'',fileUrl:'/noimage.png'})
  const [getCategoryPrerequisie,setCategoryPrerequisie]=useState('')
  const [getCategoryDuration,setCategoryDuration]=useState('')
  const [getBtnSaveIcon,setBtnSaveIcon]=useState(false)
  const [getErrorPic,setErrorPic]=useState({cn:'',cd:'',ci:'',cdu:'',cp:''})
  const [loading,setloading]=useState(true)
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    
    const [columns, setColumns] = useState([
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Duration', field: 'duration' },
        { title: 'Prerequisite', field: 'prerequisie' },
        { title: 'Icon', field: 'image', render: rowData => <img src={process.env.PUBLIC_URL + `images/${rowData.image}`} 
        style={{width: 50, height:50, borderRadius: '5%'}}/> },
      ]);
   
      
      const handleClose = () => {
        setOpen(false);
      };
    const fetchData=()=>{
      console.log(data)
      const token = localStorage.getItem("token");  
axios.get("http://localhost:9000/api/courses/find",{
  headers: {
    Authorization: token,
  },
}).then((res)=>{
  setTimeout(() => {
    
  setloading(false)
  setData(res.data.userlist.sort())
  console.log(data)
  }, 300);
}).catch((err)=>{console.log(err)})
}

useEffect(function(){
fetchData()
},[])    

const handleIcon=(event)=>{
  setCategoryIcon({fileBytes:event.target.files[0],fileUrl:URL.createObjectURL(event.target.files[0])})
  setBtnSaveIcon(true)
  
  }
    const handleSaveIcon=(e)=>{
      e.preventDefault();
      const token = localStorage.getItem("token");  
   var formData=new FormData()
  
   formData.append('image',getCategoryIcon.fileBytes) 
  const config={headers:{'content-type':'multipart/form-data',
  Authorization: token}
}
axios.get(`http://localhost:9000/api/courses/unlink/${yo}`,{
  headers: {
    Authorization: token,
  }
}).then((res)=>{
   console.log("YO")
}).catch((err)=>{
  console.log(err)
})
axios
.put(`http://localhost:9000/api/courses/editcourseicon/${getCategoryId}`,formData,config)
.then((res)=>{
  NotificationManager.success("Updated!!") 
  fetchData()
  setOpen(false)
}).catch((err)=>{
  NotificationManager.error("Boom!!") 
}) 
    }
   

    const handleSubmit=async(e)=>{
      const token = localStorage.getItem("token");  
      var error=false
    var cn=isEmpty(getCategoryName)
    var cd=isEmpty(getCategoryDescription)
    var cdu=isEmpty(getCategoryDuration)
    var cp=isEmpty(getCategoryPrerequisie)
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
 
    var body={description:getCategoryDescription,prerequisie:getCategoryPrerequisie,name:getCategoryName,duration:getCategoryDuration}
 console.log(body)
 var result=await axios.put(`http://localhost:9000/api/courses/editcoursedetail/${getCategoryId}`,body,{
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
  
return( 
<Dialog
  fullScreen={fullScreen}
  open={open}
  onClose={handleClose}
  aria-labelledby="responsive-dialog-title"
>
  <DialogTitle id="responsive-dialog-title">{"Edit Category"}</DialogTitle>
  <DialogContent>
    <Grid container spacing={2}>
        <Grid item xs={12}>
        <img src={`/${getErrorPic.cn}`} className={classes.yoo}/> 
        <TextField  value={getCategoryName} id="outlined-basic" label="Course Name" inputProps={{
            readOnly: true,
            disabled: true,
          }} variant="outlined"  fullWidth  style={{
            background:" #eaeae1    "
          }} />
        </Grid>

        <Grid item xs={12}>
        <img src={`/${getErrorPic.cd}`} className={classes.yoo}/> 
        <TextField value={getCategoryDescription} onChange={(event)=>setCategoryDescription(event.target.value)} id="outlined-basic" label="Category Description" variant="outlined" fullWidth />
        </Grid>

        <Grid item xs={12}>
        <img src={`/${getErrorPic.cdu}`} className={classes.yoo}/> 
        <TextField value={getCategoryDuration} onChange={(event)=>setCategoryDuration(event.target.value)} id="outlined-basic" label="Category Duration" variant="outlined" fullWidth />
        </Grid> 

        <Grid item xs={12}>  
        <img src={`/${getErrorPic.cp}`} className={classes.yoo}/> 
        <TextField value={getCategoryPrerequisie} onChange={(event)=>setCategoryPrerequisie(event.target.value)} id="outlined-basic" label="Category Prerequisite" variant="outlined" fullWidth />
        </Grid>

     <Grid item style={{display:'flex'}} xs={12} >
     <Button variant="contained" color="primary" onClick={()=>handleSubmit()}>
      Edit Data
     </Button>
     </Grid>
     <Grid item xs={12} >
      <Divider />
     </Grid>
     <Grid item xs={12} sm={6}>
        <img src={`/${getErrorPic.ci}`} className={classes.yoo}/> 
        <input
        className={classes.input}
        id="icon"
        type="file"
        onChange={(event)=>handleIcon(event)}
      />
      <div style={{display:'flex',flexDirection:'row'}}>
       <div style={{padding:3}} >
       <label htmlFor="icon">
        <Button variant="contained" color="primary" component="span" >
          Change Icon
        </Button>
       </label>
        </div>
        <div style={{padding:3}}>
      {getBtnSaveIcon?<Button onClick={handleSaveIcon} color="primary" variant="contained" autoFocus>
      Save Icon
    </Button>:<div></div>}
       </div>
       </div>
        </Grid>
        {/* {alert(getCategoryIcon.fileUrl)} */}
      <Grid item style={{display:'flex',justifyContent:'center'}} xs={12} sm={6}>
      {/* status ?  process.env.PUBLIC_URL + `${getCategoryIcon.fileUrl.slice(getCategoryIcon.fileUrl.indexOf("/"))}`  : */}
       <img  src= {getCategoryIcon.fileUrl} alt={`${getCategoryIcon.fileUrl}`}
        variant="rounded" className={classes.large} />
       </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary" autoFocus>
      Close
    </Button>
  </DialogActions>
</Dialog>)

}

const handleEdit=(rowData)=>

{
  
  setCategoryId(rowData._id)
  setCategoryName(rowData.name)
  setCategoryDescription(rowData.description)
  setCategoryDuration(rowData.duration)
  setCategoryPrerequisie(rowData.prerequisie)
  setCategoryIcon({ fileBytes:'',fileUrl:`images/${rowData.image}`})
  setYo(rowData.image)
  setBtnSaveIcon(false)
  setErrorPic({cn:'tic.png',cd:'tic.png',ci:'tic.png',cdu:'tic.png',cp:'tic.png'})
  setOpen(true)
}
const handleDelete=(oldData)=>{
  console.log(oldData)
  const token = localStorage.getItem("token");  
 //alert(oldData.categoryname)
axios.delete(`http://localhost:9000/api/courses/find/${oldData._id}`,{
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
        title="Courses List"
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

