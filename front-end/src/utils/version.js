import version from 'raw-loader!../../version.txt';

function getBuildVersion() {
    try {  
        return version.replace(/(\r\n|\n|\r)/gm, "");    
    } catch(e) {
        return 'Unknown Version'
    }
}

export default {
    getBuildVersion
}