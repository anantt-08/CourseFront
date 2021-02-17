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
import { Multiselect } from 'multiselect-react-dropdown';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Userlist extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false,
      width:0,
      height:0,
      optio:[]
    };
  }
 
   
onSelect(selectedList, selectedItem,id) {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:9000/api/users/changecourseid/${id}`,selectedList,{
        headers: {
          Authorization: token,
        },
      }).then(
        (res)=>{
            NotificationManager.success("Added");
        })
        .catch((err)=>{
            NotificationManager.error(err.response.data.msg);

        })
}

onRemove(selectedList, removedItem,id) {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:9000/api/users/changecourseid/${id}`,selectedList,{
        headers: {
          Authorization: token,
        },
      }).then(
        (res)=>{
            NotificationManager.success("Removed");
        })
        .catch((err)=>{
            NotificationManager.error(err.response.data.msg);

        })
}

  UNSAFE_componentWillMount() {
    const token = localStorage.getItem("token");
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  console.log(this.state.optio)  
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
   
//console.log("y",this.state.optio)
    const matches= (this.state.width>765) ? true:false 
    const match= (this.state.width<660) ? false:true 
    
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
          return { justifyContent:"space-between",display:"flex",fontWeight:"bold"};
      },
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold"};
      },
      }
    ,
    {
      dataField: "type",
      text: "Alloted Course",
      headerStyle: (colum, colIndex) => {
        return { fontWeight:"bold"};
    },
      style: {
        width: '70px',
        textAlign:"center"
      },
      editable: false,
      formatExtraData:this.state.optio,
      formatter: (cellContent, row,formatExtraData) =>{
        //  console.log(row.courseid)
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
      
    ]
:
match ?
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
    headerStyle: (colum, colIndex) => {
      return { justifyContent:"space-between",display:"flex",fontWeight:"bold"};
  }
  },
  {
    dataField: "email",
    text: "Email",
    headerStyle: (colum, colIndex) => {
      return { 'whiteSpace': 'nowrap', width: '198px' , wordWrap:'break-word',fontWeight:"bold"};
  },
  sort: true
  }
,
{
    dataField: "type",
    text: "Alloted Course",
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold"};
  },
    style: {
      width: '70px',
      textAlign:"center"
    },
    editable: false,
    formatExtraData:this.state.optio,
    formatter: (cellContent, row,formatExtraData) =>{
      //  console.log(row.courseid)
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
                    border: '2px solid white',
                    color:"pink"
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
    
]:
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
    headerStyle: (colum, colIndex) => {
      return { justifyContent:"space-between",display:"flex",fontWeight:"bold"};
  },
  }
, {
    dataField: "type",
    text: "Alloted Course",
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold"};
  },
    style: {
      width: '70px',
      textAlign:"center"
    },
    editable: false,
    formatExtraData:this.state.optio,
    formatter: (cellContent, row,formatExtraData) =>{
      //  console.log(row.courseid)
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
        <div style={{width:"100%", background: "#ecf0f1"}}>
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
            pagination={paginationFactory(options)}
 hover
  rowStyle={ rowStyle }
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
