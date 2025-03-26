import canvas,* as dom from './objects/Dom.js';
import clearCanvas,{createRectangle, createEllipse, createLine, createArbitary, createTextField} from './objects/rectangle.js';
import { onEdge, inRange, inShape} from './objects/MousePositions.js';
import { dashedBorder } from './objects/rectangle.js';
let canvasDimensions = {
  width: window.innerWidth,
  height: localStorage.getItem('canvas height') || window.innerHeight * 0.95
}
let rect = canvas.getBoundingClientRect();
let scaleX = canvas.width / rect.width;
let scaleY = canvas.height / rect.height;

let shapes =[];
let sharing = false;
if(localStorage.getItem('shapes')) shapes = JSON.parse(localStorage.getItem('shapes'));
const socket = io();
socket.on('creating shape', (currentShape)=>{
  console.log('here we are in recieved messsage', currentShape);
  clearCanvas();
  shapes.map(shape=> shapeCreator[shape.createShape](shape));
  shapeCreator[currentShape.createShape](currentShape);
})
socket.on('change in shapes', (message)=>{
  console.log('here we are in recieved messsage', message);
  clearCanvas();
  shapes = [...message];
  shapes.map(shape=> shapeCreator[shape.createShape](shape));
})
socket.on('room id', (room)=>{
  localStorage.setItem('roomID', room);
})
socket.on('canvas dimensions', (dimensions)=>{
  canvasDimensions = {...dimensions};
  localStorage.setItem('canvas height', canvasDimensions.height);
  resizeCanvas();
})
const sendToServer = (identifier, message)=>{
  if(sharing){
    console.log("here we are in send To server");
    console.log("this is the room id: ", localStorage.getItem('roomID'));
    socket.emit(identifier, message, localStorage.getItem('roomID'));
  }
}
const sendIndex = (index)=>{
  if(sharing){
    socket.emit('index', index);
  }
}
// import { createRectangle, clearCanvas } from "./objects/rectangle.js";
// const circle = document.getElementById("circle");

setTimeout(1000);
// || CREATING AND DELETING OBJECTS

const shapeCreator ={
createRectangle: createRectangle,
createEllipse: createEllipse,
createLine: createLine,
createArbitary: createArbitary,
createTextField: createTextField
}
// || CREATING OBJECTS  CODE END

// || UTILITY FUNCTION
const findCorners = ()=>{
  let minX = canvas.offsetWidth, minY = canvas.offsetHeight, maxX = 0, maxY = 0;
  // console.log(JSON.parse(currentShape.points)[0]);
  for(let i in JSON.parse(currentShape.points)){
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
    dom.backgroundProperty.value = hexColor;
    currentShape.background = hexColor;
  } else {
    dom.colorProperty.value = hexColor;
    currentShape.color = hexColor;
  }
  clearCanvas();
  let otherShapes = shapes.filter(shape => shape.name != currentShape.name);

  otherShapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  shapes = [...otherShapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes', shapes);
}
}
};
// || UTILITY FUNCTION ENDS
// || COMMANDS
let command;
let scroll = false;
const createRect = 1;
const editRect = 2;
const moveRect = 3;
const createLn = 4;
const draw = 5;
const erase = 6;
const text = 7;
let idx = (+localStorage.getItem('idx')) || 1;
let permission = false;

// || COMMANDS END

// || SHAPES OBJECT STORAGE


console.log(shapes);
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

// || BUTTON FUNCTIONS 
const rectangleSelected = () => {
  dom.graspBtn.classList.remove('selected-button');
  scroll = false;
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
    createShape: 'createRectangle'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);
  sendIndex(idx);
  command = createRect;

  canvas.classList.add('create-cursor');

};
const ellipseSelected = () =>{
  dom.graspBtn.classList.remove('selected-button');
  scroll = false;
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
    createShape: 'createEllipse'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);
  sendIndex(idx);

  command = createRect;
  canvas.classList.add('create-cursor');
}
const lineSelected = () =>{
  dom.graspBtn.classList.remove('selected-button');
  scroll = false;
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
    createShape: 'createLine'
  }
  idx= idx + 1;
  localStorage.setItem('idx', idx);
  sendIndex(idx);
  

  command = createLn;
  canvas.classList.add('create-cursor');
}
const drawSelected =()=>{
  dom.graspBtn.classList.remove('selected-button');
  scroll = false;
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
  sendIndex(idx);
  command = draw;
  try{
    canvas.classList.add('draw-cursor');
  }
  catch(err){

  }
  
}
const eraserSelected = ()=>{
  dom.graspBtn.classList.remove('selected-button');
  scroll = false;
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
  }
  console.log("Eraser Selected");
  command = erase;
  try{
    canvas.classList.add('erase-cursor');
  }
  catch(err){

  }
}
const graspClicked = ()=>{
     !scroll;
      if(scroll){
        dom.graspBtn.classList.add('selected-button');
        permission = false;
        command = null;
      }
      else{
        dom.graspBtn.classList.remove('selected-button');
      }
}
const handleShareClick = ()=>{
  dom.dialog.showModal();
}
const handleDialogClick =(e)=>{
  try{
    e.target.close();
  }catch(err){

  }
  
}
// let room = 1;
const handleStartLiveClick = (e)=>{
  e.preventDefault();
  dom.dialog.close();
  dom.stopbox.showModal();
  dom.collabLink.innerText = socket.id;
  sharing = true;
  localStorage.setItem('roomID', socket.id);
  socket.emit('join',localStorage.getItem('roomID'));
  
  
}
const handleStopLiveClick = (e)=>{
  e.preventDefault();
  socket.emit('leave', localStorage.getItem('roomID'));
  localStorage.removeItem('roomID');
  sharing = false;
  dom.stopbox.close();
}
const handleCloseClick = (e)=>{
  e.preventDefault();
  dom.inputBox.close();
}
const handleJoinAnother= (e)=>{
  e.preventDefault();
  dom.dialog.close();
  dom.inputBox.showModal();
}
const handleJoinClick = (e)=>{
  e.preventDefault();
  localStorage.setItem('roomID',dom.linkInput.value);
  console.log("Join button is clicked", localStorage.getItem('roomID'));
  socket.emit('join', localStorage.getItem('roomID'));
  sharing = true;
  dom.inputBox.close();
}
// || BUTTON FUNCTION ENDS

// CHECKING POINTER POSITION

// || CHECKING POINTER POSITION END

// || FOCUSED OBJECT

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

const mouseX = (e.clientX - rect.left) * scaleX;
const mouseY = (e.clientY - rect.top) * scaleY;
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
        x:mouseX, 
        y:mouseY
      }
      ]);
    return;
  }
  
  if(command === createLn){
    currentShape.x = mouseX;
    currentShape.y = mouseY;
    permission = true;
    return;
  }
  if (command === createRect) {
    currentShape.x = mouseX;
    currentShape.y = mouseY;
    fixedCorner.x = mouseX;
    fixedCorner.y = mouseY;
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

    const editingRectindex = shapes.map((rectangle) => inRange(rectangle, {mouseX, mouseY}, fixedCorner)).indexOf(true);
  if (
    editingRectindex != -1 &&
    shapes[editingRectindex].name === currentShape.name
  ) {
    command = editRect;
    const otherShapes = shapes.filter(
      (rectangle) => rectangle.name !== currentShape.name
    );
    shapes = [...otherShapes];
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
  .map((rectangle) => onEdge(rectangle, mouseX, mouseY))
  .indexOf(true);
  if (rectindex != -1) {
     command = moveRect;
     currentShape = { ...shapes[rectindex] };
     const otherRect = shapes.filter(
       (rectangle) => rectangle != shapes[rectindex]
     );
     shapes = [...otherRect];
     initialPoint.x = mouseX;
     initialPoint.y = mouseY;
     permission = true;
}
       // || MOVE RECTANGLE CODE ENDS
return;
}
};
// ||  MOUSE MOVE 
const handleMouseMove = (e) => {
  const mouseX = (e.clientX - rect.left) * scaleX;
const mouseY = (e.clientY - rect.top) * scaleY;
  if (!permission){
    // if(!command){
    //   if(currentShape && inRange(currentShape, e, fixedCorner)){
    //     return;
    //   }
    //   let i = shapes  
    // .map((rectangle) => onEdge(rectangle, mouseX, mouseY))
    // .indexOf(true);
    // if(i !== -1){
    //   canvas.style.cursor = 'move';
    // }
    // else{
    //   canvas.style.cursor = 'auto';
    // }
    // }
    
    return;
  }
  if(command === erase){
    shapes = shapes.filter(shape => !inShape(shape, {mouseX: mouseX, mouseY: mouseY}));
    clearCanvas();
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    localStorage.setItem('shapes', JSON.stringify(shapes));
    sendToServer('change in shapes',shapes);
  }
  else if(command === draw){
      clearCanvas();
      if(currentShape.points){
        currentShape.points = JSON.stringify([...JSON.parse(currentShape.points), {
          x: mouseX,
          y: mouseY
        }]);
      }
      else{
        currentShape.points = JSON.stringify([{
          x: mouseX,
          y: mouseY
        }]);
      }
     
      shapes.map(shape => shapeCreator[shape.createShape](shape));
      if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
      localStorage.setItem('shapes',JSON.stringify([...shapes, currentShape]));
      sendToServer('creating shape',currentShape);
    }
  else if(command === createLn){
    clearCanvas();   
    currentShape.endX = mouseX;
    currentShape.endY = mouseY;
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    localStorage.setItem('shapes',JSON.stringify([...shapes, currentShape]));
    sendToServer('creating shape',currentShape);

  }
  else if(command === moveRect) {
    clearCanvas();
    let moveX = mouseX - initialPoint.x;
    let moveY = mouseY - initialPoint.y;
    currentShape.x = currentShape.x + mouseX - initialPoint.x;
    currentShape.y = currentShape.y + mouseY - initialPoint.y;
    initialPoint.x = mouseX;
    initialPoint.y = mouseY;
    shapes.map(shape => shapeCreator[shape.createShape](shape));

  if(currentShape.points){
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape, 1, 1, moveX, moveY);
    return;
    }
    shapeCreator[currentShape.createShape](currentShape);
    localStorage.setItem('shapes',JSON.stringify([...shapes, currentShape]));
    sendToServer('change in shapes',shapes);
    sendToServer('creating shape',currentShape);

  }
  else if (command === editRect) {
    clearCanvas();
    if (fixedCorner.x > currentShape.x) {
      currentShape.x = mouseX;
    }
    if (fixedCorner.y > currentShape.y) {
      currentShape.y = mouseY;
    }
    let changeX = (Math.abs(fixedCorner.x - mouseX) - currentShape.width)/currentShape.width;
    let changeY = (Math.abs(fixedCorner.y - mouseY) - currentShape.length)/currentShape.length;
    currentShape.width = Math.abs(fixedCorner.x - mouseX);
    currentShape.length = Math.abs(fixedCorner.y - mouseY);
    if(currentShape.createShape === 'createTextField'){
      currentShape.font = `${currentShape.length}px "Indie Flower", cursive`;
    }
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    localStorage.setItem('shapes',JSON.stringify([...shapes, currentShape]));
    if(currentShape.points){
      shapeCreator[currentShape.createShape](currentShape, 1 + changeX, 1 + changeY);
    }
    else{
      shapeCreator[currentShape.createShape](currentShape);
    }
      sendToServer('change in shapes', shapes);
      sendToServer('creating shape',currentShape);
    
   
  }
  else if (command === createRect) {
    clearCanvas();
    if (mouseX < fixedCorner.x) {
      currentShape.x = mouseX;
    }
    if (mouseY < fixedCorner.y) {
      currentShape.y = mouseY;
    }
    canvas.classList.remove('create-cursor');
    currentShape.length = Math.abs(fixedCorner.y - mouseY);
    currentShape.width = Math.abs(fixedCorner.x - mouseX);
    localStorage.setItem('shapes',JSON.stringify([...shapes, currentShape]));
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    sendToServer('creating shape',currentShape);

};
}
const handleMouseUp = () => {
  permission = false;
  if(command === null || currentShape === null || currentShape.name === null){
    dom.propertiesCard.style.visibility = "hidden";
    currentShape = null;
  }
  else{
    dom.propertiesCard.style.visibility = "visible";
    dom.opacityProperty.value = currentShape.opacity * 10 || 10;
    dom.backgroundProperty.value = currentShape.background || '#000000';
    dom.colorProperty.value = currentShape.color || '#000000';
    dom.strokeWidthProperty.value = (currentShape.strokeWidth === 1)?"0":`${currentShape.strokeWidth * 2}`;

  }
  if(command === editRect){
    canvas.classList.remove('create-ne');
    canvas.classList.remove('create-se');
    canvas.classList.remove('create-nw');
    canvas.classList.remove('create-sw');

  }
  if(command === moveRect){
    canvas.classList.remove('create-move');
  }
  if(command === draw){
     let {minX, minY, maxX, maxY} = findCorners();
     currentShape.x = minX;
     currentShape.y = minY;
     currentShape.width = maxX - minX;
     currentShape.length = maxY - minY;
    canvas.classList.remove('draw-cursor');
  }
  if(command === erase){
    canvas.classList.remove('erase-cursor');
    console.log('this ran immediately...');
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
  if(!currentShape || currentShape.name === null){
    return;
  }
  shapes = [...shapes, { ...currentShape }];
  console.log("Current Shape:");
  for(let j in currentShape){
    console.log(currentShape[j]);
  }
  console.log("Shapes: ");
  for(let j in shapes){
    console.log(shapes[j]);
  }
  localStorage.setItem('shapes', JSON.stringify(shapes));
  if(currentShape.y + currentShape.length >= canvasDimensions.height - window.innerHeight){
    canvasDimensions.height += window.innerHeight;
    resizeCanvas();
    sendToServer('canvas dimensions', canvasDimensions);
  }
  localStorage.setItem('canvas height', canvasDimensions.height);
  sendToServer('change in shapes',shapes);

       
};

const handledblclick = (e)=>{
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
    createShape: 'createTextField',
    text: 'trial text',
    font: '30px "Indie Flower", cursive',
    length: 30
    
  }
  idx = idx + 1;
  localStorage.setItem('idx', idx);
  sendIndex(idx);
  currentShape.x = mouseX;
  currentShape.y = mouseY;
  createTextField(currentShape);
  console.log("currentShape.height = " + currentShape.height);
  dashedBorder(currentShape.x - 30, currentShape.y - 30, currentShape.width + 30, currentShape.length + 30);
  shapes = [...shapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes', shapes);
  
}
// || MOUSE EVENTS END
// || TOUCH EVENTS START
const handleTouch = (e, callback)=>{

    e.preventDefault();
    // if(scroll){
    //   return;
    // }

    console.log("pencil detected");


    let touch = e.touches[0];
    let coordinates = { 
      clientX: touch.clientX,
      clientY: touch.clientY 
    }
    callback(coordinates);

  }


// || HANDLING KEY EVENTS
const handleKeyDown = (e)=>{
 

  if(e.key === "Delete"){
    let otherShapes = shapes.filter(shape => shape.name != currentShape.name);
    localStorage.setItem('shapes', JSON.stringify(shapes));
    shapes = otherShapes;
  console.log("Deleted object: "+ currentShape.name);
  currentShape = null;
    clearCanvas();
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    localStorage.setItem('shapes', JSON.stringify(shapes));
    sendToServer('change in shapes',shapes);
  }
  else if(e.key.length === 1){
    console.log("inside typing");
    currentShape.text = currentShape.text + e.key;
    clearCanvas();
    const othershapes = shapes.filter(shape => shape.name != currentShape.name);
    shapes = [...othershapes, currentShape];
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    localStorage.setItem('shapes', JSON.stringify(shapes));
    sendToServer('change in shapes',shapes);
    dashedBorder(currentShape.x, currentShape.y, currentShape.width, currentShape.length);
  }
  else if(e.key === "Backspace" && currentShape.createShape === 'createTextField'){
    currentShape.text = currentShape.text.substring(0, currentShape.text.length - 1);
    clearCanvas();
    const othershapes = shapes.filter(shape => shape.name != currentShape.name);
    shapes = [...othershapes, currentShape];
    shapes.map(shape => shapeCreator[shape.createShape](shape));
    localStorage.setItem('shapes', JSON.stringify(shapes));
    sendToServer('change in shapes',shapes);
    dashedBorder(currentShape.x, currentShape.y, currentShape.width, currentShape.length);

  }
  if(e.keyCode === 32 && currentShape.createShape === 'createTextField'){
    e.preventDefault();
  }
 
  
}
// || HANDLING KEY EVENTS END
// || HANDLE PROPERTY EVENTS        //THESE ARE ALL GOOD TO GO
const handleColorChange=(e)=>{
  console.log(e.target.value);
  currentShape.color = e.target.value;
  clearCanvas();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes',shapes);
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
  clearCanvas();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  const othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes',shapes);


}
const handleBackgroundChange = (e)=>{
  console.log(e.target.value);
  currentShape.background = e.target.value;
  clearCanvas();
  shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes',shapes);
}
const handleOpacityChange = (e)=>{
  console.log(e.target.value);
  currentShape.opacity = e.target.value/10;
  clearCanvas();
  let othershapes = shapes.filter((shape)=> shape.name != currentShape.name);
  othershapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
  shapes = [...othershapes, currentShape];
  localStorage.setItem('shapes', JSON.stringify(shapes));
  sendToServer('change in shapes',shapes);   

}


// // Resize canvas to match the viewport size
function resizeCanvas() {
  canvas.width = canvasDimensions.width;
  canvas.height = canvasDimensions.height;
    shapes.map(shape => shapeCreator[shape.createShape](shape));
  if(currentShape && currentShape.createShape) shapeCreator[currentShape.createShape](currentShape);
    rect = canvas.getBoundingClientRect();
    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
   

}
function handleScroll() {
  console.log("inside scroll");
  if(!scroll){
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    window.scrollTo(scrollLeft,scrollTop); 
  }
}
// // Initial resize
resizeCanvas();

// || ADDING EVENTLISTENERS
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("dblclick", handledblclick);
canvas.addEventListener("touchstart",(e)=> handleTouch(e, handleMouseDown));
canvas.addEventListener("touchmove", (e) => handleTouch(e, handleMouseMove), {passive: false});
canvas.addEventListener("touchend", handleMouseUp);
dom.rectBtn.addEventListener("click", rectangleSelected);
dom.ellipseBtn.addEventListener("click", ellipseSelected);
dom.lineBtn.addEventListener("click", lineSelected);
dom.drawBtn.addEventListener("click", drawSelected);
dom.eraser.addEventListener('click', eraserSelected);
dom.graspBtn.addEventListener('click', graspClicked);
dom.colorProperty.addEventListener("change", handleColorChange);
dom.strokeWidthProperty.addEventListener("change", handleStrokeWidthChange);
dom.backgroundProperty.addEventListener("change", handleBackgroundChange);
dom.opacityProperty.addEventListener("change", handleOpacityChange);
dom.shareBtn.addEventListener("click", handleShareClick);
dom.startLive.addEventListener("click", handleStartLiveClick);
dom.stopLive.addEventListener("click", handleStopLiveClick);
dom.closeBtn.addEventListener("click", handleCloseClick)
dom.joinOptionBtn.addEventListener("click", handleJoinAnother);
dom.joinbtn.addEventListener("click", handleJoinClick)
dom.dialog.addEventListener("click", handleDialogClick);
dom.stopbox.addEventListener("click", handleDialogClick);

console.log(dom.colorBtns);
for(let j in dom.colorBtns) {
  if(!Number.isFinite(dom.colorBtns[j]))
  dom.colorBtns[j].onclick = (e) =>handleColorBtnClick(false, e);
}
for(let j in dom.colorBtns){
  if(!Number.isFinite(dom.backgroundColorBtns[j]))
   dom.backgroundColorBtns[j].onclick = (e) => handleColorBtnClick(true, e);
  }

window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", handleKeyDown);
window.onscroll = handleScroll();
// || ADDING EVENTLISTENERS END

