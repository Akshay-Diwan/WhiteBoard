import canvas from "./Dom.js";
export const onEdge = (rectangle, x, y) => { // Check if the pointer is near the left or right edge
    const buffer = 30;      
    const nearLeftEdge =
      Math.abs(x - rectangle.x) <= buffer &&
      y >= rectangle.y &&
      y <= rectangle.y + rectangle.length;
    const nearRightEdge =
      Math.abs(x - (rectangle.x + rectangle.width)) <= buffer &&
      y >= rectangle.y &&
      y <= rectangle.y + rectangle.length;
    // Check if the pointer is near the top or bottom edge
    const nearTopEdge =
      Math.abs(y - rectangle.y) <= buffer &&
      x >= rectangle.x &&
      x <= rectangle.x + rectangle.width;
    const nearBottomEdge =
      Math.abs(y - (rectangle.y + rectangle.length)) <= buffer &&
      x >= rectangle.x &&
      x <= rectangle.x + rectangle.width;
  
    if (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) {
      canvas.classList.add("create-move");
  
      return true;
    }
    return false;
  };
  export const inRange = (rectangle, e, fixedCorner) => {
    //Anticlockwise
    const corner1 = Math.sqrt(
      Math.pow(rectangle.x - e.mouseX, 2) + Math.pow(rectangle.y - e.mouseY, 2)
    );
    const corner2 = Math.sqrt(
      Math.pow(rectangle.x - e.mouseX, 2) +
        Math.pow(rectangle.y + rectangle.length - e.mouseY, 2)
    );
    const corner3 = Math.sqrt(
      Math.pow(rectangle.x + rectangle.width - e.mouseX, 2) +
        Math.pow(rectangle.y + rectangle.length - e.mouseY, 2)
    );
    const corner4 = Math.sqrt(
      Math.pow(rectangle.x + rectangle.width - e.mouseX, 2) +
        Math.pow(rectangle.y - e.mouseY, 2)
    );
    if (corner1 < 20) {
      fixedCorner.y = rectangle.y + rectangle.length;
      fixedCorner.x = rectangle.x + rectangle.width;
      canvas.classList.remove('move-cursor')
      canvas.classList.remove("ne-cursor","se-cursor","nw-cursor", "sw-cursor")
      canvas.classList.add('nw-cursor');
      
      return true;
    }
    if (corner2 < 20) {
      fixedCorner.x = rectangle.x + rectangle.width;
      fixedCorner.y = rectangle.y;
      canvas.classList.remove('move-cursor')
      canvas.classList.remove("ne-cursor","se-cursor","nw-cursor", "sw-cursor")
      canvas.classList.add('sw-cursor');

      return true;
    }
    if (corner3 < 20) {
      fixedCorner.x = rectangle.x;
      fixedCorner.y = rectangle.y;
      canvas.classList.remove('move-cursor')
      canvas.classList.remove("ne-cursor","se-cursor","nw-cursor", "sw-cursor")
      canvas.classList.add('se-cursor');

      return true;
    }
    if (corner4 < 30) {
      fixedCorner.x = rectangle.x;
      fixedCorner.y = rectangle.y + rectangle.length;
      canvas.classList.remove('move-cursor')
      canvas.classList.remove("ne-cursor","se-cursor","nw-cursor", "sw-cursor")
      canvas.classList.add('ne-cursor');
      return true;
    }
  };
  export const inShape = (shape, e)=>{
    console.log("inside inShape function...");
    if(shape.createShape === 'createRectangle' || shape.createShape === 'createTextField'){
      if(e.mouseX > shape.x && e.mouseX < shape.width + shape.x && e.mouseY > shape.y && e.mouseY < shape.y + shape.length){
        console.log('insie rectangle');
        return true;
      }
    }
    if(shape.createShape === 'createEllipse'){
      const cx = (shape.x + (shape.x + shape.width)) / 2;
      const cy = (shape.y + (shape.y + shape.length)) / 2; 
      const rx = (shape.width) / 2;
      const ry = (shape.length) / 2;
      if(Math.pow((e.mouseX - cx)/rx, 2) + Math.pow((e.mouseY - cy)/ry, 2) <= 1){
        console.log('inside ellipse');
        return true;
      }
    }
    if(shape.createShape === 'createArbitary'){
      console.log("inside arbitary...");
      console.log(`x: ${JSON.parse(shape.points)[0].x},y: ${JSON.parse(shape.points)[0].y}`);
      const idx = JSON.parse(shape.points).map((point)=> filterfunction(point, e)).indexOf(true);
      console.log("idx: "+ idx);
      if(idx != -1){
        return true;
      }
    }
    if(shape.createShape === 'createLine'){
      console.log("first slope: "+(shape.y - e.mouseY)/(shape.x - e.mouseX) + " second slope: "+(shape.y - shape.endY)/(shape.x - shape.endX) );
      console.log()
      const m = (shape.y - shape.endY)/(shape.x - shape.endX);
      const c = shape.y - m * shape.x;
      let dist_line = Math.abs(e.mouseY - m * e.mouseX - c) / Math.sqrt(m*m + 1)
      if(isNaN(m)){
        console.log(e.mouseX)
        console.log(shape.x)
        dist_line = Math.abs(e.mouseX - shape.x)
        console.log("Distance : " + dist_line);
        if(e.mouseX > Math.min(shape.x,shape.endX) && e.mouseX < Math.max(shape.endX,shape.x) && dist_line < 10){
          console.log('inside line');
          return true;
        }
      }
      else if(e.mouseX > Math.min(shape.x,shape.endX) && e.mouseX < Math.max(shape.endX,shape.x) && e.mouseY > Math.min(shape.y,shape.endY) && e.mouseY < Math.max(shape.endY, shape.y) && dist_line < 20){
        console.log('inside line');
        return true;
      }
    }
    
  }
  //trial
 const filterfunction = (point, e)=>{
    console.log("pointer x: "+ e.mouseX + " pointer y: " + e.mouseY);
    // console.log(`x: ${point.x}, y: ${point.y}`);
    return point.x - 10 < e.mouseX && point.x + 10 > e.mouseX &&  point.y - 10 < e.mouseY && point.y + 10 > e.mouseY;
  }

