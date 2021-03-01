import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const Formm = (props) => {
    return (
        <FormControl fullWidth >
    <InputLabel id="demo-simple-select-label">Select Batch</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-selectt"
      value={props.batchid}
      onChange={(event)=>props.handleBatch(event)}
    >  
      {props.fillBatches}
    </Select>
  </FormControl> 
    );
};

export default Formm;