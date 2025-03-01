import canvas from './Dom.js'
function createRectangle (rectangle){
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
  export default createRectangle;   
