/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

let cameraAPI = ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);

let width;
let height;
let myCanvas;
let myCtx;
let elemVideo;
window.addEventListener("load", function () {
  if (cameraAPI) {
    document.body.style.backgroundColor = "black";
    window.addEventListener("resize", resize);
    let promiseCamera = navigator.mediaDevices.getUserMedia({video: true});
    promiseCamera.then(function(stream) {
      elemVideo = document.createElement("video");
      elemVideo.style.display = "none";
      elemVideo.srcObject = stream;
      document.body.appendChild(elemVideo);
      elemVideo.play();
      width = elemVideo.videoWidth;
      height = elemVideo.videoHeight;
      myCanvas = document.createElement("canvas");
      myCanvas.style.border = "none";
      myCanvas.width = width;
      myCanvas.height = height;
      myCanvas.style.width = width + "px";
      myCanvas.style.height = height + "px";
      document.body.appendChild(myCanvas);
      myCtx = myCanvas.getContext("2d");
      myCtx.clearRect(0, 0, width, height);
      requestAnimationFrame(parseFrame);
    });
    resize();
  } else {
    let textMsg = document.createTextNode("Camera API is not supported.");
    document.body.appendChild(textMsg);
  }
  function parseFrame() {
    myCtx.drawImage(elemVideo, 0, 0, width, height);
    requestAnimationFrame(parseFrame);
  }
});

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  myCanvas.width = width;
  myCanvas.height = height;
  myCanvas.style.width = width + "px";
  myCanvas.style.height = height + "px";
}

function updateCanvas(evt) {
  myCtx.clearRect(0, 0, width, height);
  for (let touch of evt.touches) {
    if (touch.force) {
      if (touch.force == 0) {
        force = 255;
      } else {
        force = Math.floor(255 * touch.force);
      }
    } else {
      force = 255;
    }
    myCtx.fillStyle = "rgb(" + force + ", " + force + ", " + force + ")";
    myCtx.beginPath();
    myCtx.ellipse(touch.clientX, touch.clientY, 50, 50, 0, 0, 2 * Math.PI);
    myCtx.fill();
  }
}
