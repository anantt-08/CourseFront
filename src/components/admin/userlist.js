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
import { FaRegTrashAlt } from "react-icons/fa";
import Fab from "@material-ui/core/Fab";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export default class Userlist extends Component{
  constructor(props) {
    super(props);

    this.state = {
      DATA: [],
      loading: false
    };
  }

  componentWillMount() {
    const token = localStorage.getItem("token");
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
        this.componentWillMount();
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
        this.componentWillMount();
      })
      .catch((err) => {
        NotificationManager.error(err.response.data.msg);
      });
  }


  render() {

    
    const columns = [
      {
        dataField: "_id",
        text: "Id",
        hidden: true,
        editable: false,
      },
      {
        dataField: "name",
        text: "UserName",
      },
      {
        dataField: "email",
        text: "Email",
        headerStyle: (colum, colIndex) => {
          return { 'whiteSpace': 'nowrap', width: '200px' , wordWrap:'break-word'};
      },
      },
      {
        dataField: "mobile",
        text: "MobileNo",
      },
            {
        dataField: "birth",
        text: "BirthDate",
      },
      {
        dataField: "type",
        text: "Account Active?",
        style: {
          width: '70px',
          textAlign:"center"
        },
        editable: false,
        formatter: (cellContent, row) => (
            <div className="banUserDiv">
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
      },
      {
        dataField: "operation",
        text: "Delete",
        style: {
          textAlign: 'center',
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
                  body: "Are you sure Want to Permanently Delete Data?",
                  actions: [
                    Dialog.CancelAction(),
                    Dialog.OKAction(() => {
                      this.deleteData(row._id);
                    })
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
    ];

    const pagination = paginationFactory({
  sizePerPage:4,
 sizePerPageList : [ {
  text: '4', value: 4
}, {
  text: '8', value: 8
},
{text: '12', value: 12
}
 ]

});
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
                <BootstrapTable
                  keyField="_id"
                  data={this.state.DATA}
                  columns={columns}
                  hovers
                  pagination={pagination}

                />
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
