const createRectangle = ()=>{
    if(canvas.getContext){
      const ctx = canvas.getContext("2d");
      for(i in rectangles){
        if(rectangles[i].name === currentShape.name){
          continue;
        }
        // ctx.beginPath();
        // console.log("creating rectangle: "+ rectangles[i]);
        ctx.strokeRect(rectangles[i].x, rectangles[i].y, rectangles[i].width, rectangles[i].length);
      }
      ctx.beginPath();
      ctx.strokeRect(currentShape.x, currentShape.y, currentShape.width,currentShape.length);
    }
  }    
  
const deleteRectangle = ()=>{
    if(canvas.getContext){
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.clearRect(currentShape.x - 1, currentShape.y - 1, currentShape.width + 2, currentShape.length + 2);
    }
  }
  export {createRectangle, deleteRectangle};