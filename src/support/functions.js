
/**
 * Return current timestamp in a db-alike format
 * @returns 
 */
function now() {
    const date = new Date;

    const year = date.getFullYear();
    const month = ('00' + (date.getMonth()+1).toString()).slice(-2);
    const day = ('00' + date.getDate().toString()).slice(-2);
    const hours = ('00' + date.getHours().toString()).slice(-2);
    const minutes = ('00' + date.getMinutes().toString()).slice(-2);
    const seconds = ('00' + date.getSeconds().toString()).slice(-2);
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Promise-handled wait
 * @param {number} ms 
 * @returns 
 */
function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

/**
 * Get a specific node
 * @param {*} element 
 * @param {*} tagName 
 * @returns 
 */
function getNode(element, tagName) {
    if (element.localName == tagName) {
        return element;
    } else {
        return element.closest(tagName);
    }
}

/**
 * Cheap Deep-Clone Handler
 * @param {Object} object 
 * @param {Function} mapFunc 
 * @returns 
 */
function clone(object, mapFunc = null) {
    const cloned = JSON.parse(JSON.stringify(object));
    if (typeof mapFunc == 'function') {
        cloned.map(mapFunc);
    }
    return cloned;
}
