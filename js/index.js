//-- Global variables
let time;
let todayEvents = [];
let activeEvents = [];
let endedEvents = [];
let uppcomingEvents = [];

//-- Temp values Should be enterd on first boot
let nameMonitor = "Axel Karlsson" 
let icsURL = 'https://outlook.office365.com/owa/calendar/9a94fe7204354d6088ce1fc6a54c1fc0@stenungsund.se/2ff6c8f6193c49699814159643a9969b7290947781098632186/calendar.ics'

document.getElementById("name").appendChild(document.createTextNode(nameMonitor));

//--- Today, Dates and day of the week
let weekDays = ["Mondag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"]

let today = new Date();
let todayWeekDay = weekDays[today.getDay()-1]
document.getElementById("weekDay").appendChild(document.createTextNode(todayWeekDay));

//Get Todays date and format it with leading zeroes if value less than 10
let todayDate = today.getFullYear()+'-'
if(today.getMonth()+1 < 10){
    todayDate  += "0" + (today.getMonth()+1)+'-'
}else{
    todayDate  += (today.getMonth()+1)+'-'
}
if(today.getDay() < 10){
    todayDate  += "0" + today.getDate()
}else{
    todayDate  += today.getDate()
}

//--- ICS Feed fetcher and data handler
let iCalendarData;
let jcalData;

function getICS(){
    console.log("Getting ICS Feed");

    $.ajax({
        url: icsURL,
        method: 'GET',
    }).done(function(data, textStatus, jqXHR){
            todayEvents.length = 0;
            jcalData = ICAL.parse(data);

            jcalData[2]
                .slice(1)
                .forEach(event => {
            
                    let eventStartDate = event[1][2][3].split("T")[0];

                    if (eventStartDate == todayDate) {    
                        //-- Add todays events to list
                        todayEvents.push(event);  
                    }

                    addEventToHTML(todayEvents)
            });                   
    });
}
//-- Update HTML with Event Data 
function addEventToHTML(events){

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
        eventTime.appendChild(document.createTextNode(eventStartDate.getHours() + ":" + eventStartDate.getMinutes() + " - " + eventEndDate.getHours() + ":" + eventEndDate.getMinutes()));

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

function msToHM( ms ) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    if (hours == 0) {
        return minutes + 1 + "m";
    }
    return hours+"hours "+minutes + 1 + "minutes";
}


function start(){
    startTime()
    getICS()
    updateTimeToNextEvent(uppcomingEvents)
    setTimeout(start, 10000);
}