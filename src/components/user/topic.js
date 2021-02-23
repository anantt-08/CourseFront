import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { Spinner } from "react-bootstrap";
import "../admin/user.css";
import Button from '@material-ui/core/Button';
//import file from "./files-1613767397056.23.pdf";
import PdfViewer from './PdfViewer';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { selectFilter,textFilter  } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import filePpt2Fill from '@iconify-icons/ri/file-ppt-2-fill';
import { Icon, InlineIcon } from '@iconify/react';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export default class Topic extends Component{
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      width:0,
      height:0,
      list:[],
      dictt:{},
      DATA:[],
      showPdf:false,
      pdf:""
    };
  }
   
  async UNSAFE_componentWillMount() {
    
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
    this.state.list.map((item)=>{
      dict[item]=item  
    })
     this.setState({dictt:dict});
     //alert(this.state.dictt)
     }
     catch(err){
      console.log(err)
    } 
    try{
  let yoo=await axios
  .get(`http://localhost:9000/api/topics/findbyid/${this.props.id}`, {
    headers: {
      Authorization: token,
    },
  })
    yoo.data.userlist.sort();
    this.setState({DATA:yoo.data.userlist});
    this.setState({ loading: true });
}
catch(err){
    console.log(err)
  } 
  }
  componentDidUpdate(prevProps) {
    if(prevProps.id !== this.props.id)
    {
      this.setState({ loading: false });
      this.UNSAFE_componentWillMount();
    }
  } 
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
   // console.log(this.state.width)
  };
  UNSAFE_componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  manage(source){
    this.setState({showPdf:!this.state.showPdf,
    pdf:source
  })
  }
  render() {
//console.log(this.state.dictt)
//console.log(this.state.DATA)
//console.log(this.props.id)
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
        dataField: "topicname",
        text: "TopicName",
        
  filter: textFilter(),
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center" ,fontWeight:"bold",background:"#858796",color:"white",'whiteSpace': 'nowrap', width: '194px' , wordWrap:'break-word'};
      } ,style:{
        fontWeight:"500",
        textTransform: "uppercase",
        fontStyle:"italic"
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
          return {textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
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
        dataField: "pdf",
        text: "PDF",
        headerStyle: (colum, colIndex) => {
          return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      },
      editable: false,
      formatter: (cellContent, row) => (
        (row.pdf=="") ? <div>---</div> : <div>
         <Button
        onClick={()=>this.manage(row.pdf)}
        variant="contained"
        color="default"
        startIcon={<PictureAsPdfIcon />}
      >
        PDF
      </Button>
          </div>
      )
    },
    {
      dataField: "ppt",
      text: "PPT",
      headerStyle: (colum, colIndex) => {
        return { textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
    },
    editable: false,
    formatter: (cellContent, row) => (
      (row.ppt=="") ? <div>---</div> : <div>
         <Button
       onClick={()=>this.manage(row.ppt)}
        variant="contained"
        color="default"
        startIcon={<Icon icon={filePpt2Fill} />}
      >
         PPT
      </Button>
        </div>
    )
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
          return { whiteSpace: 'nowrap', width: '178px' , wordWrap:'break-word',textAlign:"center",fontWeight:"bold",background:"#858796",color:"white"};
      },
      },
  {
    dataField: "program",
    text: "Program",
    headerStyle: (colum, colIndex) => {
      return { textAlign:"center" ,fontWeight:"bold",background:"#858796",color:"white"};
  },
  editable:false,
        formatter: (cell,row )=>{
          return( <a href={require(`../../files/program/${row.program}`)} download="" style={{ display:"inline-block",width: '115px' ,
          background: 'rgb(233, 38, 69)', textAlign: 'center', borderRadius: '5px', color:'white', fontWeight:'bold',
           lineHeight: '29px',padding:"1px"}} >Download</a>
          )
          }
}
      
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
            <PdfViewer pdf={this.state.pdf=="" ? "" : require(`../../files/pdf/${this.state.pdf}`)} 
                    onCancel={()=>this.setState({showPdf:false,pdf:""})}
                    visible={this.state.showPdf}
         />
          </Container>
        </div>
      </>
    );
  }
}
