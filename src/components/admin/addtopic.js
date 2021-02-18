import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Topic = () => {
  const [files, setFiles] = useState([]);
  const [name,setName]=useState("c");

  function onFileUpload(event) {
    
    let id = event.target.id;
    event.preventDefault();
    let file = event.target.files[0];
    let duplicateFile = {};
      duplicateFile = files.find((doc) => doc.file_id === id);
      if (duplicateFile=== undefined) {
     setFiles([...files, { file_id:id,uploaded_file: file }]);
      }
      else{
       let index=files.indexOf(duplicateFile)
      let a=files[index]={
         file_id:id,
         uploaded_file:file
       }
     
      }
   }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(files);
    
    const token = localStorage.getItem("token");  
    var formData=new FormData()
    console.log(files)
    for (const f of files) {
      formData.append("files",f.uploaded_file)
}
    formData.append("tech",name)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      Authorization: token
    }
  }
      axios
      .post("http://localhost:9000/api/topics/topicsubmit",formData,config)
      .then((res) => {
        console.log(res)
         setFiles([])
         setEnabled(false)
     }).catch((err)=>{
       console.log(err)
     })
  }
  
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (files.length === 0) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [files]);

  return (
    <form onSubmit={handleSubmit} className="upload--container">
      <h1> Multiple File Inputs with Signle Submit Button </h1>
      <div className="upload--button">
        <input
          onChange={onFileUpload}
          type="file"
          name="files"
          id={1}
          required
        />
      </div>
      <div className="upload--button">
        <input
          onChange={onFileUpload}
          id={2}
          type="file"
          name="files"
        />
      </div>
      <div className="upload--button">
        <input
          onChange={onFileUpload}
          id={3}
          type="file"
          name="files"
        />
      </div>
      {enabled ? (
        <button type="submit">Submit</button>
      ) : (
        <button disabled type="submit">
          Submit
        </button>
      )}
    </form>
  );
};

export default Topic;