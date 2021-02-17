import React, {useState,useEffect} from "react";
import "antd/dist/antd.css";
import "./pdf.css";
import {Modal, Button} from "antd";
import { Spinner } from "react-bootstrap";
import CancelIcon from '@material-ui/icons/Cancel';
import {ZoomInOutlined, ZoomOutOutlined} from '@ant-design/icons';
import Pdf from '@mikecousins/react-pdf';

const PdfViewer = ({pdf, onCancel, visible})=> {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(null);
    const [scale, setScale] = useState(1);
    const [scalee, setScalee] = useState(0.5);
    const[mobile,setMobile]=useState(false);
    const onDocumentComplete = (numPages) =>{
      setPages(numPages)
    }

    const onSetScale = (type) =>{

        var newScale = type ? scale + 0.1 : scale - 0.1;

        if (newScale > 2){
            newScale = 2
        } else if (newScale < 0.1){
            newScale = 0.1
        }

        setScale(newScale)
        
    }
    const onSetScalee = (type) =>{
     console.log(scalee,type)
      var newScalee = type ? scalee + 0.1 : scalee - 0.1;

      if (newScalee > 1){
          newScalee = 1
      } else if (newScalee < 0.1){
          newScalee = 0.1
      }

      setScalee(newScalee)
      
  }  
    const onPage = (type) =>{
  
      var newPage = type ? page + 1 : page - 1
  
      if (newPage > pages){
        newPage = 1
      } else if (newPage < 1){
        newPage = pages
      }
  
      setPage(newPage)
    }

    const zoomStyle = {
        marginLeft: 20,
        fontSize:"20px",
        cursor: 'pointer',
        color:"red"
    }
    const zoomStylee = {
      marginLeft: 5,
      fontSize:"14px",
      cursor: 'pointer',
      color:"red"
  }
    const yo=()=>{
      setScale(1);
      setPage(1);
      setPages(null);
      onCancel();
    }
    const updateWindowWidth = () => {
      if (window.innerWidth <=600) setMobile(true)
      else setMobile(false)
    }
    
       // Update of sidebar state
       useEffect(() => {
    
        window.addEventListener('resize', updateWindowWidth);
    
        return () => window.removeEventListener('resize', updateWindowWidth);
      }, [mobile]);
      
  
  
    useEffect(() => { 
      updateWindowWidth();
     }, [])
    const footer = <div className="footer">
      {mobile?  <> <Button onClick={()=>onPage(0)}  size="small">Previous</Button>
       <div>
       <span style={{textAlign: 'center',fontSize:"10px"}}>Page {page} of {pages}</span>
           <ZoomOutOutlined style={{...zoomStylee, opacity: scalee === 0.1 ? 0.5 : 1}} onClick={()=>onSetScalee(0)}/>
           <ZoomInOutlined style={{...zoomStylee, opacity: scalee === 1 ? 0.5 : 1}} onClick={()=>onSetScalee(1)}/>
           <span>&nbsp;&nbsp;{ Math.round(scalee*100)}%</span>
        </div>
       <Button onClick={()=>onPage(1)} size="small">Next</Button> </>:
      <> <Button onClick={()=>onPage(0)}>Previous</Button>
       <div>
       <span style={{textAlign: 'center'}}>Page {page} of {pages}</span>
           <ZoomOutOutlined style={{...zoomStyle, opacity: scale === 0.1 ? 0.5 : 1}} onClick={()=>onSetScale(0)}/>
           <ZoomInOutlined style={{...zoomStyle, opacity: scale === 2 ? 0.5 : 1}} onClick={()=>onSetScale(1)}/>
           <span>&nbsp;&nbsp;{ Math.round(scale * 100)}%</span>
        </div>
       <Button onClick={()=>onPage(1)}>Next</Button></>}
    </div>
    return (<Modal
      wrapClassName="vertical-center-modal"
      maskClosable={false}
                   onCancel={yo}
                   visible={visible}                
                   footer={footer}
                   style={{ top: 0}}
                   zIndex={9999}
                   width={"80%"}
                   closeIcon={< CancelIcon />}
                   bodyStyle={{height: 578, overflowY: 'auto'}}
    >
    <div className="pdfWrapper">
    <Pdf file={pdf} page={page}  scale={mobile? scalee:scale} onContextMenu={(e) => e.preventDefault()}>
      {({ pdfDocument, pdfPage, canvas }) => (
        <>
          {!pdfDocument && <div>
                    <Spinner animation="border" variant="success" size="xl" />
              </div>
              }
          {canvas}
          {Boolean(pdfDocument && pdfDocument.numPages) && (
            onDocumentComplete(pdfDocument.numPages)
          )}
        </>
      )}
    </Pdf>
    </div>
    </Modal>)
  
};
export default PdfViewer;