/* First Dial on the page (Dial 1) - currently the Limb Alignment Dial */
const dial1 = document.getElementById('limb-alignment')
const val1 = document.getElementById('dial-1-value')
const plus1 = document.getElementById('plus-dial-1')
const minus1 = document.getElementById('minus-dial-1')
const maxVal1 = val1.getAttribute('max')

// track x and y of mouse positions
let prevX1 = 0
let prevY1 = 0

function parameterDial1 (e) {
  // calculate 1/2 of dial wodith and height
  const width = (dial1.clientWidth / 2)
  const height = (dial1.clientHeight / 2)

  // get current mouse coordinates
  const x = (e.clientX - dial1.offsetLeft)
  const y = (e.clientY - dial1.offsetTop)

  // calculate delta values
  const deltaX = (width - x)
  const deltaY = (height - y)

  // calculate mouse position in radians
  const rad = Math.atan2(deltaY, deltaX)
  // convert to degrees
  const deg = rad * (180 / Math.PI)

  // track mouse in each quarter of the dial
  if (y < height && x > width) { // top right quarter
    if (prevX1 <= x && prevY1 <= y) { // increasing
      val1.stepUp()
    } else if (prevX1 >= x && prevY1 >= y) { // decreasing
      val1.stepDown()
    }
  } else if (y > height && x > width) { // bottom right quarter
    if (prevX1 >= x && prevY1 <= y) { // increasing
      val1.stepUp()
    } else if (prevX1 <= x && prevY1 >= y) { // decreasing
      val1.stepDown()
    }
  } else if (y < height && x < width) { // top left quarter
    if (prevX1 <= x && prevY1 >= y) { // increasing
      val1.stepUp()
    } else if (prevX1 >= x && prevY1 <= y) { // decreasing
      val1.stepDown()
    }
  } else if (y > height && x < width) { // bottom left quarter
    if (prevX1 >= x && prevY1 >= y) { // increasing
      val1.stepUp()
    } else if (prevX1 <= x && prevY1 <= y) { // decreasing
      val1.stepDown()
    }
  }

  // update x and y values
  prevX1 = x
  prevY1 = y

  return deg
}

// Dial rotation
function rotate1 (e) {
  // final calculations for the mouse position
  parameterDial1(e)
  const value1 = val1.value * (360 / maxVal1) // ensures dial will only make 1 full rotation

  // rotate the dial based on final calculation - do not rotate further if value is at 0 or max
  if ((val1.value !== maxVal1) && (val1.value != 0)) { // eslint-disable-line
    dial1.style.transform = 'rotate(' + value1 + 'deg)' // rotates the dial to the correct position in degrees
  }
}

// Button click rotation
function rotateOnClick1 () {
  const value1 = val1.value * (360 / maxVal1)

  if ((val1.value !== maxVal1) && (val1.value != 0)) { // eslint-disable-line
    dial1.style.transform = 'rotate(' + value1 + 'deg)'
  }
  // if max value is reached while the button is held down, allow dial to move to that position when released
  if (val1.value == maxVal1 || val1.value == 0) { // eslint-disable-line
    dial1.style.transform = 'rotate(' + 0.01 + 'deg)'
  }
}

// If the user input to Value is ever over the max/min, alert the user and set it to max/min, otherwise rotate
function valueOutofBounds1 () {
  const value1 = val1.value * (360 / maxVal1)
  if (val1.value > ~~maxVal1) { // ~~ ensures maxVal is treated as a number
    val1.value = maxVal1
    dial1.style.transform = 'rotate(' + 0.01 + 'deg)' // return to start position
    alert('The maximum value for this input is ' + maxVal1)
  } else if (val1.value < 0) {
    val1.value = 0
    dial1.style.transform = 'rotate(' + 0.01 + 'deg)'
    alert('The minimum value for this input is 0')
  } else {
    dial1.style.transform = 'rotate(' + value1 + 'deg)' // rotate normally
  }
}

// When to rotate
function rotateStart1 () {
  window.addEventListener('mousemove', rotate1)
  window.addEventListener('mouseup', rotateEnd1)
}

function rotateEnd1 () {
  window.removeEventListener('mousemove', rotate1)
}

// Add event listener to dial
dial1.addEventListener('mousedown', rotateStart1)

// Add event listener to buttons
plus1.addEventListener('click', rotateOnClick1)
minus1.addEventListener('click', rotateOnClick1)

// Add event listener to numeric input
val1.addEventListener('change', valueOutofBounds1)
