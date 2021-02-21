import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { Spinner } from "react-bootstrap";
import "./user.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Fab from "@material-ui/core/Fab";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { FaRegTrashAlt } from "react-icons/fa";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Displaytopic extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false,
      width:0,
      height:0,
      list:[],
      dictt:{},
      coursenames:{},
      names:[]
    };
  }

  async componentWillMount() {
    const token = localStorage.getItem("token");
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    try {
      let res= await  axios.get("http://localhost:9000/api/topics/batch",{
        headers: {
            Authorization: token,
          }   
    })
    res.data.userlist.sort();
    this.setState({ list: res.data.userlist });
    let dict={}  
    // var items = Object.values(cart) if cart= object
    this.state.list.map((item)=>{
      dict[item]=item  
    })
     this.setState({dictt:dict});
     //alert(this.state.dictt)
     }
     catch(err){
      console.log(err)
    } 
    try {
      let resp= await axios .get("http://localhost:9000/api/courses/names",{
        headers: {
          Authorization: token,
        }
      })
    this.setState({ names: resp.data.userlist });
    console.log(this.state.names)
    let yoho={}  
    this.state.names.map((item)=>{
      yoho[item.name]=item.name  
    })
     this.setState({coursenames:yoho});
     //alert(this.state.dictt)
     console.log(this.state.coursenames)
     }
     catch(err){
      console.log(err)
    } 
   try{
    let yoo=await axios
    .get("http://localhost:9000/api/topics/result", {
      headers: {
        Authorization: token,
      },
    })
    yoo.data.userlist.sort();
      this.setState({ DATA: [...yoo.data.userlist] });
      this.setState({ loading: true });
     
  }
      catch(err){
        console.log(err)
      } 
  }

  deleteData = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:9000/api/topics/result/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        NotificationManager.success(res.data.msg);
        this.componentWillMount();
      })
      .catch((err) => {
        NotificationManager.error(err.response.data.msg);
      });
  };
  
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
   // console.log(this.state.width)
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
 
  render() {
   //console.log(this.state.list)
//console.log(this.state.width)
//console.log(this.state.dictt)
const selectNames=this.state.coursenames;
const selectOptions =   this.state.dictt;
      const matches= (this.state.width>750) ? true:false 
    const columns =  [
      {
        dataField: "_id",
        text: "Id",
        hidden: true,
        editable: false
      },
      {
        dataField: "coursename",
        text: "CourseName",
        sort: true,
        formatter: (cell,row )=>{
        // console.log(cell)
        // {alert(cell)}

        return( selectNames[cell] )
        },style:{
          fontWeight:"500",
          textTransform: "uppercase"
        }
        ,
  filter: selectFilter({
    options: selectNames
  }),
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      },
      },
      {
        dataField: "topicname",
        text: "TopicName",
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",'whiteSpace': 'nowrap', width: '198px' , wordWrap:'break-word',fontWeight:"bold",background:"#858796",color:"white"};
      }
      },
      {
        dataField: "time",
        text: "DateAndTime",
        sort: true,
        editable:false,
        formatter: (cell,row )=>{
          let arr=row.time.split(" ").slice(0, 3)
          let timee=row.time.split(" ").slice(3,)
          var yoho=[];
          console.log(arr)
          timee=timee[0].split(":")
          
          console.log(timee)
          if(timee[0]>12){
            yoho.push(12-parseInt(timee[0]))
            yoho.push(timee[1])
            yoho.push("PM")
          }
          else{
            yoho.push(parseInt(timee[0]))
            yoho.push(timee[1])
            yoho.push("AM")
          }
          return( arr + " " + yoho.join(":",0,2) )
          },
        headerStyle: (colum, colIndex) => {
          return {textAlign:"center",fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '178px' , wordWrap:'break-word'};
      }, sortFunc: (a, b, order, dataField) => {
        if (order === 'asc') {
         a= a.toString().split(" ").slice(0, 4)
         b = b.toString().split(" ").slice(0, 4)
      //   console.log(a,b)
        // console.log(new Date(a))
         return new Date(b) - new Date(a);
        }
       else{
        a= a.toString().split(" ").slice(0, 4)
        b = b.toString().split(" ").slice(0, 4)
        return new Date(a) - new Date(b);
       }
    }
      },
     {
        dataField: "batch",
        text: "BatchName"
        ,
        formatter: (cell,row )=>{
        // console.log(cell)
        // {alert(cell)}

        return( selectOptions[cell] )
        },
  filter: selectFilter({
    options: selectOptions
  }),
  style:{
    fontWeight:"bold"
  },
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      },
      },
      {
        dataField: "courseid",
        text: "FilesUploaded",
        headerStyle: (colum, colIndex) => {
          return {textAlign:"center", fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '178px' , wordWrap:'break-word'};
      },
      style:{
       fontSize:"14px",
       fontStyle:"italic",
       color:"rgb(128, 5, 30)"
      },
      editable: false,
      formatter: (cellContent, row) => (
        (row.pdf=="" && row.ppt=="") ? <div>Program Only</div> : (row.pdf=="") ? <div>Program , PPT</div>: 
        (row.ppt=="") ? <div>Program, PDF</div> : <div>Program,PPT and PDF</div>
      )
    }
    ,
    {
        dataField: "operation",
        text: "Delete",
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '148px' , wordWrap:'break-word'};
      },
        style: {
          width: 10,
        },
        editable: false,
        formatter: (cellContent, row) => (
          <div>
            <Fab
              color="secondary"
              aria-label="delete"
              size="small"
              onClick={() => {
                this.dialog.show({
                  title: "Confirmation",
                  body: "Are you sure delete data?",
                  actions: [
                    Dialog.CancelAction(),
                    Dialog.OKAction(() => {
                      this.deleteData(row._id);
                    }),
                  ],
                  bsSize: "small",
                  onHide: (dialog) => {
                    dialog.hide();
                    console.log("closed by clicking background.");
                  },
                });
              }}
            >
              <FaRegTrashAlt />
            </Fab>
          </div>
        ),
      },
      
    ]
const defaultSorted = [{
  dataField: 'time',
  order: 'asc'
}];


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

const rowStyle = (row, rowIndex) => {
    const style = {};
    style.textAlign="center";
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
          style={ { color: 'red', width:"100%" , border:"2px solid red"} }
          
          delay={ 1000 }
          placeholder="Search!"
        />
        <BootstrapTable
        wrapperClasses="table-responsivee"
            { ...props.baseProps }
            bootstrap4
  defaultSorted={ defaultSorted  }
  rowStyle={ rowStyle }
  filter={ filterFactory() } 
            pagination={paginationFactory(options)}
 hover
        />
      </div>
    )
  }
</ToolkitProvider>
              </Tab>
            </Tabs>
            <Dialog
              ref={(component) => {
                this.dialog = component;
              }}
            />
          </Container>
        </div>
      </>
    );
  }
}
