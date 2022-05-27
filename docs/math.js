/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// x: input data
function testTransform(x) {
  return Math.exp(x);
}

// Memoization function - Calculates for all integers 0 to 255 (inclusive)
// funcTransform: A function that takes a single argument (Number) and returns (Number)
// Returns: Uint8Array (length == 256)
function createUint8Uint8Table(funcTransform) {
  function calc(element, index, array) {
    element = Math.max(Math.min(funcTransform(index), 255), 0);
  }
  const ret = new Uint8Array(256);
  ret.forEach(calc);
  return ret;
}

// Memoization function - Calculates for all integers 0 to 255 (inclusive)
// funcTransform: A function that takes a single argument (Number) and returns (Number)
// Returns: Float32Array (length == 256), 1 kiB
function createUint8Float32Table(funcTransform) {
  function calc(element, index, array) {
    element = funcTransform(index);
  }
  const ret = new Float32Array(256);
  ret.forEach(calc);
  return ret;
}

// Memoization function - Calculates for all integers 0 to 255 (inclusive)
// funcTransform: A function that takes a single argument (Number) and returns (Number)
// Returns: Float64Array (length == 256)
function createUint8Float64Table(funcTransform) {
  function calc(element, index, array) {
    element = funcTransform(index);
  }
  const ret = new Float64Array(256);
  ret.forEach(calc);
  return ret;
}

// Uses tblTransform to transform each element of input
// input: Uint8Array
// tblTransform: Uint8Array, must have length == 256
function transformUint8Uint8(input, tblTransform) {
  function calc(element, index, array) {
    return tblTransform[element];
  }
  return input.map(calc);
}

// Uses tblTransform to transform each element of input
// data: Uint8Array
// tblTransform: Float32Array, must have length == 256
function transformUint8Float32(input, tblTransform) {
  function calc(element, index, array) {
    return tblTransform[element];
  }
  return input.map(calc);
}

// Uses tblTransform to transform each element of input
// data: Uint8Array
// tblTransform: Float64Array, must have length == 256
function transformUint8Float64(input, tblTransform) {
  function calc(element, index, array) {
    return tblTransform[element];
  }
  return input.map(calc);
}

// Calculates the dot product of vec1 & vec2
// vec1: Uint8Array
// vec2: Uint8Array
// vec1 & vec2 must be the same length
// Returns: Uint16Array (length == 1)
function dotProductUint8Uint8(vec1, vec2) {
  function calc(acc, element, index, array) {
    acc[0] += element * vec2[index];
    return acc;
  }
  return vec1.reduce(calc, new Uint16Array(1));
}

// Calculates the dot product of vec1 & vec2
// vec1: Uint8Array
// vec2: Float32Array
// vec1 & vec2 must be the same length
// Returns: Float32Array (length == 1)
function dotProductUint8Float32(vec1, vec2) {
  function calc(acc, element, index, array) {
    acc[0] += element * vec2[index];
    return acc;
  }
  return vec1.reduce(calc, new Float32Array(1));
}

// Calculates the dot product of vec1 & vec2
// vec1: Uint8Array
// vec2: Float64Array
// vec1 & vec2 must be the same length
// Returns: Float64Array (length == 1)
function dotProductUint8Float64(vec1, vec2) {
  function calc(acc, element, index, array) {
    acc[0] += element * vec2[index];
    return acc;
  }
  return vec1.reduce(calc, new Float64Array(1));
}

// 
// numDataSize:
// numIterations:
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

//
function calibratePerformance() {
  function end() {
    const timeEnd = performance.now();
    const timeElapsed = (timeEnd - timeStart);
    console.log("Ideal: 250 ms", " Actual: ", timeElapsed, "ms");
  }
  setTimeout(end, 250);
  const timeStart = performance.now();
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
calibratePerformance();
