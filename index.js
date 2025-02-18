// import { createRectangle, deleteRectangle } from "./objects/rectangle.js";
const canvas = document.getElementById("whiteboard");
// const circle = document.getElementById("circle");


// || CREATING AND DELETING OBJECTS
const deleteRectangle = () => {
  if(canvas.getContext){
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};
const shapeCreator ={
createRectangle: function(rectangle){
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = rectangle.color || '#000000';
    ctx.lineWidth = rectangle.strokeWidth || 3;
    ctx.globalAlpha = rectangle.opacity || 1;
    if(rectangle.background){
      ctx.fillStyle = rectangle.background;
    }
    ctx.beginPath();
    ctx.strokeRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.length
    );
    if(rectangle.background){
      ctx.fillRect(
        rectangle.x + (rectangle.strokeWidth || 3) - 1,
        rectangle.y + (rectangle.strokeWidth || 3) - 1,
        rectangle.width - (rectangle.strokeWidth || 3),
        rectangle.length - (rectangle.strokeWidth || 3)
      )
    }
   
    ctx.strokeStyle ='#000000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#0000FF00';
  }
},

createEllipse: function(ellipse){
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    // Compute ellipse parameters
    ctx.strokeStyle = ellipse.color || '#000000';
    ctx.lineWidth = ellipse.strokeWidth || 3;
    ctx.globalAlpha = ellipse.opacity || 1;

    if(ellipse.background){
      ctx.fillStyle = ellipse.background;
    }
    const cx = (ellipse.x + (ellipse.x + ellipse.width)) / 2;
    const cy = (ellipse.y + (ellipse.y + ellipse.length)) / 2;
    const rx = (ellipse.width) / 2;
    const ry = (ellipse.length) / 2;
    // Draw ellipse
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    if(ellipse.background && ry > 3 && rx > 3){
      ctx.ellipse(cx, cy, rx - (ellipse.strokeWidth || 3), ry - (ellipse.strokeWidth || 3), 0, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.strokeStyle ='#000000';
    ctx.lineWidth = 1;
  }
},
createLine: function(line){
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = line.color || '#000000';
    ctx.lineWidth = line.strokeWidth || 3;
    ctx.globalAlpha = line.opacity || 1;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(line.x,line.y);
    ctx.lineTo(line.endX,line.endY);
    ctx.stroke();
    ctx.strokeStyle ='#000000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#0000FF00';
}
},
createArbitary: function(shape, multX = 1, multY = 1,moveX = 0, moveY = 0){
  if(!shape.points){
    return;
  }
  shape.points = JSON.parse(shape.points).map((point) => ({
    x: point.x * multX + moveX,
    y: point.y * multY + moveY
  }));

  if (canvas.getContext) {

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = shape.color || '#000000';
    ctx.lineWidth = shape.strokeWidth || 5;
    ctx.globalAlpha = shape.opacity || 1;
    //handwritten
    ctx.beginPath();
    ctx.moveTo(shape.points[0].x,shape.points[0].y);
    for(j in shape.points){
      ctx.lineTo(shape.points[j].x , shape.points[j].y);
    }
    ctx.stroke();
    ctx.strokeStyle ='#000000';
    ctx.lineWidth = 1;
    shape.points = JSON.stringify(shape.points);
}
}
}
// || CREATING OBJECTS  CODE END
// || UTILITY FUNCTION
const findCorners = ()=>{
  let minX = canvas.offsetWidth, minY = canvas.offsetHeight, maxX = 0, maxY = 0;
  // console.log(JSON.parse(currentShape.points)[0]);
  for(i in JSON.parse(currentShape.points)){
    if(minX === null || minX > JSON.parse(currentShape.points)[i].x){
      minX = JSON.parse(currentShape.points)[i].x;
    }
    if(minY === null || minY > JSON.parse(currentShape.points)[i].y){
      minY = JSON.parse(currentShape.points)[i].y;
    }
    if(maxX === null || maxX < JSON.parse(currentShape.points)[i].x){
      maxX = JSON.parse(currentShape.points)[i].x;
    }
    if(maxY === null || maxY < JSON.parse(currentShape.points)[i].y){
      maxY = JSON.parse(currentShape.points)[i].y;
    }
  }
  
  return {minX,minY,maxX,maxY};
} 
function rgbToHex(r, g, b) {
  const hex = (x) => {
    const hexValue = x.toString(16);
    return hexValue.length == 1 ? '0' + hexValue : hexValue;
  };
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}
const handleColorBtnClick = (background, e) => {
  console.log(e);
  const button = e.target;
  if(button instanceof HTMLElement){
  // Get the computed style of the button
  const computedStyle = getComputedStyle(button);
  const rgbColor = computedStyle.backgroundColor; // e.g., "rgb(255, 0, 0)"
  console.log(`rgb Colors: ${rgbColor}`);

      // Parse the rgb values
      const rgbValues = rgbColor.match(/^rgb\((\d+), (\d+), (\d+)\)$/); // Match "rgb(r, g, b)"
      
      if (rgbValues) {
        const r = parseInt(rgbValues[1]);
        const g = parseInt(rgbValues[2]);
        const b = parseInt(rgbValues[3]);
      
        // Convert to hex
        const hexColor = rgbToHex(r, g, b);
        console.log(`hexColor: ${hexColor}`);
  if (background) {
    backgroundProperty.value = hexColor;
    currentShape.background = hexColor;
  } else {
    colorProperty.value = hexColor;
    currentShape.color = hexColor;
  }
  deleteRectangle();
  otherShapes = shapes.filter(shape => shape.name != currentShape.name);

 
  otherShapes.map(shape => shape.createShape(shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  shapes = [...otherShapes, currentShape];
}
}
};
// || UTILITY FUNCTION ENDS
// || COMMANDS
let command;
const createRect = 1;
const editRect = 2;
const moveRect = 3;
const createLn = 4;
const draw = 5;
const erase = 6;
let idx = (+localStorage.getItem('idx')) || 1;
let permission = false;

// || COMMANDS END

// || SHAPES OBJECT STORAGE
let shapes =[];
if(localStorage.getItem('shapes')) shapes = JSON.parse(localStorage.getItem('shapes'));

console.log(shapes);
for( i in shapes){
  console.log(shapes[i].name);
}
let currentShape = {
  name: null,
  createShape: null,
  x: 0,
  y: 0,
  length: 0,
  width: 0,
};
let initialPoint = {        //this is use to get initial position of cursor when mousedown
  x: null,
  y: null,
};
let fixedCorner = {
  x: null,
  y: null,
};

// || SHAPES OBJECT ENDS

// || DEFINING BUTTONS

const rectBtn = document.getElementById("rectangle");
const ellipseBtn = document.getElementById("ellipse");
const lineBtn = document.getElementById("line");
const drawBtn = document.getElementById("draw");
const textBoxBtn = document.getElementById("text");
const eraser = document.getElementById('eraser');
const propertiesCard = document.getElementById("properties");
const colorProperty = document.getElementById("stroke");
const strokeWidthProperty = document.getElementById("strokeWidth");
const backgroundProperty = document.getElementById("fill");
const opacityProperty = document.getElementById("opacity");
const ShapeList = document.getElementById("trial");
const colorBtns = document.getElementsByClassName("color-btn");
const backgroundColorBtns = document.getElementsByClassName("background-color-btn");
let currentFunction = {
  // createfunction: null,
  deletefunction: null,
};

// || DEFINING BUTTONS END

// || BUTTON FUNCTIONS 
const rectangleSelected = () => {
  if(currentShape){
    deleteDashedBorder(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.length
    );
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  }
  
  currentFunction = {
    // createfunction: createRectangle,
    deletefunction: deleteRectangle,
  };
  currentShape = {
    name : `shape${idx}`,
    createShape: 'createRectangle'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);
  console.log("idx: " + idx);
  command = createRect;
  canvas.style.cursor = "crosshair";
};
const ellipseSelected = () =>{
  if(currentShape){
  deleteDashedBorder(
    currentShape.x,
    currentShape.y,
    currentShape.width,
    currentShape.length
  );
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
}
  currentFunction = {
    // createfunction: createRectangle,
    deletefunction: deleteRectangle,
  };
  currentShape = {
    name : `shape${idx}`,
    createShape: 'createEllipse'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);

  command = createRect;
  canvas.style.cursor = "crosshair";
}
const lineSelected = () =>{
  if(currentShape){
  deleteDashedBorder(
    currentShape.x,
    currentShape.y,
    currentShape.width,
    currentShape.length
  );
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
}
  currentFunction = {
    // createfunction: 'createRectangle',
    deletefunction: deleteRectangle,
  };
  currentShape = {
    name : `shape${idx}`,
    createShape: 'createLine'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);

  command = createLn;
  canvas.style.cursor = "crosshair";
}
const drawSelected =()=>{
  console.log("draw Selected...");
  if(currentShape){
  deleteDashedBorder(
    currentShape.x,
    currentShape.y,
    currentShape.width,
    currentShape.length
  );
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
}
  currentShape = {
    name : `shape${idx}`,
    createShape: 'createArbitary'
  }
  idx = idx + 1;
  localStorage.setItem('idx', idx);

  command = draw;
  // currentFunction.createfunction = 'createArbitary';
  canvas.style.cursor = " url('src/draw.png') 32 32 , auto";
}
const textSelected = ()=>{
  if(currentShape){
    deleteDashedBorder(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.length
    );
    shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
}
}
const eraserSelected = ()=>{
  if(currentShape){
    deleteDashedBorder(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.length
    );
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    currentShape = null;
    console.log("Eraser Selected");
    command = erase;
}
}
// || BUTTON FUNCTION ENDS

// CHECKING POINTER POSITION
const onEdge = (rectangle, x, y) => { // Check if the pointer is near the left or right edge
  const buffer = 10;      
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
    // console.log("rect coordinates: " + rectangle.x + ", " + rectangle.y);
    // console.log(
    //   "rect coordinates: " +
    //     (rectangle.x + rectangle.width) +
    //     ", " +
    //     rectangle.y
    // );
    // console.log(
    //   "rect coordinates: " +
    //     rectangle.x +
    //     ", " +
    //     (rectangle.y + rectangle.length)
    // );
    // console.log(
    //   "rect coordinates: " +
    //     (rectangle.x + rectangle.width) +
    //     ", " +
    //     (rectangle.y + rectangle.length)
    // );

    // console.log("pointer coordinates: " + x + ", " + y);

    command = moveRect;
    canvas.style.cursor = "move";

    return true;
  }
  return false;
};
const inRange = (rectangle, e) => {
  //Anticlockwise
  const corner1 = Math.sqrt(
    Math.pow(rectangle.x - e.offsetX, 2) + Math.pow(rectangle.y - e.offsetY, 2)
  );
  const corner2 = Math.sqrt(
    Math.pow(rectangle.x - e.offsetX, 2) +
      Math.pow(rectangle.y + rectangle.length - e.offsetY, 2)
  );
  const corner3 = Math.sqrt(
    Math.pow(rectangle.x + rectangle.width - e.offsetX, 2) +
      Math.pow(rectangle.y + rectangle.length - e.offsetY, 2)
  );
  const corner4 = Math.sqrt(
    Math.pow(rectangle.x + rectangle.width - e.offsetX, 2) +
      Math.pow(rectangle.y - e.offsetY, 2)
  );
  if (corner1 < 20) {
    fixedCorner.y = rectangle.y + rectangle.length;
    fixedCorner.x = rectangle.x + rectangle.width;
    return true;
  }
  if (corner2 < 20) {
    fixedCorner.x = rectangle.x + rectangle.width;
    fixedCorner.y = rectangle.y;
    return true;
  }
  if (corner3 < 20) {
    fixedCorner.x = rectangle.x;
    fixedCorner.y = rectangle.y;
    return true;
  }
  if (corner4 < 20) {
    fixedCorner.x = rectangle.x;
    fixedCorner.y = rectangle.y + rectangle.length;
    return true;
  }
};
const inShape = (shape, e)=>{
  console.log("inside inShape function...");
  if(shape.createShape === createRectangle){
    if(e.offsetX > shape.x && e.offsetX < shape.width + shape.x && e.offsetY > shape.y && e.offsetY < shape.y + shape.length){
      console.log('inside rectangle');
      return true;
    }
  }
  if(shape.createShape === createEllipse){
    const cx = (shape.x + (shape.x + shape.width)) / 2;
    const cy = (shape.y + (shape.y + shape.length)) / 2;
    const rx = (shape.width) / 2;
    const ry = (shape.length) / 2;
    if(Math.pow((e.offsetX - cx)/rx, 2) + Math.pow((e.offsetY - cy)/ry, 2) <= 1){
      console.log('inside ellipse');
      return true;
    }
  }
  if(shape.createShape === createArbitary){
    const idx = shape.points.map((point)=> point.x === e.offsetX && point.y === e.offsetY).indexOf(true);
    if(idx != -1){
      return true;
    }
  }
  if(shape.createShape === createLine){
    console.log("first slope: "+(shape.y - e.offsetY)/(shape.x - e.offsetX) + " second slope: "+(shape.y - shape.endY)/(shape.x - shape.endX) );
    if(e.offsetX > shape.x && e.offsetX < shape.endX && e.offsetY > shape.y && e.offsetY < shape.endY){
      console.log('inside line');
      return true;
    }
  }
  
}
// || CHECKING POINTER POSITION END

// || FOCUSED OBJECT
const dashedBorder = (x, y, width, length) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.setLineDash([4, 2]);
    ctx.lineDashOffSet = 5;
    ctx.strokeRect(x - 10, y - 10, width + 20, length + 20);
    // ctx.beginPath();
    ctx.setLineDash([1, 0]);
    ctx.strokeRect(x - 10 - 7, y - 10 - 7, 7, 7);
    ctx.strokeRect(x - 10 + width + 20, y - 10 - 7, 7, 7);
    ctx.strokeRect(x - 10 + width + 20, y - 10 + length + 20, 7, 7);
    ctx.strokeRect(x - 10 - 7, y - 10 + length + 20, 7, 7);

    ctx.setLineDash([1, 0]);
  }
};
const deleteDashedBorder = (x, y, width, length) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(
      x - 10 - 7 - 1,
      y - 10 - 7 - 1,
      width + 20 + 14 + 2,
      length + 20 + 14 + 2
    );
  }
};
// || FOCUSED OBJECT END

// || HANDLING MOUSE EVENTS
const handleMouseDown = (e) => {
  if(command === erase){
    console.log("Inside mousedown...");
    permission = true;
    return;
  }
  if(currentShape){
    if(command === draw){
      permission = true;
      currentShape.points = JSON.stringify([
        {
        x: e.offsetX, 
        y: e.offsetY
      }
      ]);
    return;
  }
  
  if(command === createLn){
    currentShape.x = e.offsetX;
    currentShape.y = e.offsetY;
    permission = true;
    return;
  }
  if (command === createRect) {
    currentShape.x = e.offsetX;
    currentShape.y = e.offsetY;
    fixedCorner.x = e.offsetX;
    fixedCorner.y = e.offsetY;
    permission = true;
    return;
  }

    // || EDIT RECTANGLE CODE START
    deleteDashedBorder(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.length
    );
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);

    const editingRectindex = shapes.map((rectangle) => inRange(rectangle, e)).indexOf(true);
  if (
    editingRectindex != -1 &&
    shapes[editingRectindex].name === currentShape.name
  ) {
    command = editRect;
    const otherShapes = shapes.filter(
      (rectangle) => rectangle.name !== currentShape.name
    );
    shapes = [...otherShapes];
    // currentFunction.createfunction = createRectangle;
    currentFunction.deletefunction = deleteRectangle;
    permission = true;
    return;
  }
  // || EDIT RECTANGLE CODE ENDS
  currentShape = null;
  return;
  }

  if(currentShape === null){
       // || MOVE RECTANGLE CODE STARTS
  const rectindex = shapes
  .map((rectangle) => onEdge(rectangle, e.offsetX, e.offsetY))
  .indexOf(true);
  if (rectindex != -1) {
     command = moveRect;
     currentShape = { ...shapes[rectindex] };
     const otherRect = shapes.filter(
       (rectangle) => rectangle != shapes[rectindex]
     );
     shapes = [...otherRect];
     initialPoint.x = e.offsetX;
     initialPoint.y = e.offsetY;
    //  currentFunction.createfunction = createRectangle;
     currentFunction.deletefunction = deleteRectangle;
     permission = true;
}
       // || MOVE RECTANGLE CODE ENDS
return;
}
};
// ||  MOUSE MOVE 
const handleMouseMove = (e) => {
  if (!permission) {
    return;
  }
  if(command === erase){
    shapes = shapes.filter(shape => !inShape(shape, e));
    deleteRectangle();
    shapes.map(shape => shapeCreator[shape.createShape](shape));
  // if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    return;
  }
  if(command === draw){
      deleteRectangle();
      currentShape.points = JSON.stringify([...JSON.parse(currentShape.points), {
        x: e.offsetX,
        y: e.offsetY
      }]);
      shapes.map(shape => shapeCreator[shape.createShape](shape));
      if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
      return;
    }
  
  if(command === createLn){
    currentFunction.deletefunction();
    currentShape.endX = e.offsetX;
    currentShape.endY = e.offsetY;
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    return;
  }
  if (command === moveRect) {
    currentFunction.deletefunction();
    let moveX = e.offsetX - initialPoint.x;
    let moveY = e.offsetY - initialPoint.y;
    currentShape.x = currentShape.x + e.offsetX - initialPoint.x;
    currentShape.y = currentShape.y + e.offsetY - initialPoint.y;
    initialPoint.x = e.offsetX;
    initialPoint.y = e.offsetY;
    shapes.map(shape => shapeCreator[shape.createShape](shape));

    if(currentShape.points){
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape, 1, 1, moveX, moveY);
    // currentShape.createShape(currentShape,1,1,moveX, moveY);
    return;
    }
    shapeCreator[currentShape.createShape](currentShape);

  }
  if (command === editRect) {
    deleteRectangle();
    if (fixedCorner.x > currentShape.x) {
      currentShape.x = e.offsetX;
    }
    if (fixedCorner.y > currentShape.y) {
      currentShape.y = e.offsetY;
    }
    let changeX = (Math.abs(fixedCorner.x - e.offsetX) - currentShape.width)/currentShape.width;
    let changeY = (Math.abs(fixedCorner.y - e.offsetY) - currentShape.length)/currentShape.length;
    currentShape.width = Math.abs(fixedCorner.x - e.offsetX);
    currentShape.length = Math.abs(fixedCorner.y - e.offsetY);

    // currentFunction.createfunction();
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    // console.log("create Shape for currentShape is : "+ currentShape.createShape);
    if(currentShape.points){
    shapeCreator[currentShape.createShape](currentShape, 1 + changeX, 1 + changeY);
    return;
    }
    shapeCreator[currentShape.createShape](currentShape);
    return;
  }
  if (command === createRect) {
    deleteRectangle();
    if (e.offsetX < fixedCorner.x) {
      currentShape.x = e.offsetX;
    }
    if (e.offsetY < fixedCorner.y) {
      currentShape.y = e.offsetY;
    }
    canvas.style.cursor = "auto";
    currentShape.length = Math.abs(fixedCorner.y - e.offsetY);
    currentShape.width = Math.abs(fixedCorner.x - e.offsetX);
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    return;
};
}

const handleMouseUp = () => {
  permission = false;
  if(command === null){
    propertiesCard.style.visibility = "hidden";
  }
  else{
    propertiesCard.style.visibility = "visible";

  }
  if(command === draw){
     let {minX, minY, maxX, maxY} = findCorners();
     currentShape.x = minX;
     currentShape.y = minY;
     currentShape.width = maxX - minX;
     currentShape.length = maxY - minY;
  }
  if(!(command === createLn || command === null || currentShape === null)){
    console.log(`x: ${currentShape.x} y: ${currentShape.y} width: ${currentShape.width} length: ${currentShape.length}`);
    dashedBorder(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.length
    );
  }
  command = null;
  if(!currentShape.name){
    return;
  }
  shapes = [...shapes, { ...currentShape }];
  console.log("Current Shape:");
  for(j in currentShape){
    console.log(currentShape[j]);
  }
  console.log("Shapes: ");
  for(j in shapes){
    console.log(shapes[j]);
  }
  
  localStorage.setItem('shapes', JSON.stringify(shapes));
  // currentFunction.createfunction = null;
  currentFunction.deletefunction = null;
  canvas.style.cursor = "auto";
  // ShapeList.innerHTML = '';
  for(i in shapes){
    // ShapeList.innerHTML += `<li>${shapes[i].name}</li>`;
    console.log(shapes[i]);
  }
};
// || MOUSE EVENTS END


// || HANDLING KEY EVENTS
const handleKeyDown = (e)=>{
  if(e.key === "Delete"){
    let otherShapes = shapes.filter(shape => shape.name != currentShape.name);
    localStorage.setItem('shapes', JSON.stringify(shapes));
    shapes = otherShapes;
  console.log("Deleted object: "+ currentShape.name);
    // permission = false;
  //   for (let key in currentShape) {
  //     if (currentShape.hasOwnProperty(key)) {
  //         currentShape[key] = null;
  //     }
  // }
  currentShape = null;
    deleteRectangle();
    shapes.map(shape => shapeCreator[shape.createShape](shape));
  ShapeList.innerHTML = '';
    for(i in shapes){
      ShapeList.innerHTML += `<li>${shapes[i].name}</li>`;
      console.log(shapes[i]);
    }
  }
}
// || HANDLING KEY EVENTS END
// || HANDLE PROPERTY EVENTS        //THESE ARE ALL GOOD TO GO
const handleColorChange=(e)=>{
  console.log(e.target.value);
  currentShape.color = e.target.value;
  // console.log("current Shape color: "+ currentShape.color);
  deleteRectangle();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  // console.log(currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  // console.log("shapes created");

}
const handleStrokeWidthChange=(e)=>{
  switch(e.target.value){
    case "0":
  currentShape.strokeWidth = 1;
    break;
    case "1": 
  currentShape.strokeWidth = 2;
  break;
  case "2":
  currentShape.strokeWidth = 4;
    break;

  }
  // console.log("Width: " + currentShape.strokeWidth);
  deleteRectangle();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  // console.log(currentShape.createShape);
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));

}
const handleBackgroundChange = (e)=>{
  console.log(e.target.value);
  currentShape.background = e.target.value;
  // console.log("current Shape color: "+ currentShape.background);
  deleteRectangle();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));

}
const handleOpacityChange = (e)=>{
  console.log(e.target.value);
  currentShape.opacity = e.target.value/10;
  // console.log("current Shape opacity: " + currentShape.opacity);
  deleteRectangle();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
}

// // Resize canvas to match the viewport size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.95;
  
    shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
}

// // Initial resize
resizeCanvas();

// || ADDING EVENTLISTENERS
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
rectBtn.addEventListener("click", rectangleSelected);
ellipseBtn.addEventListener("click", ellipseSelected);
lineBtn.addEventListener("click", lineSelected);
drawBtn.addEventListener("click", drawSelected);
eraser.addEventListener('click', eraserSelected);
colorProperty.addEventListener("change", handleColorChange);
strokeWidthProperty.addEventListener("change", handleStrokeWidthChange);
backgroundProperty.addEventListener("change", handleBackgroundChange);
opacityProperty.addEventListener("change", handleOpacityChange);
console.log(colorBtns);
for(j in colorBtns) colorBtns[j].onclick = (e) =>handleColorBtnClick(false, e);
for(j in colorBtns) backgroundColorBtns[j].onclick = (e) => handleColorBtnClick(true, e);

window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", handleKeyDown);

// || ADDING EVENTLISTENERS END