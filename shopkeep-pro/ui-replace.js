const fs = require('fs');
const path = require('path');

function walkthroughDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkthroughDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            let replacements = [
                ['indigo-600', 'orange-600'],
                ['indigo-500', 'orange-500'],
                ['indigo-700', 'orange-700'],
                ['indigo-50', 'gray-100'],
                ['indigo-100', 'orange-100'],
                ['indigo-800', 'orange-800'],
                ['indigo-900', 'orange-900'],
                
                // Be careful with shapes. Let's do exact words to avoid cascading replacements
                ['rounded-\\[40px\\]', 'rounded-xl'],
                ['rounded-3xl', 'rounded-xl'],
                ['rounded-2xl', 'rounded-lg']
            ];

            let modified = content;
            for (let [find, replace] of replacements) {
                // Use regex with global flag
                modified = modified.replace(new RegExp(find, 'g'), replace);
            }

            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log('Modified: ' + fullPath);
            }
        }
    });
}

const dirPath = path.resolve('c:/Users/Abdul Muntakim/Desktop/SE Project2/Shop_Mangement_System_ShopKeep_Pro-main/shopkeep-pro/src');
walkthroughDir(dirPath);
console.log("Global UI replacement complete.");
