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
    let promiseCamera = navigator.mediaDevices.getUserMedia({video: true});
    promiseCamera.then(function(stream) {
      elemVideo = document.createElement("video");
      elemVideo.style.display = "none";
      elemVideo.srcObject = stream;
      document.body.appendChild(elemVideo);
      elemVideo.play();
      elemVideo.addEventListener("play", function () {
        myCanvas = document.createElement("canvas");
        myCanvas.style.border = "none";
        document.body.appendChild(myCanvas);
        myCtx = myCanvas.getContext("2d");
        myCtx.clearRect(0, 0, width, height);
        requestAnimationFrame(parseFrame);
      });
    });
    promiseCamera.then(function(error) {
      let textMsg = document.createTextNode(error.message);
      document.body.appendChild(textMsg);
    });
  } else {
    let textMsg = document.createTextNode("Camera API is not supported.");
    document.body.appendChild(textMsg);
  }
  function parseFrame() {
    console.log("frame");
    let resized = false;
    if (width != elemVideo.videoWidth) {
      width = elemVideo.videoWidth;
      resized = true;
    }
    if (height != elemVideo.videoHeight) {
      height = elemVideo.videoHeight;
      resized = true;
    }
    if (resized) {
      myCanvas.width = width;
      myCanvas.height = height;
      myCanvas.style.width = width + "px";
      myCanvas.style.height = height + "px";
    }
    myCtx.drawImage(elemVideo, 0, 0, width, height);
    requestAnimationFrame(parseFrame);
  }
});
