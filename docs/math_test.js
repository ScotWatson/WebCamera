/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// x: input data
function testTransform(x) {
  return Math.exp(x);
}

function fnTestDefiniteLoopCall(thisLength) {
  let arr = new Array(thisLength);
  definiteLoop(setElem, thisLength);
  function setElem(index) {
    arr[index] = {};
  }
}

function fnTestDefiniteLoopBuiltin(thisLength) {
  let arr = new Array(thisLength);
  for (let i = 0; i < thisLength; ++i) {
    arr[i] = {};
  }
}

function fnTestForEachCall(arr, fnCallback) {
  definiteLoop(operate, arr.length);
  function operate(index) {
    fnCallback(arr[index], index, arr);
  }
}

function fnTestForEachBuiltin(arr, fnCallback) {
  arr.forEach(fnCallback);
}

// Test performance of dotProductUint8Uint8_1
// numDataSize:
// numIterations:
function testPerformanceDotProductUint8Uint8_1(numDataSize, numIterations) {
  const vec1 = new Uint8Array(numDataSize);
  const vec2 = new Uint8Array(numDataSize);
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    crypto.getRandomValues(vec1);
    crypto.getRandomValues(vec2);
    const timeStart = performance.now();
    let result = dotProductUint8Uint8_1(vec1, vec2);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of dotProductUint8Uint8_2
// numDataSize:
// numIterations:
function testPerformanceDotProductUint8Uint8_2(numDataSize, numIterations) {
  const vec1 = new Uint8Array(numDataSize);
  const vec2 = new Uint8Array(numDataSize);
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    crypto.getRandomValues(vec1);
    crypto.getRandomValues(vec2);
    const timeStart = performance.now();
    let result = dotProductUint8Uint8_2(vec1, vec2);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of dotProductUint8Float64
// numDataSize:
// numIterations:
function testPerformanceDotProductUint8Float64(numDataSize, numIterations) {
  const vec1 = new Uint8Array(numDataSize);
  const vec2 = new Float64Array(numDataSize);
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    crypto.getRandomValues(vec1);
    for (let j = 0; j < numDataSize; ++j) {
      vec2[j] = Math.random();
    }
    const timeStart = performance.now();
    let result = dotProductUint8Float64(vec1, vec2);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of matrixProductUint8Uint8_1
// numDataSize:
// numIterations:
function testPerformanceMatrixProductUint8Uint8_1(numDataSize, numIterations) {
  const matrix1 = new Uint8Array(numDataSize * numDataSize);
  const matrix2 = new Uint8Array(numDataSize * numDataSize);
  let timeRandomAcc = 0;
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeRandomStart = performance.now();
    getRandomValues(matrix1);
    getRandomValues(matrix2);
    const timeRandomEnd = performance.now();
    const timeRandomElapsed = (timeRandomEnd - timeRandomStart) / 2;
    timeRandomAcc += timeRandomElapsed;
    const timeStart = performance.now();
    let result = matrixProductUint8Uint8_1(matrix1, matrix2, numDataSize);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg random time: ", (timeRandomAcc / numIterations), "ms");
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of matrixProductUint8Uint8_2
// numDataSize:
// numIterations:
function testPerformanceMatrixProductUint8Uint8_2(numDataSize, numIterations) {
  const matrix1 = new Uint8Array(numDataSize * numDataSize);
  const matrix2 = new Uint8Array(numDataSize * numDataSize);
  let timeRandomAcc = 0;
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeRandomStart = performance.now();
    getRandomValues(matrix1);
    getRandomValues(matrix2);
    const timeRandomEnd = performance.now();
    const timeRandomElapsed = (timeRandomEnd - timeRandomStart) / 2;
    timeRandomAcc += timeRandomElapsed;
    const timeStart = performance.now();
    let result = matrixProductUint8Uint8_2(matrix1, matrix2, numDataSize);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg random time: ", (timeRandomAcc / numIterations), "ms");
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of fnTestDefiniteLoopCall
// numDataSize:
// numIterations:
function testPerformanceDefiniteLoopCall(numDataSize, numIterations) {
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeStart = performance.now();
    let result = fnTestDefiniteLoopCall(numDataSize);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of fnTestDefiniteLoopBuiltin
// numDataSize:
// numIterations:
function testPerformanceDefiniteLoopBuiltin(numDataSize, numIterations) {
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeStart = performance.now();
    let result = fnTestDefiniteLoopBuiltin(numDataSize);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
}

// Test performance of fnTestForEachCall
// numDataSize:
// numIterations:
function testPerformanceForEachCall(numDataSize, numIterations) {
  let arr = new Array(numDataSize);
  definiteLoop(setElem, numDataSize);
  function setElem(index) {
    arr[index] = Math.random();
  }
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeStart = performance.now();
    let result = fnTestForEachCall(arr, testCallback);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
  function testCallback(elem, index, array) {
    let result = elem * index;
  }
}

// Test performance of fnTestForEachBuiltin
// numDataSize:
// numIterations:
function testPerformanceForEachBuiltin(numDataSize, numIterations) {
  let arr = new Array(numDataSize);
  definiteLoop(setElem, numDataSize);
  function setElem(index) {
    arr[index] = Math.random();
  }
  let timeAcc = 0;
  for (let i = 0; i < numIterations; ++i) {
    const timeStart = performance.now();
    let result = fnTestForEachBuiltin(arr, testCallback);
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    timeAcc += timeElapsed;
  }
  console.log("Data size: ", numDataSize, "  Avg time: ", (timeAcc / numIterations), "ms");
  function testCallback(elem, index, array) {
    let result = elem * index;
  }
}

function samplePerformance() {
  console.log("dotProductUint8Uint8_1");
  testPerformanceDotProductUint8Uint8_1(1000, 1000);
  testPerformanceDotProductUint8Uint8_1(2000, 1000);
  testPerformanceDotProductUint8Uint8_1(5000, 1000);
  testPerformanceDotProductUint8Uint8_1(10000, 1000);
  testPerformanceDotProductUint8Uint8_1(20000, 1000);
  testPerformanceDotProductUint8Uint8_1(50000, 1000);
  console.log("dotProductUint8Uint8_2");
  testPerformanceDotProductUint8Uint8_2(1000, 1000);
  testPerformanceDotProductUint8Uint8_2(2000, 1000);
  testPerformanceDotProductUint8Uint8_2(5000, 1000);
  testPerformanceDotProductUint8Uint8_2(10000, 1000);
  testPerformanceDotProductUint8Uint8_2(20000, 1000);
  testPerformanceDotProductUint8Uint8_2(50000, 1000);
  console.log("dotProductUint8Float64");
  testPerformanceDotProductUint8Float64(1000, 1000);
  testPerformanceDotProductUint8Float64(2000, 1000);
  testPerformanceDotProductUint8Float64(5000, 1000);
  testPerformanceDotProductUint8Float64(10000, 1000);
  testPerformanceDotProductUint8Float64(20000, 1000);
  testPerformanceDotProductUint8Float64(50000, 1000);
  console.log("testDefiniteLoopBuiltin");
  testPerformanceDefiniteLoopBuiltin(5000, 1000);
  testPerformanceDefiniteLoopBuiltin(10000, 1000);
  console.log("testDefiniteLoopCall");
  testPerformanceDefiniteLoopCall(5000, 1000);
  testPerformanceDefiniteLoopCall(10000, 1000);
  console.log("testForEachBuiltin");
  testPerformanceForEachBuiltin(5000, 1000);
  testPerformanceForEachBuiltin(10000, 1000);
  console.log("testForEachCall");
  testPerformanceForEachCall(5000, 1000);
  testPerformanceForEachCall(10000, 1000);
  console.log("matrixProductUint8Uint8_1");
  testPerformanceMatrixProductUint8Uint8_1(10, 1000);
  testPerformanceMatrixProductUint8Uint8_1(20, 1000);
  testPerformanceMatrixProductUint8Uint8_1(50, 100);
  testPerformanceMatrixProductUint8Uint8_1(100, 100);
  testPerformanceMatrixProductUint8Uint8_1(200, 10);
  console.log("matrixProductUint8Uint8_2");
  testPerformanceMatrixProductUint8Uint8_2(10, 1000);
  testPerformanceMatrixProductUint8Uint8_2(20, 1000);
  testPerformanceMatrixProductUint8Uint8_2(50, 100);
  testPerformanceMatrixProductUint8Uint8_2(100, 100);
  testPerformanceMatrixProductUint8Uint8_2(200, 10);
}
samplePerformance();
