/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

let cameraAPI = ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);

let width;
let height;
let elemCanvasHidden;
let ctxHidden;
let elemCanvasDisplay;
let ctxDisplay;
let elemVideo;
window.addEventListener("load", function () {
  if (cameraAPI) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    const promiseCamera = navigator.mediaDevices.getUserMedia({video: true});
    promiseCamera.then(function(stream) {
      elemVideo = document.createElement("video");
      elemVideo.style.display = "none";
      elemVideo.srcObject = stream;
      document.body.appendChild(elemVideo);
      elemVideo.play();
      elemVideo.addEventListener("loadeddata", function () {
        elemCanvasHidden = document.createElement("canvas");
        elemCanvasHidden.style.display = "none";
        document.body.appendChild(elemCanvasHidden);
        ctxHidden = elemCanvasHidden.getContext("2d");
        ctxHidden.clearRect(0, 0, width, height);
        elemCanvasDisplay = document.createElement("canvas");
        elemCanvasDisplay.style.border = "none";
        document.body.appendChild(elemCanvasDisplay);
        ctxDisplay = elemCanvasDisplay.getContext("2d");
        ctxDisplay.clearRect(0, 0, width, height);
        requestAnimationFrame(parseFrame);
      });
    });
    promiseCamera.catch(function(error) {
      let textMsg = document.createTextNode(error.message);
      document.body.appendChild(textMsg);
    });
  } else {
    let textMsg = document.createTextNode("Camera API is not supported.");
    document.body.appendChild(textMsg);
  }
  let frameData;
  function captureFrame() {
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
      elemCanvasHidden.width = width;
      elemCanvasHidden.height = height;
    }
    ctxHidden.drawImage(elemVideo, 0, 0, width, height);
    frameData = ctxHidden.getImageData(0, 0, width, height);
  }
  // x: r, g, or b value; 0-255 inclusive
  // Returns: linearized, normalized intensity
  function sRGB_to_linear(x) {
    const norm_x = x / 255;
    if (norm_x <= 0.04045) {
      return (norm_x / 12.92);
    } else {
      return Math.pow((norm_x + 0.055) / 1.055, 2.4);
    }
  }
  const tblGammaLinear = createUint8Float64Table(sRGB_to_linear);
  let arrIntensity;
  const vecIntensityMult = new Float64Array(3);
  vecIntensityMult[0] = 0.2;
  vecIntensityMult[1] = 0.7;
  vecIntensityMult[2] = 0.1;
  function parseFrameData() {
    const thisData = frameData.data;
    arrIntensity = new Float64Array(width * height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        const numIndex = (i * width + j);
        const vecColor = thisData.slice( 4 * numIndex, 4 * numIndex + 3 );
        const vecColorLinear = transformUint8Float64(vecColor, tblGammaLinear);
        arrIntensity[numIndex] = dotProductUint8Float64(vecColorLinear, vecIntensityMult);
      }
    }
  }
  function parseFrame() {
    captureFrame();
    const start_time = performance.now();
//    parseFrameData();
    const end_time = performance.now();
    console.log("Calc time: ", end_time - start_time, "ms");
    resizeCanvasDisplay(width, height);
    ctxDisplay.putImageData(frameData, 0, 0);
    requestAnimationFrame(parseFrame);
  }
  function resizeCanvasDisplay(width, height) {
    elemCanvasDisplay.width = width;
    elemCanvasDisplay.height = height;
    elemCanvasDisplay.style.width = width + "px";
    elemCanvasDisplay.style.height = height + "px";
  }
});
