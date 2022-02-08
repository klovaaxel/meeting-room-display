//-- Global variables
let time;
let todayEvents = [];

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

    let activeEvents = [];
    let endedEvents = [];
    let uppcomingEvents = [];

    events.forEach(event => {
        let eventTitle = event[1][1][3];
        let eventStartDate = event[1][2][3].split("T")[0];
        let eventStartTime = event[1][2][3].split("T")[1].split(":")[0] + ":" + event[1][2][3].split("T")[1].split(":")[1];
        let eventEndDate = event[1][3][3].split("T")[0];
        let eventEndTime = event[1][3][3].split("T")[1].split(":")[0] + ":" + event[1][3][3].split("T")[1].split(":")[1];

        //-- Create HTML objects with event content
        let title = document.createElement("h3");
        title.appendChild(document.createTextNode(eventTitle));

        let startTime = document.createElement("time");
        startTime.appendChild(document.createTextNode(eventStartTime));

        let endTime = document.createElement("time");
        endTime.appendChild(document.createTextNode(eventEndTime));

        let status = document.createElement("div");

        //-- Get status of event
        let eventHasStarted = eventStartTime.split(":")[0] < time.split(":")[0] && eventStartTime.split(":")[1] < time.split(":")[1];
        let eventHasEnded = eventEndTime.split(":")[0] < time.split(":")[0] && eventEndTime.split(":")[1] < time.split(":")[1];

        if (!eventHasStarted && !eventHasEnded) { 
            eventStatus.classList = "uppcoming";
            uppcomingEvents.push(event);
        }
        if (eventHasStarted && !eventHasEnded) { 
            status.classList = "active"; 
            activeEvents.push(event);
        }
        if (eventHasEnded) { 
            status.classList = "ended"; 
            endedEvents.push(event)
        }

        //-- Append Content to DOM document
        let container = document.createElement("div")
        container.appendChild(title);
        container.appendChild(startTime);
        container.appendChild(endTime);
        container.appendChild(status);
        
        document.getElementById("event-container").innerHTML = "";
        document.getElementById("event-container").appendChild(container);
    });
    if(activeEvents.length > 0){
        document.getElementById("status").classList = "closed"
    }else{
        document.getElementById("status").classList = "open"
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
    setTimeout(startTime, 5000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

getICS()
