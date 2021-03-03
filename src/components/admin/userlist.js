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
import Grid from '@material-ui/core/Grid';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Userlist extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false,
      width:0,
      height:0
    };
  }

  UNSAFE_componentWillMount() {
    const token = localStorage.getItem("token");
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
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
  }

  deleteData = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:9000/api/users/allowLogin/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        NotificationManager.success(res.data.msg);
        this.UNSAFE_componentWillMount();
      })
      .catch((err) => {
        NotificationManager.error(err.response.data.msg);
      });
  };
  
  changeStatus=(id,status) =>{
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:9000/api/users/changestatus/${id}`,{status:!status}, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        NotificationManager.success(res.data.msg);
        this.UNSAFE_componentWillMount();
      })
      .catch((err) => {
        NotificationManager.error(err.response.data.msg);
      });
  }
 
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    console.log(this.state.width)
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render() {
   
//console.log(this.state.width)
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
        dataField: "courseid",
        text: "Courses",
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '180px' , wordWrap:'break-word',};
      },
      style: {
        textAlign:"center"
      },
      editable: false,
      
  filter: textFilter(),
      formatter: (cellContent, row,formatExtraData) =>{
        return  (
         
            row.courseid.map((item) => {
              return (
                <>
                   
                      {item.name}
                </>
              );
            })
       
             )
    }

    },
      {
        dataField: "name",
        text: "UserName",
        sort: true,
        
  filter: textFilter(),
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '148px' , wordWrap:'break-word',};
      },
      formatter: (cellContent, row) =>{
        return  (
         {row.name}
             )
    }    
        // style: (cell, row, rowIndex) => {
        //  return {
        //    backgroundColor: rowIndex % 2 === 0 ? 'red' : 'blue' 
        //  }
        // }
      },
      {
        dataField: "email",
        text: "Email",
        
        headerStyle: (colum, colIndex) => {
          return { 'whiteSpace': 'nowrap', width: '198px' , wordWrap:'break-word',fontWeight:"bold",background:"#858796",color:"white"};
      }
      },
      {
        dataField: "batchname",
        text: "Alloted Batch",
        
        filter: textFilter(),
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white",textAlign:"center",'whiteSpace': 'nowrap', width: '198px' , wordWrap:'break-word',};
      },
        style: {
          textAlign:"center"
        },
        editable: false,
        formatExtraData:this.state.optio,
        formatter: (cellContent, row,formatExtraData) =>{
          return  (
            <div style={{ outline: "none" }}>
            <Grid container style={{ cursor: "pointer" }}>
              {row.batchname.map((item) => {
                return (
                  <>
                      <Grid item xs={12}> 
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
      ,
      {
        dataField: "mobile",
        text: "MobileNo",
        sort: true,

        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '148px' , wordWrap:'break-word',};
      },
      },
     {
        dataField: "birth",
        text: "BirthDate",
        
        headerStyle: (colum, colIndex) => {
          return { fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '138px' , wordWrap:'break-word',};
      },
      }
    ,
    {
      dataField: "type",
      text: "Active?",
      headerStyle: (colum, colIndex) => {
        return { fontWeight:"bold",background:"#858796",color:"white"};
    },
      style: {
        width: '70px',
        textAlign:"center"
      },
      editable: false,
      formatter: (cellContent, row) => (
         (!row.delete && !row.status) ? <></> : <div className="banUserDiv">
          <input type="checkbox" style={{display:"none"}}
          id={row._id}
          readOnly
       checked={row.status}
       onClick={() => {
              this.dialog.show({
                title: "Sure?",
                body: "Are you sure Want to change Status?",
                actions: [
                  Dialog.CancelAction(),
                  Dialog.OKAction(() => {
                    this.changeStatus(row._id,row.status);
                  }),
                ],
                bsSize: "small",
                onHide: (dialog) => {
                  dialog.hide();
                  console.log("closed by clicking background.");
                },
              });
            }}
     />
     <label htmlFor={row._id}></label>
  </div>  
      ),
    }
      
    ]
:
match ?
[
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
      return { justifyContent:"space-between",display:"flex",fontWeight:"bold",background:"#858796",color:"white"};
  },
  },
  {
    dataField: "email",
    text: "Email",
    headerStyle: (colum, colIndex) => {
      return { 'whiteSpace': 'nowrap', width: '198px' , wordWrap:'break-word',fontWeight:"bold",background:"#858796",color:"white"};
  },
  sort: true
  },
  {
    dataField: "mobile",
    text: "MobileNo",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { justifyContent:"space-between",display:"flex",fontWeight:"bold",background:"#858796",color:"white"};
  },
  }
,
{
  dataField: "type",
  text: "Active?",
  headerStyle: (colum, colIndex) => {
    return { fontWeight:"bold",background:"#858796",color:"white"};
},
  style: {
    width: '70px',
    textAlign:"center"
  },
  editable: false,
  formatter: (cellContent, row) => (
     (!row.delete && !row.status) ? <></> : <div className="banUserDiv">
      <input type="checkbox" style={{display:"none"}}
      id={row._id}
      readOnly
   checked={row.status}
   onClick={() => {
          this.dialog.show({
            title: "Sure?",
            body: "Are you sure Want to change Status?",
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(() => {
                this.changeStatus(row._id,row.status);
              }),
            ],
            bsSize: "small",
            onHide: (dialog) => {
              dialog.hide();
              console.log("closed by clicking background.");
            },
          });
        }}
 />
 <label htmlFor={row._id}></label>
</div>  
  ),
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
      return { fontWeight:"bold",background:"#858796",color:"white"};
  },
  },
  {
    dataField: "mobile",
    text: "MobileNo",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold",background:"#858796",color:"white"};
  },
  }
,
  {
    dataField: "type",
    text: "Active?",
    headerStyle: (colum, colIndex) => {
      return { fontWeight:"bold",background:"#858796",color:"white"};
  },
    style: {
      width: '70px',
      textAlign:"center"
    },
    editable: false,
    formatter: (cellContent, row) => (
       (!row.delete && !row.status) ? <></> : <div className="banUserDiv">
        <input type="checkbox" style={{display:"none"}}
        id={row._id}
        readOnly
     checked={row.status}
     onClick={() => {
            this.dialog.show({
              title: "Sure?",
              body: "Are you sure Want to change Status?",
              actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                  this.changeStatus(row._id,row.status);
                }),
              ],
              bsSize: "small",
              onHide: (dialog) => {
                dialog.hide();
                console.log("closed by clicking background.");
              },
            });
          }}
   />
   <label htmlFor={row._id}></label>
</div>  
    ),
  }
];
const defaultSorted = [{
  dataField: 'name',
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
  if (!row.delete && !row.status) {
    style.backgroundColor = '#ff3333';
    
    style.color = 'white';
  } else if(row.delete && !row.status) {
    
  }
  else{
    style.backgroundColor = 'rgb(45, 214, 96)';

    style.color = 'rgb(24, 43, 30)';
  }
    style.fontWeight = 'bold';
  return style;
};

const { SearchBar } = Search;

    return (
      <>
<NotificationContainer />
        <div style={{width:"100%", background: match ?  "#ecf0f1": "white"}}>
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
          style={ { color: 'red', width:"100%" , border:"2px solid pink"} }
          
          delay={ 1000 }
          placeholder="Search!"
        />
        <BootstrapTable
            { ...props.baseProps }
            bootstrap4
  filter={ filterFactory() }
            wrapperClasses="table-responsiveeee"
  defaultSorted={ defaultSorted  }
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
