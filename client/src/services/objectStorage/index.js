export default {
    get: (key) => {
        let value = {};
        try {
            let parsedObject = JSON.parse(localStorage.getItem(key));
            if( typeof parsedObject  === 'object' && parsedObject !== null ){
                value = parsedObject;
            }
        } catch(e) {}
        return value;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
}