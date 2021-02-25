import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { Spinner } from "react-bootstrap";
import "../admin/user.css";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Allbatch extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false,
      width:0,
      height:0,
      list:[],
      coursenames:{},
      names:[]
    };
  }

  async componentWillMount() {
    const token = localStorage.getItem("token");
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
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
     console.log(this.state.coursenames)
     }
     catch(err){
      console.log(err)
    } 
   try{
    let yoo=await  axios.get("http://localhost:9000/api/batches/find",{
        headers: {
          Authorization: token,
        },
      })
    yoo.data.userlist.sort();
      this.setState({ DATA: yoo.data.userlist });
      this.setState({ loading: true });
     
  }
      catch(err){
        console.log(err)
      } 
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
   // console.log(this.state.width)
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
 
  render() {
const selectNames=this.state.coursenames;
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
          return { textAlign:"center",'whiteSpace': 'nowrap', width: '245px' , wordWrap:'break-word',fontWeight:"bold",background:"#858796",color:"white"};
      },
      },
      {
        dataField: "startdate",
        text: "StartDate",
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      }
      },
      {
        dataField: "timing",
        text: "Batch Timings",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return {textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      }, sortFunc: (a, b, order, dataField) => {
        if (order === 'asc') {
         return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
        }
       else{
        return new Date('1970/01/01 ' + b) - new Date('1970/01/01 ' + a);
       }
    }
      },
     {
        dataField: "week",
        text: "Batch Week Status"
       ,
  style:{
    fontWeight:"bold"
  },
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      },
      }
    ]
const defaultSorted = [{
  dataField: 'coursename',
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
    style.backgroundColor= rowIndex % 2 === 0 ? '#f4b41a' : '#143d59' ;
    style.color= rowIndex % 2 === 0 ? '#143d59' : '#f4b41a' ;
    style.textAlign="center";
    style.fontWeight="550";
    style.fontStyle="italic";
    style.fontFamily="sans-serif";
    return style;
  };
const { SearchBar } = Search;

    return (
      <>
        <div style={{width:"100%"}}>
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
