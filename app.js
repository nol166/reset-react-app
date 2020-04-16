const fs = require('fs')
const Path = require('path')
const path = process.argv[2]
// const newFiles = process.argv[3]
let hasDir = false
let hasApp = false
let hasServer = false
let hasConfig = 
let dirtyPkg = false
const freshPkgPath = './resources/package.json'
const currentPkgPath = `${path}/package.json`
const freshPkg = fs.readFileSync(freshPkgPath)
const currentPkg = fs.readFileSync(currentPkgPath)
let results = []

const bold = str => {
    return '\033[1m' + str + '\033[0m'
}

const green = str => {
    return '\x1b[36m' + str + '\x1b[0m'
}

const red = str => {
    return '\x1b[31m' + str + `\x1b[0m`
}

// check if dir exists
if (!path) {
    console.log(`${bold('reset-react-app')}`)
    console.log(`Usage: ${__filename} path/to/react_app`)
    process.exit(-1)
}

// check for dirty package.json
const isDirty = (current, fresh) => {
    if (current.length === fresh.length) {
        return false
    } else {
        return true
    }
}

const deleteFolderRecursive = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = Path.join(path, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath)
            } else {
                // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
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
        // check if react app has a src directory
        hasDir = item === 'src' ? true : false
        if (hasDir) {
            deleteFolderRecursive(`${path}/src`)
            results.push(red('removed src/ folder'))
        }
        if (item === 'package.json') {
            dirtyPkg = isDirty(currentPkg, freshPkg)
            try {
                if (dirtyPkg) {
                    //file exists, delete it
                    fs.unlink(currentPkgPath, () => console.log('\n'))
                    results.push(red('deleting dirty package.json'))
                    // copy the clean one
                    fs.copyFile(freshPkgPath, currentPkgPath, err => {
                        if (err) throw err
                    })
                    results.push(bold('copied clean package.json'))
                }
            } catch (err) {
                console.error(err)
            }
        }
    })

    fs.existsSync(`${path}/src`) || fs.mkdirSync(`${path}/src`)
    results.push(green('created fresh src/ directory'))

    // log out any results at the end
    if (results.length > 0) {
        console.log('\n')
        results.forEach(result => console.log(result))
    } else {
        console.log('')
        console.log(bold('No reset needed'))
    }
})
