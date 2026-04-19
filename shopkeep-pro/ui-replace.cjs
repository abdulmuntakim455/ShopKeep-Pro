const fs = require('fs');
const path = require('path');

function walkthroughDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkthroughDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Catch-all for any remaining indigo to orange
            let modified = content.replace(/indigo-/g, 'orange-');

            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log('Modified: ' + fullPath);
            }
        }
    });
}

const dirPath = path.resolve('c:/Users/Abdul Muntakim/Desktop/SE Project2/Shop_Mangement_System_ShopKeep_Pro-main/shopkeep-pro/src');
walkthroughDir(dirPath);
console.log("Secondary UI replacement complete.");
