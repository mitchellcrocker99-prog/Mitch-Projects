// counter for hold interval
let counter
let timeout
let count = 0

/* Dial 1 - Limb Alignment Dial */

const num1 = document.getElementById('dial-1-value')
const sub1 = document.getElementById('minus-dial-1')
const add1 = document.getElementById('plus-dial-1')

// single click adds 1
add1.onclick = function () {
  num1.stepUp()
}

// holding mouse down continues to add 1
add1.onmousedown = function () {
  timeout = setTimeout(function () {
    counter = setInterval(function () {
      num1.innerHTML = count
      count++
      num1.stepUp()
    }, 100) // speed of adding
  }, 300) // speed of timeout
}

// releasing mouse button resets hold counter and stops adding
add1.addEventListener('mouseup', clearTimers)
add1.addEventListener('mouseleave', clearTimers)

// single click subtracts 1
sub1.onclick = function () {
  num1.stepDown()
}

// holding mouse down continues to subtract 1
sub1.onmousedown = function () {
  timeout = setTimeout(function () {
    counter = setInterval(function () {
      num1.innerHTML = count
      count++
      num1.stepDown()
    }, 100) // speed of subtracting
  }, 300) // speed of timeout
}

// releasing mouse button resets hold counter and stops subtracting
sub1.addEventListener('mouseup', clearTimers)
sub1.addEventListener('mouseleave', clearTimers)

/* Dial 2 - Body Weight Dial */
// Works same as dial above

const num2 = document.getElementById('dial-2-value')
const sub2 = document.getElementById('minus-dial-2')
const add2 = document.getElementById('plus-dial-2')

add2.onclick = function () {
  num2.stepUp()
}

add2.onmousedown = function () {
  timeout = setTimeout(function () {
    counter = setInterval(function () {
      num2.innerHTML = count
      count++
      num2.stepUp()
    }, 100)
  }, 300)
}

add2.addEventListener('mouseup', clearTimers)
add2.addEventListener('mouseleave', clearTimers)

sub2.onclick = function () {
  num2.stepDown()
}

sub2.onmousedown = function () {
  timeout = setTimeout(function () {
    counter = setInterval(function () {
      num2.innerHTML = count
      count++
      num2.stepDown()
    }, 100)
  }, 300)
}

sub2.addEventListener('mouseup', clearTimers)
sub2.addEventListener('mouseleave', clearTimers)

function clearTimers () {
  clearInterval(counter)
  clearTimeout(timeout)
}
