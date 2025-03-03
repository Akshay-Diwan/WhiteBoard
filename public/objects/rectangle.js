import canvas from './Dom.js'
export function createRectangle(rectangle){
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
}

  
  export function createEllipse(ellipse){
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
  }

  export function createLine(line){
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
  }
  export function createArbitary(shape, multX = 1, multY = 1,moveX = 0, moveY = 0){
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
      for(let j in shape.points){
        ctx.lineTo(shape.points[j].x , shape.points[j].y);
      }
      ctx.stroke();
      ctx.strokeStyle ='#000000';
      ctx.lineWidth = 1;
      shape.points = JSON.stringify(shape.points);
  }
  }
  export function createTextField(shape){
    if(canvas.getContext){
      const ctx = canvas.getContext("2d");
      console.log(shape.text);
      console.log(shape.x);
      console.log(shape.y);
    

      // ctx.fillText(shape.text, shape.x, shape.y);
      ctx.font = "30px Arial"; // Set the font
      ctx.fillStyle = "black";
      ctx.textBaseline = "hanging";
      ctx.fillText(shape.text, shape.x, shape.y);
      const text = ctx.measureText(shape.text);
      shape.height = 16;
      shape.width = text.width;
      console.log(shape.height);
      console.log(shape.width);
    }
  }
  export default function clearCanvas(){
    if(canvas.getContext){
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
