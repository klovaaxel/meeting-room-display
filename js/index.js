//-- Global variables
let time;
let todayEvents = [];
let activeEvents = [];
let endedEvents = [];
let uppcomingEvents = [];

//-- Get info from url if present
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


//-- Temp values Should be enterd on first boot
let nameMonitor = urlParams.get('name'); //"Axel Karlsson" 
let icsURL = urlParams.get('icsurl'); //'https://outlook.office365.com/owa/calendar/9a94fe7204354d6088ce1fc6a54c1fc0@stenungsund.se/2ff6c8f6193c49699814159643a9969b7290947781098632186/calendar.ics'

//--- Today, Dates and day of the week
let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

let today = new Date();
let todayWeekDay = weekDays[today.getDay()-1]
document.getElementById("weekDay").appendChild(document.createTextNode(todayWeekDay));

//--- ICS Feed fetcher and data handler
let iCalendarData;
let jcalData;

function getICS(){
    today = new Date();
    console.log("Getting ICS Feed");
    console.log(icsURL)

    $.ajax({
        url: icsURL,
        method: 'GET',
        success: function (data, textStatus, jqXHR) {
            todayEvents.length = 0;
            
            jsonData = convert(data);
            events = jsonData.VCALENDAR[0].VEVENT;

            events.forEach(event => {
                //-- Get start date of event from json object
                dtStartKey = Object.keys(event).filter((key) => key.includes('DTSTART'));
                eventStartDateString = event[dtStartKey].slice(0,4) + "-" + event[dtStartKey].slice(4,6) + "-" + event[dtStartKey].slice(6,11) + ":" +  event[dtStartKey].slice(11,13) + ":" +  event[dtStartKey].slice(13,16);
                let eventStartDate = new Date(eventStartDateString)
                
                //-- Check if start date is today
                if (eventStartDate.getDate() == today.getDate() && eventStartDate.getMonth() == today.getMonth() && eventStartDate.getFullYear() == today.getFullYear()) {    
                    //-- Add todays events to list
                    todayEvents.push(event);
                }

            });       
            addEventsToHTML(todayEvents)
        },
        error: function (request, status, error) {
            if(request.responseText == undefined){
                alert("You probably have a CORS issue, To resolve this you can change the CORS header on your ICS/ICAL server (or set up a proxy server which adds a CORS header), or as a last resort disable cors entierly for this PWA")
            }else{
                alert(request.responseText);
            }
        }
    });
}

//-- Update HTML with Event Data 
function addEventsToHTML(events){
    const today = new Date();

    activeEvents.length = 0;
    endedEvents.length = 0;
    uppcomingEvents.length = 0;

    document.getElementById("event-container").innerHTML = "";

    events.forEach(event => {
        //-- Get event title
        let eventTitle = event.SUMMARY;
        //-- Get event start date
        dtStartKey = Object.keys(event).filter((key) => key.includes('DTSTART'));
        eventStartDateString = event[dtStartKey].slice(0,4) + "-" + event[dtStartKey].slice(4,6) + "-" + event[dtStartKey].slice(6,11) + ":" +  event[dtStartKey].slice(11,13) + ":" +  event[dtStartKey].slice(13,16);
        let eventStartDate = new Date(eventStartDateString)
        //-- Get event end date
        dtEndKey = Object.keys(event).filter((key) => key.includes('DTEND'));
        eventStartDateString = event[dtEndKey].slice(0,4) + "-" + event[dtEndKey].slice(4,6) + "-" + event[dtEndKey].slice(6,11) + ":" +  event[dtEndKey].slice(11,13) + ":" +  event[dtEndKey].slice(13,16);
        let eventEndDate = new Date(eventStartDateString)

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
        updateTheme("#C57272");
    }else{
        document.getElementById("status").classList = "open";
        updateTheme("#7BC572");
    }
    
    //-- Add/update text saying how long till next event
    updateTimeToNextEvent(uppcomingEvents, activeEvents)

    //-- Update weekday
    todayWeekDay = weekDays[today.getDay()-1]
    document.getElementById("weekDay").innerHTML = "";
    document.getElementById("weekDay").appendChild(document.createTextNode(todayWeekDay));

}

function updateTimeToNextEvent(uppcomingEvents, activeEvents){
    //-- Add text saying how long till next event
    const today = new Date();
    p = document.getElementById("nextBookingTime");
    if(activeEvents === undefined || activeEvents.length == 0){
        if(uppcomingEvents === undefined || uppcomingEvents.length == 0){
            p.innerHTML = "";
            p.appendChild(document.createTextNode("Unbooked for the rest of the day"));
        }else{
            //-- Get start time of next uppcoming event
            dtStartKey = Object.keys(uppcomingEvents[0]).filter((key) => key.includes('DTSTART'));
            uppcomingEventStartDateString = uppcomingEvents[0][dtStartKey].slice(0,4) + "-" + uppcomingEvents[0][dtStartKey].slice(4,6) + "-" + uppcomingEvents[0][dtStartKey].slice(6,11) + ":" +  uppcomingEvents[0][dtStartKey].slice(11,13) + ":" +  uppcomingEvents[0][dtStartKey].slice(13,16);
            let uppcomingEventDate = new Date(eventStartDateString)

            p.innerHTML = "";
            timeToNextEvent = msToHM(uppcomingEventDate - today);
            p.appendChild(document.createTextNode(timeToNextEvent + " to next booking"))
        }
    }
    else{
        //-- Get start time of active/current event
        dtStartKey = Object.keys(activeEvents[0]).filter((key) => key.includes('DTSTART'));
        activeEventStartDateString = activeEvents[0][dtStartKey].slice(0,4) + "-" + activeEvents[0][dtStartKey].slice(4,6) + "-" + activeEvents[0][dtStartKey].slice(6,11) + ":" +  activeEvents[0][dtStartKey].slice(11,13) + ":" +  activeEvents[0][dtStartKey].slice(13,16);
        let activeEventDate = new Date(eventStartDateString)

        p.innerHTML = "";
        timeEventEnd = msToHM(-(today - new Date(activeEventDate)));
        p.appendChild(document.createTextNode(timeEventEnd + " to end of current booking"))
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
    setTimeout(loop, 10000);
} 

//-- Local Storage

//localStorage.setItem('nameMonitor', nameMonitor)
//localStorage.setItem('url', url)
function getLocalStorage(){
    if(nameMonitor == null || icsURL == null){
        if(localStorage.getItem("nameMonitor") == null && localStorage.getItem("icsURL") == null){
            displayNewUserPrompt();
        }else{
            nameMonitor = localStorage.getItem("nameMonitor");
            icsURL = localStorage.getItem("icsURL");
            document.getElementById("name").innerHTML = "";
            document.getElementById("name").appendChild(document.createTextNode(nameMonitor));
            loop();
        }
    }
    loop();
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

function updateTheme(color){
    let scheme = document.querySelector('meta[name="theme-color"]');
    scheme.setAttribute('content', color);
}