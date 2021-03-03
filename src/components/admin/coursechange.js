import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import "./user.css";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Status from "./status";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Multiselect } from 'multiselect-react-dropdown';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Button from '@material-ui/core/Button';

export default class Userlist extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false,
      width:0,
      height:0,
      optio:[],
      batchname:"",
batchid:"",
finaly:"",
listt:[],
open:false,
selectedlistt:[],
selecteditem:"",
idd:"",
empty:false
    };
  }

handleBatch=(event)=>{
  console.log( event.nativeEvent.target.outerText)
  console.log(event.nativeEvent.target.attributes.name.value)
  var text = event.nativeEvent.target.outerText
  this.setState({ 
    batchid:event.target.value,
  batchname:text
,finaly:event.nativeEvent.target.attributes.name.value});
  }

 fillBatches=()=>{
   
 let a=  this.state.listt.length
  return this.state.listt.map(function(item){
    return (
   a > 10 ? 
        (<MenuItem className="yoho" style={window.innerWidth> 500 ? {width:"50%",float:"left"}: {}} 
        name={item.courseid} value={item._id} key={item._id}>
         {item.coursename}{" "}{item.week}{" "}{item.timing}
        </MenuItem>) :
        (<MenuItem  name={item.courseid}  value={item._id} key={item._id}>
        {item.coursename}{" "}{item.week}{" "}{item.timing}
       </MenuItem>)
    )
        }
  )
 }
  handleClickOpen = () => {
  this.setState({open:true});
};

 handleClose = () => {
  this.setState({open:false,
    batchname:"",
    batchid:"",
    finaly:"",
    listt:[],
selectedlistt:[],
selecteditem:"",
idd:"",
empty:false});
};
passresult=() =>{
 const token = localStorage.getItem("token");  
	let body={
		courseid:this.state.selectedlistt,
		batchname:this.state.batchname,
    batchid:this.state.batchid
	}
 axios.put(`http://localhost:9000/api/users/changecourseid/${this.state.idd}`,body,{
        headers: {
          Authorization: token,
        },
      }).then(
        (res)=>{
            NotificationManager.success("Added");
            this.handleClose();
            this.UNSAFE_componentWillMount();
        })
        .catch((err)=>{
            NotificationManager.error(err.response.data.msg);
            
        })
}
resetvalues=()=>{
  this.setState({   DATA: [],
    loading: false,
    width:0,
    height:0,
    optio:[]})
  this.handleClose();
  this.UNSAFE_componentWillMount();
}
onSelect(selectedList, selectedItem,id) {
  const token = localStorage.getItem("token");
  axios.get(`http://localhost:9000/api/batches/find/${selectedItem.id}`,{
headers: {
  Authorization: token,
},
}).then((result)=>{
  if(result.data.user.length===0){
    this.setState({empty:true})
  }
    this.setState({listt:result.data.user,
    	selecteditem:selectedItem,selectedlistt:selectedList,idd:id})
      this.handleClickOpen();
})
.catch((err)=>
{console.log(err)})
   
}

onRemove(selectedList, removedItem,id) {
    const token = localStorage.getItem("token");
//  console.log(removedItem)

    axios.get(`http://localhost:9000/api/users/findnameyeah/${id}`,{
      headers: {
        Authorization: token,
      },
    }).then((res)=>{
      let bitch=res.data.userlist.batchname.filter((e)=>e.name.includes(removedItem.name))[0]
      let body={
        courseid:selectedList,
        batchname:bitch.name,
        batchid:bitch.id
      }
      axios.put(`http://localhost:9000/api/users/removechangecourseid/${id}`,body,{
        headers: {
          Authorization: token,
        },
      }).then(
        (res)=>{
            NotificationManager.success("Removed");
            this.handleClose();
            this.UNSAFE_componentWillMount();
        })
        .catch((err)=>{
            NotificationManager.error(err.response.data.msg);
            
        })
    })
    .catch((err)=>{
      console.log(err)
    })
   
}
getstatuss = async(id) =>{
  const token = localStorage.getItem("token");
 let resultt=await axios
 .get(`http://localhost:9000/api/batches/findbyid/${id}`, {
   headers: {
     Authorization: token,
   },
 })
 console.log(resultt.data.userlist.status,"Yipeeee")
 return resultt.data.userlist.status
}
  UNSAFE_componentWillMount() {
    const token = localStorage.getItem("token");
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
 // console.log(this.state.optio)  
    axios
      .get("http://localhost:9000/api/users/userlist", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        res.data.userlist.sort();
        this.setState({ DATA: [...res.data.userlist] });
        this.setState({ loading: true });
      });
     
        axios
        .get("http://localhost:9000/api/courses/findd",{
          headers: {
            Authorization: token,
          }
        })
        .then(result => {
            let arr=[]
      result.data.userlist.forEach((e)=>{    
        const {
            _id: id,
            name:name
        } = {...e}
        const new_obj = Object.assign(
            {},
            {
               id,
              name
            }
        );    
        arr.push(new_obj)
    })
    this.setState({optio:arr})
      }) 
        .catch(err => {
    console.log(err)
        });
    }
 

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
   // console.log(this.state.width)
  };
  UNSAFE_componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render() {
console.log("y",this.state.optio)
    const matches= (this.state.width>765) ? true:false 
    
    const columns = matches ? [
      {
        dataField: "_id",
        text: "Id",
        hidden: true,
        editable: false
      },
      {
        dataField: "name",
        text: "UserName",
        sort: true,
        
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white"};
      },
      },
      {
        dataField: "email",
        text: "Email",
    
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white" 
}
      },
      }
  ,
    {
      dataField: "type",
      text: "Alloted Course",
      
  filter: textFilter(),
      headerStyle: (colum, colIndex) => {
        return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '320px' , wordWrap:'break-word'};
    },
      style: {
        width: '70px',
        textAlign:"center"
      },
      editable: false,
      formatExtraData:this.state.optio,
      formatter: (cellContent, row,formatExtraData) =>{
      //   console.log(row.courseid,"MyMY")
        return  (
            <Multiselect
            options={this.state.optio} // Options to display in the dropdown
            selectedValues={row.courseid} // Preselected value to persist in dropdown
            displayValue="name"	
            onSelect={(a,b) => this.onSelect(a,b,row._id)} 
            onRemove={(a,b) => this.onRemove(a,b,row._id)}  
            style={
                {
                      
                    searchBox: { // To change search box element look
                      border: 'none',
                      fontSize: '15px',
                      minHeight: '50px',
                    },
                    inputField: { // To change input field position or margin
                        margin: '5px',
                        color:"green"
                    },
                    chips: { // To change css chips(Selected options)
                      background: 'red'
                    },
                    optionContainer: { // To change css for option container 
                      border: '2px solid white'
                    },
                    option: { // To change css for dropdown options
                      color: 'black',
                      fontWeight:"450"
                    } 
                    
                  }
            }
            />
             )
    }

    }
    ,
    {
      dataField: "batchname",
      text: "Alloted Batch",
      
  filter: textFilter(),
      headerStyle: (colum, colIndex) => {
        return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '300px' , wordWrap:'break-word'};
    },
      style: {
        textAlign:"center"
      },
      editable: false,
      formatExtraData:this.state.optio,
      formatter: (cellContent, row,formatExtraData) =>{
        return  (
          <div style={{ outline: "none" }}>
          <Grid container spacing={1} style={{ cursor: "pointer" }}>
            {row.batchname.map((item) => {
              return (
                <>
                    <Grid item xs={12} id={item.id}> 
                      {item.name}
                    </Grid>
                </>
              );
            })}
          </Grid>
        </div>
             )
    }

    }    ,
    {
      dataField: "status",
      text: "Current Status",
      
  filter: textFilter(),
    //   headerStyle: (colum, colIndex) => {
    //     return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '300px' , wordWrap:'break-word'};
    // },
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white" 
}
      },
      style: {
        textAlign:"center"
      },
      editable: false,
      formatter: (cellContent, row) =>{
       
        return  (
          <div style={{ outline: "none" }}>
          <Grid container spacing={1}>
            {row.batchname.map((item) => {
            return  <Status id={item.id} name={item.name}/>
            })}
          </Grid>
        </div>
             )
    }

    }    
    ]
:
[
  {
    dataField: "_id",
    text: "Id",
    hidden: true,
    editable: false,
  },
  {
    dataField: "name",
    text: "UserName",
    sort: true,
    
  filter: textFilter(),
    headerStyle: (colum, colIndex) => {
      return { justifyContent:"space-between",display:"flex",fontWeight:"bold",background:"#858796",color:"white"};
  },
  },
  {
    dataField: "type",
    text: "Alloted Course",
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '320px' , wordWrap:'break-word'};
  },
    style: {
      width: '70px',
      textAlign:"center"
    },
    editable: false,
    
  filter: textFilter(),
    formatExtraData:this.state.optio,
    formatter: (cellContent, row,formatExtraData) =>{
    //   console.log(row.courseid,"MyMY")
      return  (
          <Multiselect
          options={this.state.optio} // Options to display in the dropdown
          selectedValues={row.courseid} // Preselected value to persist in dropdown
          displayValue="name"	
          onSelect={(a,b) => this.onSelect(a,b,row._id)} 
          onRemove={(a,b) => this.onRemove(a,b,row._id)}  
          style={
              {
                    
                  searchBox: { // To change search box element look
                    border: 'none',
                    fontSize: '15px',
                    minHeight: '50px',
                  },
                  inputField: { // To change input field position or margin
                      margin: '5px',
                      color:"green"
                  },
                  chips: { // To change css chips(Selected options)
                    background: 'red'
                  },
                  optionContainer: { // To change css for option container 
                    border: '2px solid white'
                  },
                  option: { // To change css for dropdown options
                    color: 'black',
                    fontWeight:"450"
                  } 
                  
                }
          }
          />
           )
  }

  }
  ,
  {
    dataField: "batchname",
    text: "Alloted Batch",
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '300px' , wordWrap:'break-word'};
  },
    style: {
      textAlign:"center"
    },
    editable: false,
    formatExtraData:this.state.optio,
    
  filter: textFilter(),
    formatter: (cellContent, row,formatExtraData) =>{
      return  (
        <div style={{ outline: "none" }}>
        <Grid container spacing={1} style={{ cursor: "pointer" }}>
          {row.batchname.map((item) => {
            return (
              <>
                  <Grid item xs={12} id={item.id}> 
                    {item.name}
                  </Grid>
              </>
            );
          })}
        </Grid>
      </div>
           )
  }

  }  

    
];

const options = {
  sizePerPage:4,
  paginationSize: 4,
  pageStartIndex: 0,
  firstPageText: 'First',
  prePageText: 'Back',
  nextPageText: 'Next',
  lastPageText: 'Last',
  nextPageTitle: 'First page',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Next page',
  lastPageTitle: 'Last page',
  disablePageTitle: true,
  sizePerPageList : [ {
    text: '4', value: 4
    }, {
    text: '8', value: 8
    },
    {text: '12', value: 12
    }
    ]
};

const defaultSorted = [{
  dataField: 'name',
  order: 'asc'
}];


const rowStyle = (row, rowIndex) => {
  const style = {};
    style.color = 'rgb(24, 43, 30)';
    style.fontWeight = 'bold';
  return style;
};

const { SearchBar } = Search;

    return (
      <>
<NotificationContainer />
        <div style={{width:"100%", background: matches ?  "#ecf0f1": "white"}}>
          <Container className="mt-3">
            {this.state.loading ? (
              <div></div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner animation="border" variant="danger" size="xl" />
                    <Spinner animation="border" variant="danger" size="xl" />
              </div>
            )}
            <Tabs defaultActiveKey="view" id="uncontrolled-tab-example" className="p-0 m-0">
              <Tab eventKey="view" title="View" >
                <ToolkitProvider
  keyField="_id"
  data={this.state.DATA}
  columns={columns}
   search
   hover
>
  {
    props => (
      <div>
        <SearchBar
          { ...props.searchProps }
          className="custome-search-field"
          style={ { color: 'red', width:"100%" , border:"2px solid blue"} }
          
          delay={ 1000 }
          placeholder="Search!"
        />
        <BootstrapTable
            { ...props.baseProps }
            bootstrap4
  defaultSorted={ defaultSorted  }
            pagination={paginationFactory(options)}
 hover
 
 filter={ filterFactory() }
 wrapperClasses="table-responsivee"
  rowStyle={ rowStyle }
        />
      </div>
    )
  }
</ToolkitProvider>
              </Tab>
            </Tabs>
            <Dialog
            style={{padding:'10px',width:"100%",margin:"5px"}}
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="max-width-dialog-title"
        disableBackdropClick={true}
        maxWidth="md"
        disableEscapeKeyDown={true}
      >
        <DialogTitle id="max-width-dialog-title">
<Icon className="fa fa-plus-circle" color="secondary" style={{marginTop:"10px",fontSize:"25px"}}/> 
          <span style={{fontStyle:"italic"}}> Select Batch For Chosen Course </span></DialogTitle>
        <DialogContent>
        {this.state.empty ?
        <p style={{color:"red",fontStyle:"italic"}}>No Upcomming/Ongoing Batches For his Course</p>
        :
        <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Select Batch</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-selectt"
          value={this.state.batchid}
          onChange={(event)=>this.handleBatch(event)}
        >  
          {this.fillBatches()}
        </Select>
        </FormControl> 
       }
       
        </DialogContent>
        <DialogActions>
         {this.state.empty ?  <Button onClick={this.resetvalues} color="secondary">
            Cancel
          </Button> :
        <>
        <Button onClick={this.resetvalues} color="secondary">
         Cancel
       </Button> 
         <Button onClick={this.passresult} color="primary">
            Confirm
          </Button>
          </> }
        </DialogActions>
      </Dialog>
          </Container>
        </div>
      </>
    );
  }
}
