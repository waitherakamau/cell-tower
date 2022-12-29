const path = require('path');
const fs   = require('fs');
const notifier = require('node-notifier');

//Windows notification for start of prod build
notifier.notify({
    title: 'Production Build',
    message: 'Building Faulu Project for production',
    icon: path.join(__dirname, '../../public/images/logo.png'), // Absolute path (doesn't work on balloons)
    sound: true
});


let prodConnection = {
    "protocol": "http",
    "host": "10.1.145.43",
    "port": 4000
}

//Delete .next & public folders
console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>PRE PROD Script<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
console.log(`>>>>>>>>>>>>>>>>>>Deleting .next & public folders<<<<<<<<<<<<<<<<<<`)

try {
    fs.rmdirSync(path.join(__dirname, '../../.next'), { recursive: true });
    fs.rmdirSync(path.join(__dirname, '../../dist/public'), { recursive: true });
    fs.unlinkSync(path.join(__dirname, '../public.zip'))
} catch (e) {
    console.log(e.message)
}

console.log(`>>>>>>>>>>>>>>>>>>>>>>Update Prod connection<<<<<<<<<<<<<<<<<<<<<<`)
console.log(prodConnection)

try {
    fs.writeFileSync(path.join(__dirname, '../../src/services/api', 'index.js'), `export default ${JSON.stringify(prodConnection, null, 4)}`)
} catch (error) {
    console.log(error)
}