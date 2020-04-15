const fs = require('fs')
const path = process.argv[2]
let hasDir = false
let hasPackageJSON = false

const bold = str => {
    return '\033[1m' + str + '\033[0m'
}

// check if dir exists
if (!path) {
    console.log('Usage: ' + __filename + ' path/to/directory')
    process.exit(-1)
}

fs.readdir(path, (err, items) => {
    if (err) {
        console.log(err)
        process.exit(-1)
    }
    console.log(bold('Current items:'))
    items.forEach(item => {
        console.log(item)
        hasDir = item === 'src' ? true : false
    })
})
