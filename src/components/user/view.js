import React, {useState} from 'react';
import PdfViewer from './PdfViewer';
import {Button} from "react-bootstrap";
function View() {
   const [showPdf, setShowPdf] = useState(false)
   return (
      <div className="App">
         <PdfViewer pdf="" 
                    onCancel={()=>setShowPdf(false)}
                    visible={showPdf}
         />
         <Button onClick={()=>setShowPdf(!showPdf)}>
           Show PdfViewer
         </Button>
      </div>
   );
}
export default View;