const resultInput = document.getElementById('file2')
let resultOutput = [[]]
let highestForce = 0.9
let lowestForce = 0.1
let resultColumnToUse = 0
let isStress = false
let isStrain = false

// Event listener listening to the choose file button for Results file. Code is executed on press of that button, not Draw
resultInput.addEventListener('change', () => {
  const resultFiles = resultInput.files

  if (draw.disabled) { // eslint-disable-line
    draw.disabled = false // eslint-disable-line
  }

  // Clearing data from resultOutput if input file is changed
  resultOutput = [[]]
  isStress = false
  isStrain = false

  if (resultFiles.length === 0) return

  const file = resultFiles[0]
  const resultReader = new FileReader()
  resultReader.readAsText(file)

  const filename = file.name.toLowerCase() // makes filename case insensitive

  // checks for stress or strain file naming convention
  // could be used by future groups to add a proper unit to the map key based on file type
  if (filename.includes('_s')) {
    isStress = true
  } else if (filename.includes('_le')) {
    isStrain = true
  } else {
    alert('File name must specify whether it is a stress (S) or strain (LE) file') // alerts the user if file does not follow expected file naming conventions
    return
  }

  console.log('isStress = ' + isStress)
  console.log('isStrain = ' + isStrain)

  // Reader opens file and parses all values, force and element number, into 2d array
  resultReader.onload = (e) => {
    const resFile = e.target.result
    const resLines = resFile.split(/\r\/|\n/)
    // console.log(resLines.length)
    let indexCount = resLines.length

    let index = 0
    while (indexCount > 0) {
      const placehold = resLines[index].split(',')
      // if (resLines[index].search(/(^(\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm) !== (-1)) {
      //   resultOutput.splice(index,1)
      //   break
      // }
      placehold.forEach(element => {
        resultOutput[index].push(parseFloat(element.slice(1))) // turning strings into ints, trimming off extra spaces
      })
      resultOutput.push([])
      index++
      indexCount--
    }
    console.log(resultOutput)

    // finding the highest force value in the first row and column for canvas.js to use
    const rowLength = resultOutput[0].length
    let nullCount = index
    while (resultOutput[nullCount].length < rowLength) {
      resultOutput.splice(nullCount, 1)
      nullCount--
    }
    index = nullCount
    let resultHighestVal = 0
    let resultLowestVal = Number.MAX_SAFE_INTEGER
    // Double for loop finds highest force value in the file and the column that value belongs to

    for (let j = 0; j < index; j++) {
      for (let i = 1; i < rowLength; i++) {
        if (resultOutput[j][i] > resultHighestVal) {
          resultHighestVal = resultOutput[j][i]
          resultColumnToUse = i
        }
      }
    }

    // finding the lowest value in columnToUse
    for (let i = 0; i < index; i++) {
      if (resultOutput[i][resultColumnToUse] < resultLowestVal) {
        resultLowestVal = resultOutput[i][resultColumnToUse]
      }
    }
    // These values are assigned here and referenced in canvas.js
    console.log('INDEX: ' + index)
    highestForce = resultHighestVal
    lowestForce = resultLowestVal
    console.log(highestForce)
    console.log(lowestForce)

    heatmapKey(colorList) // eslint-disable-line
  }
})
