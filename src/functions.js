
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

function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}
