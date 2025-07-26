const canvas = document.getElementById('strip-canvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');
const slotY = [0, 500, 1000];
const slotWidth = 600, slotHeight = 500;

let isFrozen = [false, false, false];
let frozenImages = [null, null, null];

// Draw the frame and event details


function drawFrameAndDetails() {


    // Add before drawing other canvas details:
ctx.save();
ctx.strokeStyle = "#938287ff"; // Your favorite pink
ctx.lineWidth = 18;          // Adjust thickness as desired
ctx.strokeRect(
  9,                      // left padding (half the line width)
  9,                      // top padding
  slotWidth - 18,         // width minus border
  slotHeight * 3 + 300 - 18 // height minus border
);
ctx.restore();

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, slotWidth, slotHeight * 3 + 300);
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, slotY[i], slotWidth, slotHeight);
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, slotY[i], slotWidth, slotHeight);
  }
  ctx.fillStyle = "#000";
  ctx.font = "40px Cursive";
  ctx.textAlign = "center";
  ctx.fillText("Take A Moment", slotWidth / 2, slotHeight * 3 + 60);
  ctx.font = "40px Cursive";
  ctx.fillText("To", slotWidth / 2, slotHeight * 3 + 120);
  ctx.font = "40px Cursive";
  ctx.fillText("Smile", slotWidth / 2, slotHeight * 3 + 170);
  
}

// Live-paint loop for video in empty slots; captured slots stay frozen
function drawLoop() {
  drawFrameAndDetails();
  for (let i = 0; i < 3; i++) {
    if (isFrozen[i] && frozenImages[i]) {
      ctx.drawImage(
        frozenImages[i],
        0, 0, video.videoWidth, video.videoHeight,
        0, slotY[i], slotWidth, slotHeight
      );
    } else if (video.readyState === 4) {
      ctx.drawImage(
        video,
        0, 0, video.videoWidth, video.videoHeight,
        0, slotY[i], slotWidth, slotHeight
      );
    }
  }
  requestAnimationFrame(drawLoop);
}

// Start the camera and begin the loop
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    drawLoop();
  };
});

// Each click freezes only the next available slot
document.getElementById('capture-btn').onclick = function() {
  const nextSlot = isFrozen.indexOf(false);
  if (nextSlot >= 0 && video.readyState === 4) {
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    isFrozen[nextSlot] = true;
    frozenImages[nextSlot] = tempCanvas;
  }
};

// Download handler
document.getElementById('download-btn').onclick = function() {
  const link = document.createElement('a');
  link.download = 'photostrip.png';
  link.href = canvas.toDataURL();
  link.click();
};
