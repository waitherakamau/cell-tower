const path = require('path');
const fs   = require('fs');
const notifier = require('node-notifier');

//Windows notification for start of prod build
notifier.notify({
    title: 'Development Build',
    message: 'Building Faulu Project for dev',
    icon: path.join(__dirname, '../../public/images/logo.png'), // Absolute path (doesn't work on balloons)
    sound: true
});

//Delete .next & public folders
console.log('>'.repeat(37)+`PRE DEV SCRIPT`+ '<'.repeat(37))
console.log('>'.repeat(37)+`Deleting .next folder`+ '<'.repeat(37))

try {
    fs.rmdirSync(path.join(__dirname, '../../.next'), { recursive: true });
    fs.rmdirSync(path.join(__dirname, '../../src/.next'), { recursive: true });
} catch (e) {
    console.log(e.message)
}

console.log('>'.repeat(37)+`Successful 🚀🚀🚀🚀🚀🚀`+ '<'.repeat(37))