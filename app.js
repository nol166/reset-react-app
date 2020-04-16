const fs = require('fs')
const path = process.argv[2]
const newFiles = process.argv[3]
let hasDir = false
let dirtyPkg = false
const freshPkg = fs.readFileSync('./resources/package.json')
const currentPkg = fs.readFileSync(`${path}/package.json`)

const bold = str => {
    return '\033[1m' + str + '\033[0m'
}

const green = str => {
    return '\x1b[36m' + str + '\x1b[0m'
}

// check if dir exists
if (!path) {
    console.log(`${bold('reset-react-app')}`)
    console.log(`Usage: ${__filename} path/to/react_app  path/to/src_files`)
    process.exit(-1)
}

// check for dirty package.json
const isDirty = (current, fresh) => {
    if (Buffer.from(current) === Buffer.from(fresh)) {
        return false
    } else {
        return true
    }
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
        if (item === 'package.json') {
            dirtyPkg = isDirty(currentPkg, freshPkg)
            try {
                if (dirtyPkg) {
                    //file exists, delete it
                    console.log('deleting dirty package.json')
                    // fs.unlinkSync(currentPkg)
                    // copy the clean one
                    // fs.createReadStream(freshPkg).pipe(
                    //     fs.createWriteStream(currentPkg)
                    // )
                    console.log(green('Replaced package.json'))
                }
            } catch (err) {
                console.error(err)
            }
        }
    })
})
