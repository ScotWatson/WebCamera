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
  // tblTransform: Uint8Array
  function transformUint8(data, tblTransform) {
    function calc(element, index, array) {
      return tblTransform[element];
    }
    return data.map(calc);
  }
  function testPerformance(numDataSize, numIterations) {
    const tblTransform = createUint8Table(testTransform);
    const data = new Uint8Array(numDataSize);
    let timeAcc = 0;
    for (let i = 0; i < numIterations; ++i) {
      crypto.getRandomValues(data);
      const timeStart = Performance.now();
      let result = transformUint8(data, tblTransform);
      const timeEnd = Performance.now();
      const timeElapsed = (timeEnd - timeStart);
      timeAcc += timeElapsed;
    }
    console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations));
  }
  function samplePerformance() {
    testPerformance(10, 1000);
    testPerformance(20, 1000);
    testPerformance(50, 1000);
    testPerformance(100, 1000);
    testPerformance(200, 1000);
    testPerformance(500, 1000);
  }
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
      elemVideo.addEventListener("play", function () {
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
  function parseFrame() {
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
      resizeCanvasDisplay(width, height);
    }
    ctxHidden.drawImage(elemVideo, 0, 0, width, height);
    const data = ctxHidden.getImageData(0, 0, width, height);
    ctxDisplay.drawImage(elemCanvasHidden, 0, 0, width, height);
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
