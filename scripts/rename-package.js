/**
 * Github Action can't publish the package without scope written within the package name
 * We need to change the name of the package to be "@scope/packageName"
 * I have `scope` in package.json, so that, web should use that scope to rename the package
*/
const fs = require('fs');
const path = require('path');

// importing the package.json file
const package = require('../package.json');

// rename the package (add the scope to it)
package.name = `${package.scope}/${package.name}`;

// write the changes to package.json again
fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(package, null, 2));
