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
  // x: input data
  function testTransform(x) {
    return Math.exp(x);
  }
  // funcTransform: a function that takes a single input
  function createUint8Table(funcTransform) {
    function calc(element, index, array) {
      element = Math.max(Math.min(funcTransform(index), 255), 0);
    }
    const ret = new Uint8Array(256);
    ret.forEach(calc);
    return ret;
  }
  // data: Uint8Array
  // tblTransform: Uint8Array, must have length == 256
  function transformUint8(data, tblTransform) {
    function calc(element, index, array) {
      return tblTransform[element];
    }
    return data.map(calc);
  }
  // vec1: Uint8Array
  // vec2: Uint8Array
  // vec1 & vec2 must be the same length
  function dotProductUint8(vec1, vec2) {
    function calc(acc, element, index, array) {
      acc[index] = element * vec2[index];
      return acc;
    }
    return vec1.reduce(calc, new Uint16Array(vec1.length));
  }
  // vec1: Uint8Array
  // vec2: Array (of Number)
  // vec1 & vec2 must be the same length
  function dotProductUint8Float(vec1, vec2) {
    function calc(acc, element, index, array) {
      acc[index] = element * vec2[index];
      return acc;
    }
    return vec1.reduce(calc, new Array(vec1.length));
  }
  function testPerformance(numDataSize, numIterations) {
    const vec1 = new Uint8Array(numDataSize);
    const vec2 = new Array(numDataSize);
    let timeAcc = 0;
    for (let i = 0; i < numIterations; ++i) {
      crypto.getRandomValues(vec1);
      for (let j = 0; j < numDataSize; ++j) {
        vec2[j] = Math.random();
      }
      const timeStart = performance.now();
      let result = dotProductUint8Float(vec1, vec2);
      const timeEnd = performance.now();
      const timeElapsed = (timeEnd - timeStart);
      timeAcc += timeElapsed;
    }
    console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
  }
  function samplePerformance() {
    console.log("dotProductUint8Float");
    testPerformance(1000, 1000);
    testPerformance(2000, 1000);
    testPerformance(5000, 1000);
    testPerformance(10000, 1000);
    testPerformance(20000, 1000);
    testPerformance(50000, 1000);
  }
  samplePerformance();
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
  function parseFrameData() {
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        frameData[4 * (i * width + j)];
      }
    }
  }
  function parseFrame() {
    captureFrame();
    resizeCanvasDisplay(width, height);
    ctxDisplay.putImageData(frameData, 0, 0, width, height);
    requestAnimationFrame(parseFrame);
  }
  function resizeCanvasDisplay(width, height) {
    elemCanvasDisplay.width = width;
    elemCanvasDisplay.height = height;
    elemCanvasDisplay.style.width = width + "px";
    elemCanvasDisplay.style.height = height + "px";
  }
  function recalcCanvasDisplay() {
    ctxDisplay.drawImage(elemCanvasHidden, 0, 0, width, height);
  }
});
