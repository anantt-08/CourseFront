

function isEmpty(txt)
{ if(txt.length===0)
    return({img:'crs.png',err:true})
  else  
  return({img:'tic.png',err:false})

}

export {isEmpty}