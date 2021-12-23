import * as fs from 'fs';


function getBuildVersion() {
    try {  
        var data = fs.readFileSync('version.txt', 'utf8');
        return data.toString().replace(/(\r\n|\n|\r)/gm, "");    
    } catch(e) {
        return 'Unknown Version'
    }
}

export default {
    getBuildVersion
}