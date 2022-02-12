//-- Global variables
let time;
let todayEvents = [];
let activeEvents = [];
let endedEvents = [];
let uppcomingEvents = [];

//-- Temp values Should be enterd on first boot
let nameMonitor = "" //"Axel Karlsson" 
let icsURL = "" //'https://outlook.office365.com/owa/calendar/9a94fe7204354d6088ce1fc6a54c1fc0@stenungsund.se/2ff6c8f6193c49699814159643a9969b7290947781098632186/calendar.ics'

document.getElementById("name").appendChild(document.createTextNode(nameMonitor));

//--- Today, Dates and day of the week
let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

let today = new Date();
let todayWeekDay = weekDays[today.getDay()-1]
document.getElementById("weekDay").appendChild(document.createTextNode(todayWeekDay));

//--- ICS Feed fetcher and data handler
let iCalendarData;
let jcalData;

function getICS(){
    console.log("Getting ICS Feed");
    console.log(icsURL)

    $.ajax({
        url: icsURL,
        method: 'GET',
    }).done(function(data, textStatus, jqXHR){
            todayEvents.length = 0;
            jcalData = ICAL.parse(data);

            jcalData[2]
                .slice(1)
                .forEach(event => {
            
                    let eventStartDate = new Date(event[1][2][3]).getDate();

                    if (eventStartDate == today.getDate()) {    
                        //-- Add todays events to list
                        todayEvents.push(event);  
                    }

                    addEventToHTML(todayEvents)
            });                   
    });
}
//-- Update HTML with Event Data 
function addEventToHTML(events){
    const today = new Date();

    activeEvents.length = 0;
    endedEvents.length = 0;
    uppcomingEvents.length = 0;

    document.getElementById("event-container").innerHTML = "";

    events.forEach(event => {
        let eventTitle = event[1][1][3];
        let eventStartDate =  new Date(event[1][2][3]);
        let eventEndDate = new Date(event[1][3][3]);

        //-- Create HTML objects with event content
        let title = document.createElement("h3");
        title.appendChild(document.createTextNode(eventTitle));
        let eventTime = document.createElement("time");
        eventTime.appendChild(document.createTextNode(eventStartDate.toString().split(" ")[4].slice(0, -3) + " - " + eventEndDate.toString().split(" ")[4].slice(0, -3)));
        let eventStatus = document.createElement("div");
        
        //-- Get status of event
        let eventHasStarted = eventStartDate <= today;
        let eventHasEnded = eventEndDate <= today;

        if (!eventHasStarted && !eventHasEnded) { 
            eventStatus.classList = "uppcoming";
            uppcomingEvents.push(event);
        }
        if (eventHasStarted && !eventHasEnded) { 
            eventStatus.classList = "active"; 
            activeEvents.push(event);
        }
        if (eventHasEnded) { 
            eventStatus.classList = "ended"; 
            endedEvents.push(event)
        }

        //-- Append Content to DOM document
        let container = document.createElement("div")
        container.appendChild(title);
        container.appendChild(eventTime);

        container.appendChild(eventStatus);
        
        document.getElementById("event-container").appendChild(container);
    });

    if(activeEvents.length > 0){
        document.getElementById("status").classList = "closed";
    }else{
        document.getElementById("status").classList = "open";
    }
    
    //-- Add/update text saying how long till next event
    updateTimeToNextEvent(uppcomingEvents)

}

function updateTimeToNextEvent(events){
    //-- Add text saying how long till next event
    p = document.getElementById("nextBookingTime");
    p.innerHTML = ""
    if(events === undefined || events.length == 0){
        p.appendChild(document.createTextNode("Unbooked for the rest of the day"));
    }else{
        timeToNextEvent = msToHM(new Date(events[0][1][2][3]) - today);
        p.appendChild(document.createTextNode(timeToNextEvent + " to next booking"))
    } 
}

//-- Clock
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML = "";
    document.getElementById('clock').appendChild(document.createTextNode(h + ":" + m));
    time = h + ":" + m;
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

//-- Convert milliseconds to Hours and Minutes, omitting seconds
function msToHM( ms ) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour

    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.floor(seconds / 60 + 1); // 60 seconds in 1 minute

    if (hours == 0) {
        return minutes + " minutes";
    }
    return hours+" hours "+minutes + " minutes";
    // Code from Ozil https://stackoverflow.com/users/2168733/ozil and Ronan Quillevere https://stackoverflow.com/users/1301197/ronan-quillevere
    // https://stackoverflow.com/questions/29816872/how-can-i-convert-milliseconds-to-hhmmss-format-using-javascript
}

//-- Start function (run on load)
function start(){
    getLocalStorage();     
}
function loop(){
    startTime();
    getICS();
    updateTimeToNextEvent(uppcomingEvents);
    setTimeout(loop, 10000);
} 

//-- Local Storage

//localStorage.setItem('nameMonitor', nameMonitor)
//localStorage.setItem('url', url)
function getLocalStorage(){
    if(localStorage.getItem("nameMonitor") == null && localStorage.getItem("icsURL") == null){
        displayNewUserPrompt();
    }else{
        nameMonitor = localStorage.getItem("nameMonitor");
        icsURL = localStorage.getItem("icsURL");
        document.getElementById("name").appendChild(document.createTextNode(nameMonitor));
        loop();
    }
}


function displayNewUserPrompt(){
    // If prompt is open then do nothing
    if ((document.getElementById("prompt-new-user")) != null){
        return
    }

    // Screen name
    nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "screen-name");
    nameLabel.id = "screen-name-label";
    nameLabel.appendChild(document.createTextNode("Screen Name"));

    nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "screen-name";
    nameInput.name = "screen-name";

    // URL
    urlLabel = document.createElement("label");
    urlLabel.setAttribute("for", "url");
    urlLabel.id = "url-label";
    urlLabel.appendChild(document.createTextNode("ICS URL"));

    urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.id = "url";
    urlInput.name = "url";

    // Submit
    submitBTN = document.createElement("button");
    submitBTN.type = "button";
    submitBTN.setAttribute("onclick","submitFormNewUser();");
    submitBTN.appendChild(document.createTextNode("Continue"));

    //form
    form = document.createElement("form");
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(urlLabel);
    form.appendChild(urlInput);
    form.appendChild(submitBTN);

    //div container
    div = document.createElement("div");
    div.id = "prompt-new-user";
    div.appendChild(form);

    document.body.appendChild(div);
}


function submitFormNewUser(){
    formContainer = document.getElementById("prompt-new-user");

    localStorage.setItem("nameMonitor", document.getElementById("screen-name").value);
    nameMonitor = localStorage.getItem("nameMonitor");

    localStorage.setItem("icsURL", document.getElementById("url").value);
    icsURL = localStorage.getItem("icsURL");

    document.getElementById("name").appendChild(document.createTextNode(nameMonitor));

    formContainer.remove();

    loop();
}