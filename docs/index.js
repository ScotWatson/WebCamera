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
    const imageData = ctxHidden.getImageData(0, 0, width, height);
    frameData = matrixRemoveColumnUint8(frameData.data, 4, 3);
  }
  // x: r, g, or b byte value; 0-255 inclusive
  // Returns: linearized, normalized intensity
  function sRGB_to_linear(x) {
    const norm_x = x / 255;
    if (norm_x <= 0.04045) {
      return (norm_x / 12.92);
    } else {
      return Math.pow((norm_x + 0.055) / 1.055, 2.4);
    }
  }
  // x: r, g, or b linear value; 0-1 inclusive
  // Returns: byte value; 0-255 inclusive
  function linear_to_sRGB(x) {
    if (x <= 0.0031308) {
      return 255 * (12.92 * x);
    } else {
      return 255 * (1.055 * Math.pow(x , (1 / 2.4)) - 0.055);
    }
  }
  const tblGammaLinear = createUint8Float64Table(sRGB_to_linear);
  const tblLinearGamma = createFloat64Uint8Table(linear_to_sRGB);
  let arrIntensity;
  const matrixLinear_XYZ = new Float64Array(9);
  matrixLinear_XYZ[0] = 0.4124;
  matrixLinear_XYZ[1] = 0.3576;
  matrixLinear_XYZ[2] = 0.1805;
  matrixLinear_XYZ[3] = 0.2126;
  matrixLinear_XYZ[4] = 0.7152;
  matrixLinear_XYZ[5] = 0.0722;
  matrixLinear_XYZ[6] = 0.0193;
  matrixLinear_XYZ[7] = 0.1192;
  matrixLinear_XYZ[8] = 0.9505;
  const matrixXYZ_Linear = new Float64Array(9);
  matrixXYZ_Linear[0] = +3.2406;
  matrixXYZ_Linear[1] = -1.5372;
  matrixXYZ_Linear[2] = -0.4986;
  matrixXYZ_Linear[3] = -0.9689;
  matrixXYZ_Linear[4] = +1.8758;
  matrixXYZ_Linear[5] = +0.0415;
  matrixXYZ_Linear[6] = +0.0557;
  matrixXYZ_Linear[7] = -0.2040;
  matrixXYZ_Linear[8] = +1.0570;
  const D65_chromaX = 0.9505;
  const D65_chromaZ = 1.0890;
  function parseFrameData() {
    const thisData = frameData.data;
    arrIntensity = new Float64Array(width * height);
    const vecColorLinear = transformUint8Float64(vecColor, tblGammaLinear);
    arrIntensity = matrixProductFloat64Float64(vecColorLinear, matrixLinear_XYZ, 4);
  }
  function parseFrame() {
    captureFrame();
    const start_time = performance.now();
    parseFrameData();
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
