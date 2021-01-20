import TokenContext from "./TokenContext"

function get() {
    return {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + TokenContext.getToken(),
        'Content-Type': 'application/json',
    }
}



export default {
    get
}