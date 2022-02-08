let time;
//-- Clock
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML = "";
    document.getElementById('clock').appendChild(document.createTextNode(h + ":" + m));
    time = h + ":" + m;
    setTimeout(startTime, 60000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
