//zip public some folder to some folder
const shell  = require('shelljs');
const path   = require('path');
const fs     = require('fs');
const notifier = require('node-notifier');


notifier.notify({
    title: 'Production Build',
    message: 'Success 🚀🚀🚀🚀🚀🚀 Prduction build is ready',
    icon: path.join(__dirname, '../../public/images/logo.png'), // Absolute path (doesn't work on balloons)
    sound: true
});

let releaseDate = require('moment')().format('YYYY-MM-DD');

console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>POST PROD SCRIPT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
console.log(`>>>>>>>>>>>>>>>>>>>>>Zipping src & public Folders<<<<<<<<<<<<<<<<<<<<<<<`)

//shell.exec(`7z a ./pkg/src-${releaseDate}.zip ./ -xr!node_modules -xr!pkg -xr!TODO`)
shell.exec(`7z a ./pkg/public.zip ./dist/public`);


//fs writeSync localhost
let localConnection = {
    "protocol": "http",
    "host": "localhost",
    "port": 4005
}

console.log(`>>>>>>>>>>>>>>>>>>>>>>>>Return to localhost<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)

try {
    fs.writeFileSync(path.join(__dirname, '../../src/services/api', 'index.js'), `export default ${JSON.stringify(localConnection, null, 4)}`)
} catch (error) {
    console.log(error)
}


console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>Launching dev<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)