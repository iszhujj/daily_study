const path = require('path')
const fs = require('fs')

// let dir = path.resolve('')
// console.log(dir)

// let paths = fs.readdirSync('./tempFile')
// console.log(paths)
// console.log(path.resolve(paths[0]))

let files = fs.readdirSync('./tempChunk')
console.log(files)

let info = fs.statSync(path.resolve('./tempChunk', files[0]))
console.log(info)

