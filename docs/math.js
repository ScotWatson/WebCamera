/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Finds the average run time of the currently selected function
// fnCreateArguments: (Function) Provides the arguments list for each iteration of the test
// numIterations: (Number)
// Returns: (Number) Average run time
function testRuntime(fnTest, fnCreateArguments, numIterations) {
  let accTime = 0;
  for (let i = 0; i < numIterations; ++i) {
    const args = fnCreateArguments();
    const startTime = performance.now();
    fnTest.apply(this, args);
    const endTime = performance.now();
    accTime += (endTime - startTime);
  }
  return (accTime / numIterations);
}

// newOptionFunction
// Used to provide multiple function under the same name
// The intent is to allow multiple implementations of the same function, so that the highest performance function can be selected
function newOptionFunction(fnDefault) {
  let fnCurrent = fnDefault;
  const setOptions = new Set();
  setOptions.add(fnDefault);
  const ret = (function () {
    return fnCurrent.apply(this, arguments);
  });
  Object.defineProperty(ret, "fnDefault", {
    get: function () {
      return fnDefault;
    },
  });
  Object.defineProperty(ret, "fnCurrent", {
    get: function () {
      return fnCurrent;
    },
    set: function (fnToSelect) {
      if (setOptions.has(fnToSelect)) {
        fnCurrent = fnToSelect;
      } else {
        throw new Error("Function provided is not in the list of options.");
      }
    },
  });
  ret.addOption = function (fnToAdd) {
    setOptions.add(fnToAdd);
  };
  ret.removeOption = function (fnToRemove) {
    if (fnCurrent === fnToRemove) {
      throw new Error("Current function cannot be removed from the list of options.");
    }
    setOptions.delete(fnToRemove);
  };
  ret[Symbol.iterator] = setOptions[Symbol.iterator];
  return ret;
}


const MatrixMath = (function () {
  const objMain = {};

  // Performs the provided function the specified (fixed) number of times
  // callbackFn: function to be executed; takes one argument (Number) - index; return value discarded
  // numLoops: (Number) how many times to call callbackFn
  // Returns: undefined
  function definiteLoop_52D92525(callbackFn, numLoops) {
    for (let i = 0; i < numLoops; ++i) {
      callbackFn(i);
    }
  }
  objMain.definiteLoop = newOptionFunction(definiteLoop_52D92525);

  // Fills a buffer with random values
  // typedArray: a TypedArray that will be filled with random values
  // Returns: undefined
  function getRandomValues_CCD8F9ED = function (typedArray) {
    const maxLength = 65536 / typedArray.BYTES_PER_ELEMENT;
    const numLoops = typedArray.length / maxLength;
    for (let i = 0; i < numLoops; ++i) {
      crypto.getRandomValues(typedArray.subarray(maxLength * i, maxLength * (i + 1)));
    }
  }
  objMain.getRandomValues = newOptionFunction(getRandomValues_CCD8F9ED);

  // Remove column
  // data: UintArray containing the data to be copied
  // numCols: total number of columns
  // colToRemove: index of column to be removed
  // Returns: Uint8Array
  function matrixRemoveColumnUint8_55B7A225(data, numCols, colToRemove) {
    const numRows = data.length / numCols;
    const ret = new Uint8Array(numRows * (numCols - 1));
    let retIndex = 0;
    definiteLoop(copy, data.length);
    return ret;
    function copy(index) {
      if ((index % numCols) != colToRemove) {
        ret[retIndex] = data[index];
        ++retIndex;
      }
    }
  }
  objMain.matrixRemoveColumnUint8 = newOptionFunction(matrixRemoveColumnUint8_55B7A225);

  // Memoization function - Calculates for all integers 0 to 255 (inclusive)
  // funcTransform: A function that takes a single argument (Number) and returns (Number)
  // Returns: Uint8Array (length == 256)
  function createUint8Uint8Table_CA07DBBA(funcTransform) {
    function calc(element, index, array) {
      element = funcTransform(index);
    }
    const ret = new Uint8Array(256);
    ret.forEach(calc);
    return ret;
  }
  objMain.createUint8Uint8Table = newOptionFunction(createUint8Uint8Table_CA07DBBA);

  // Memoization function - Calculates for all integers 0 to 255 (inclusive)
  // funcTransform: A function that takes a single argument (Number) and returns (Number)
  // Returns: Float32Array (length == 256), 1 kiB
  function createUint8Float32Table_A42DFA1E(funcTransform) {
    function calc(element, index, array) {
      element = funcTransform(index);
    }
    const ret = new Float32Array(256);
    ret.forEach(calc);
    return ret;
  }
  objMain.createUint8Float32Table = newOptionFunction(createUint8Float32Table_A42DFA1E);

  // Memoization function - Calculates for all integers 0 to 255 (inclusive)
  // funcTransform: A function that takes a single argument (Number) and returns (Number)
  // Returns: Float64Array (length == 256)
  function createUint8Float64Table_4830329E(funcTransform) {
    function calc(element, index, array) {
      element = funcTransform(index);
    }
    const ret = new Float64Array(256);
    ret.forEach(calc);
    return ret;
  }
  objMain.createUint8Float64Table = newOptionFunction(createUint8Float64Table_4830329E);

  // Uses tblTransform to transform each element of input
  // input: Uint8Array
  // tblTransform: Uint8Array, must have length == 256
  function transformUint8Uint8_F50AD938(input, tblTransform) {
    function calc(element, index, array) {
      return tblTransform[element];
    }
    return input.map(calc);
  }
  objMain.transformUint8Uint8 = newOptionFunction(transformUint8Uint8_F50AD938);

  // Uses tblTransform to transform each element of input
  // input: Uint8Array
  // tblTransform: Uint8Array, must have length == 256
  function transformFloat64Uint8_DB586F99(input, tblTransform) {
    function calc(elementInput, index, array) {
      return (tblTransform.findIndex(gt) - 1);
      function gt(elementTransform, index, array) {
        return (elementInput >= elementTransform);
      }
    }
    return input.map(calc);
  }
  objMain.transformFloat64Uint8 = newOptionFunction(transformFloat64Uint8_DB586F99);

  // Uses tblTransform to transform each element of input
  // data: Uint8Array
  // tblTransform: Float32Array, must have length == 256
  function transformUint8Float32_20B227EF(input, tblTransform) {
    function calc(element, index, array) {
      return tblTransform[element];
    }
    return input.map(calc);
  }
  objMain.transformUint8Float32 = newOptionFunction(transformUint8Float32_20B227EF);

  // Uses tblTransform to transform each element of input
  // data: Uint8Array
  // tblTransform: Float64Array, must have length == 256
  function transformUint8Float64_F6A7E433(input, tblTransform) {
    function calc(element, index, array) {
      return tblTransform[element];
    }
    return input.map(calc);
  }
  objMain.transformUint8Float64 = newOptionFunction(transformUint8Float64_F6A7E433);

  // Calculates the dot product of vec1 & vec2
  // vec1: Uint8Array
  // vec2: Uint8Array
  // vec1 & vec2 must be the same length
  // Returns: Number
  function dotProductUint8Uint8_2377B9AD(vec1, vec2) {
    function calc(acc, element, index, array) {
      return (acc + (element * vec2[index]));
    }
    return vec1.reduce(calc, 0);
  }
  objMain.dotProductUint8Uint8 = newOptionFunction(dotProductUint8Uint8_2377B9AD);
  function dotProductUint8Uint8_66A6E181(vec1, vec2) {
    let acc = 0;
    definiteLoop(calc, vec1.length);
    function calc(index) {
      acc += vec1[index] * vec2[index];
    }
    return acc;
  }
  objMain.dotProductUint8Uint8.addOption(dotProductUint8Uint8_66A6E181);
  
  // Calculates the dot product of vec1 & vec2
  // vec1: Uint8Array
  // vec2: Float32Array
  // vec1 & vec2 must be the same length
  // Returns: Float32Array (length == 1)
  function dotProductUint8Float32_8930D832(vec1, vec2) {
    function calc(acc, element, index, array) {
      acc[0] += element * vec2[index];
      return acc;
    }
    return vec1.reduce(calc, new Float32Array(1));
  }
  objMain.dotProductUint8Float32 = newOptionFunction(dotProductUint8Float32_8930D832);

  // Calculates the dot product of vec1 & vec2
  // vec1: Uint8Array
  // vec2: Float64Array
  // vec1 & vec2 must be the same length
  // Returns: Float64Array (length == 1)
  function dotProductUint8Float64_322293FE(vec1, vec2) {
    function calc(acc, element, index, array) {
      acc[0] += element * vec2[index];
      return acc;
    }
    return vec1.reduce(calc, new Float64Array(1));
  }
  objMain.dotProductUint8Float64 = newOptionFunction(dotProductUint8Float64_322293FE);

  // Calculates the matrix product
  // rows: Uint8Array
  // numCols: length of each row in rows
  // cols: Uint8Array
  // numRows: length of each column in cols
  // Returns: Uint16Array; length == rows.length * cols.length / (numRowsCols * numRowsCols)
  function matrixProductUint8Uint8_3AB43895(rows, cols, numColsRows) {
    const numRows = (rows.length / numColsRows);
    const arrRows = new Array(numRows);
    for (let i = 0; i < numRows; ++i) {
      arrRows[i] = rows.subarray(numColsRows * i, numColsRows * (i + 1));
    }
    const numCols = (cols.length / numColsRows);
    const arrCols = new Array(numCols);
    for (let i = 0; i < numCols; ++i) {
      arrCols[i] = cols.subarray(numColsRows * i, numColsRows * (i + 1));
    }
    let ret = new Uint16Array(arrRows.length * arrCols.length);
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numCols; ++j) {
        ret[numCols * i + j] = dotProductUint8Uint8(arrRows[i], arrCols[j]);
      }
    }
    return ret;
  }
  objMain.matrixProductUint8Uint8 = newOptionFunction(matrixProductUint8Uint8_3AB43895);
  function matrixProductUint8Uint8_4AB3AD62(rows, cols, numColsRows) {
    const numRows = (rows.length / numColsRows);
    const numCols = (cols.length / numColsRows);
    let ret = new Uint16Array(numRows * numCols);
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numCols; ++j) {
        ret[numCols * i + j] = 0;
        for (let k = 0; k < numColsRows; ++k) {
          ret[numCols * i + j] += (rows[i * numColsRows + k] + cols[j * numColsRows + k]);
        }
      }
    }
    return ret;
  }
  objMain.matrixProductUint8Uint8.addOption(matrixProductUint8Uint8_4AB3AD62);

  // Calculates the matrix product
  // rows: Uint8Array
  // numCols: length of each row in rows
  // cols: Float64Array
  // numRows: length of each column in cols
  // Returns: Float64Array; length == rows.length * cols.length / (numRowsCols * numRowsCols)
  function matrixProductUint8Float64_7BBE6F53(rows, cols, numColsRows) {
    const numRows = (rows.length / numColsRows);
    const numCols = (cols.length / numColsRows);
    let ret = new Float64Array(numRows * numCols);
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numCols; ++j) {
        ret[numCols * i + j] = 0;
        for (let k = 0; k < numColsRows; ++k) {
          ret[numCols * i + j] += (rows[i * numColsRows + k] + cols[j * numColsRows + k]);
        }
      }
    }
    return ret;
  }
  objMain.matrixProductUint8Float64 = newOptionFunction(matrixProductUint8Float64_7BBE6F53);

  // Calculates the matrix product
  // rows: Float64Array
  // numCols: length of each row in rows
  // cols: Float64Array
  // numRows: length of each column in cols
  // Returns: Float64Array; length == rows.length * cols.length / (numRowsCols * numRowsCols)
  function matrixProductFloat64Float64_23FA6ABA(rows, cols, numColsRows) {
    const numRows = (rows.length / numColsRows);
    const numCols = (cols.length / numColsRows);
    let ret = new Float64Array(numRows * numCols);
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numCols; ++j) {
        ret[numCols * i + j] = 0;
        for (let k = 0; k < numColsRows; ++k) {
          ret[numCols * i + j] += (rows[i * numColsRows + k] + cols[j * numColsRows + k]);
        }
      }
    }
    return ret;
  }
  objMain.matrixProductFloat64Float64 = newOptionFunction(matrixProductFloat64Float64_23FA6ABA);

  return objMain;
})();
