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

  // Javascript supports various different typed arrays:
  // Int8Array
  // Uint8Array
  // Uint8ClampedArray
  // Int16Array
  // Uint16Array
  // Int32Array
  // Uint32Array
  // Float32Array
  // Float64Array
  // BigInt64Array
  // BigUint64Array

  // Fills a buffer with random values
  // outputArray: a TypedArray that will be filled with random values
  // Returns: undefined
  function getRandomArray_CCD8F9ED(outputArray) {
    const maxLength = 65536 / typedArray.BYTES_PER_ELEMENT;
    const numLoops = typedArray.length / maxLength;
    for (let i = 0; i < numLoops; ++i) {
      crypto.getRandomValues(typedArray.subarray(maxLength * i, maxLength * (i + 1)));
    }
  }
  objMain.getRandomArray = newOptionFunction(getRandomArray_CCD8F9ED);

  // Remove column
  // outputArray: TypedArray (numRows = data.length / numCols; .length === numRows * (numCols - 1))
  // data: TypedArray containing the data to be copied
  // numCols: total number of columns
  // colToRemove: index of column to be removed
  // Returns: undefined
  function matrixRemoveColumn_55B7A225(outputArray, data, numCols, colToRemove) {
    const numRows = data.length / numCols;
    let retIndex = 0;
    for (let index = 0; index < data.length; ++i) {
      if ((index % numCols) != colToRemove) {
        ret[retIndex] = data[index];
        ++retIndex;
      }
    }
  }
  objMain.matrixRemoveColumn = newOptionFunction(matrixRemoveColumn_55B7A225);

  // Memoization function - Calculates for all integers 0 to 255 (inclusive)
  // outputArray: TypedArray (.length === 256)
  // funcTransform: A function that takes a single argument (Number) and returns (Number)
  // Returns: undefined
  function createTableForUint8_CA07DBBA(outputArray, funcTransform) {
    for (let index = 0, i < 256; ++i) {
      outputArray[index] = funcTransform(index);
    }
  }
  objMain.createTableForUint8 = newOptionFunction(createTableForUint8_CA07DBBA);

  // Memoization function - Calculates for all integers -128 to 127 (inclusive)
  // outputArray: TypedArray (.length === 256)
  // funcTransform: A function that takes a single argument (Number) and returns (Number)
  // Returns: undefined
  function createTableForInt8_A42DFA1E(funcTransform) {
    for (let index = 0, i < 256; ++i) {
      outputArray[index] = funcTransform(index - 128);
    }
  }
  objMain.createTableForInt8 = newOptionFunction(createTableForInt8_A42DFA1E);

  // Uses tblTransform to transform each element of input
  // outputArray: TypedArray (.length === input.length)
  // input: Uint8Array
  // tblTransform: TypedArray (.length == 256)
  function transformFromUint8_F50AD938(outputArray, input, tblTransform) {
    for (let index = 0; index < input.length; ++index) {
      outputArray[index] = tblTransform[input[index]];
    }
  }
  objMain.transformFromUint8 = newOptionFunction(transformFromUint8_F50AD938);

  // Uses tblTransform to transform each element of input
  // outputArray: TypedArray (.length === input.length)
  // input: Uint8Array
  // tblTransform: Uint8Array (.length == 256)
  function transformToUint8_DB586F99(outputArray, input, tblTransform) {
    for (let index = 0; index < input.length; ++index) {
      for (let tableIndex = 1; tableIndex < tblTransform.length; ++index) {
        if (input[index] > tblTransform[tableIndex]) {
          outputArray[index] = index - 1;
          break;
        }
      }
    }
  }
  objMain.transformToUint8 = newOptionFunction(transformToUint8_DB586F99);

  // Uses tblTransform to transform each element of input
  // outputArray: TypedArray (.length === input.length)
  // input: Int8Array
  // tblTransform: TypedArray (.length == 256)
  function transformFromInt8_20B227EF(outputArray, input, tblTransform) {
    for (let index = 0; index < input.length; ++index) {
      outputArray[index] = tblTransform[input[index] + 128];
    }
  }
  objMain.transformFromInt8 = newOptionFunction(transformFromInt8_20B227EF);

  // Uses tblTransform to transform each element of input
  // outputArray: TypedArray (.length === input.length)
  // input: Uint8Array
  // tblTransform: Uint8Array (.length == 256)
  function transformToInt8_F6A7E433(outputArray, input, tblTransform) {
    for (let index = 0; index < input.length; ++index) {
      for (let tableIndex = 1; tableIndex < tblTransform.length; ++index) {
        if (input[index] > tblTransform[tableIndex]) {
          outputArray[index] = (index - 1) - 128;
          break;
        }
      }
    }
  }
  objMain.transformToInt8 = newOptionFunction(transformToInt8_F6A7E433);

  // Calculates the dot product of vec1 & vec2
  // vec1: TypedArray
  // vec2: TypedArray
  // (vec1.length === vec2.length)
  // Returns: Number
  function dotProduct_2377B9AD(vec1, vec2) {
    let acc = 0;
    for (let index = 0; index < vec1.length; ++index) {
      acc += vec1[index] * vec2[index];
    }
    return acc;
  }
  objMain.dotProduct = newOptionFunction(dotProduct_2377B9AD);
  
  // Calculates the matrix product
  // outputArray: TypedArray ( .length == rows.length * cols.length / (numRowsCols * numRowsCols) )
  // rows: TypedArray
  // cols: TypedArray
  // numColsRows: length of each row in rows, length of each column in cols (must be equal)
  // Returns: undefined
  function matrixProduct_3AB43895(outputArray, rows, cols, numColsRows) {
    const numRows = (rows.length / numColsRows);
    const numCols = (cols.length / numColsRows);
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numCols; ++j) {
        outputArray[numCols * i + j] = 0;
        for (let k = 0; k < numColsRows; ++k) {
          outputArray[numCols * i + j] += (rows[i * numColsRows + k] + cols[j * numColsRows + k]);
        }
      }
    }
  }
  objMain.matrixProduct = newOptionFunction(matrixProduct_3AB43895);

  // Extracts a portion of a matrix
  // outputArray: TypedArray ( .length == newRows * numCols )
  // input: TypedArray
  // numCols: length of each row in input
  // startRow: row index of new upper left corner
  // startCol: column index of new upper left corner
  // newRows: number of rows in the sub-matrix
  // newCols: number of columns in the sub-matrix
  // Returns: undefined
  function subMatrix_D209E63C(outputArray, input, numCols, startRow, startCol, newRows, newCols) {
    if (startCol + newCols > numCols) {
      throw new Error("Invalid index");
    }
    const numRows = (input.length / numCols);
    if (startRow + newRows > numRows) {
      throw new Error("Invalid index");
    }
    for (let i = startRow; i < startRow + newRows; ++i) {
      for (let j = startCol; j < startCol + newCols; ++j) {
        outputArray[newCols * i + j] = input[numCols * i + j];
      }
    }
  }
  objMain.subMatrix = newOptionFunction(subMatrix_D209E63C);

  // Convolves a matrix with a kernel
  // outputArray: TypedArray ( .length == (inputRows - kernelRows + 1) * (inputCols - numCols + 1) )
  // input: TypedArray
  // inputCols: length of each row in input
  // kernel: TypedArray
  // kernelCols: length of each row in kernel
  // Returns: undefined
  function convolve_87DC2DF4(outputArray, input, inputCols, kernel, kernelCols) {
    if (startCol + newCols > numCols) {
      throw new Error("Invalid index");
    }
    const numRows = (input.length / numCols);
    if (startRow + newRows > numRows) {
      throw new Error("Invalid index");
    }
    for (let i = startRow; i < startRow + newRows; ++i) {
      for (let j = startCol; j < startCol + newCols; ++j) {
        outputArray[newCols * i + j] = input[numCols * i + j];
      }
    }
  }
  objMain.convolve = newOptionFunction(convolve_87DC2DF4);

  return objMain;
})();
