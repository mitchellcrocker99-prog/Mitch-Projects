const input = document.getElementById('file1')
let nodes = [[]]
let elements = [[]]
let isCart = false
let isBone = false

// runs as soon as a user selects a file
input.addEventListener('change', () => {
  const files = input.files

  // resets the draw button if the file is changed
  if (draw.disabled) { // eslint-disable-line
    draw.disabled = false // eslint-disable-line
  }

  // Clearing nodes and element data if input file is changed
  nodes = [[]]
  elements = [[]]
  sessionStorage.clear()

  isCart = false
  isBone = false

  // check for empty files
  if (files.length === 0) return

  const file = files[0]
  const filename = file.name.toLowerCase() // makes filename case insensitive
  const fileExt = filename.split('.').pop() // splits the string on '.' and returns the last array element, which will be the file extension/type

  // ensures that files are .inp files before attempting to parse them
  if (fileExt !== 'inp') {
    alert('Geometry files must be in .inp format')
    return
  }

  if (filename.includes('cart')) { // checks for cartilage file naming convention
    isCart = true
  } else if (filename.includes('bone')) { // checks for bone file naming convention
    isBone = true
  } else {
    alert('File name must specify whether it is a bone or cartilage file')
    return
  }

  // testing statements - left in place for future groups
  console.log('isCart = ' + isCart)
  console.log('isBone = ' + isBone)

  const reader = new FileReader()

  // treats the file as a text file
  reader.readAsText(file)

  // Reads in file line by line and stores each line as sessionStorage item
  reader.onload = (e) => {
    const file = e.target.result
    const lines = file.split(/\r\n|\n/)
    let count = 0 // counts up # of lines in file
    lines.forEach(element => {
      sessionStorage.setItem('line ' + count, element)
      count++
    })

    let line = 0 // current line being read, using 0 indexing again

    // find start of NODE section
    while (count >= 0) {
      if (sessionStorage.getItem('line ' + line).search(/node/i) !== (-1)) {
        console.log('matched node on line ' + (line + 1)) // testing statement, +1 to account for 0 indexing
        line++
        count--
        break
      }
      line++ // increases to read next line
      count-- // counts down lines remaining in file
    }

    let index = 0 // current node array index

    // Store Node elements until Element section begins
    while (count >= 0) {
      if (sessionStorage.getItem('line ' + line).search(/element/i) !== (-1)) {
        console.log('matched element on line ' + (line + 1)) // testing statement
        line++
        count--
        nodes.splice(index, 1) // removes extra array that gets created in final loop but never filled because elements section is found
        break
      }

      const temp = sessionStorage.getItem('line ' + line).split(',') // split current line on commas
      temp.forEach(element => {
        nodes[index].push(element.trim()) // add each comma separated value to array
      })

      index++
      nodes.push([]) // add new array for next node (creates multidemensional array)

      line++
      count--
    }

    index = 0 // reset array index for elements

    // Store Element elements until end of file
    while (count >= 0) {
      if (isBone) { // bone files do not have any sections after the elements section. end point is end of file
        if (sessionStorage.getItem('line ' + line).search(/(^(\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm) !== (-1)) {
          console.log('matched end of file on line ' + (line + 1)) // testing statement
          elements.splice(index, 1)
          break
        }
      } else if (isCart) { // cartilage files have additional sections of side nodes that we are currently ignoring, first side node section can act as EOF
        if (sessionStorage.getItem('line ' + line).search(/side/i) !== (-1)) {
          console.log('start of side nodes ' + (line + 1)) // testing statement
          elements.splice(index, 1)
          break
        }
      }

      // works the same as the nodes section, but for Elements array
      const temp = sessionStorage.getItem('line ' + line).split(',')
      temp.forEach(element => {
        elements[index].push(element.trim())
      })

      index++
      elements.push([])

      line++
      count--
    }

    // more testing statements
    console.log('FINAL NODE ARRAY' + '\n')
    console.log(nodes)
    console.log('FINAL ELEMENT ARRAY' + '\n')
    console.log(elements)
  }
  // error catching
  reader.onerror = (e) => alert(e.target.error.name)
})
