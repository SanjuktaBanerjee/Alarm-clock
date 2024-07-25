const currentTime = document.querySelector("#display-current-time");
const hours = document.querySelector("#hour");
const minutes = document.querySelector("#min");
const seconds = document.querySelector("#sec");
const amPm = document.querySelector("#ampm");
const btnAlarm = document.querySelector("#btn-set-alarm");
const alarmContainer = document.querySelector("#container-list-new-alarms");

//loading the current time to html page and fetching alarms if any
window.addEventListener("DOMContentLoaded", (event) => {
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

//getting current time
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  currentTime.innerHTML = time;
  return time;
}

//setting alarms on click of new alarms btn
btnAlarm.addEventListener("click", getData);

//fetching value of hours, mins and sec for setting alarms
function getData() {
  const alarmTime = convertToTimeFormat(hours.value, minutes.value, seconds.value, amPm.value);
  setalarm(alarmTime);
}

// Converting time to  hour:min:sec am/pm format
function convertToTimeFormat(hour, min, sec, ampm) {
  return `${(hour)}:${min}:${sec} ${ampm}`;
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarm();

  alarms.forEach((time) => {
    setalarm(time, true);
  });
}

//check if alarmtime and current time matches will trigger the alarm
function setalarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Wake up!!");
    }
  }, 1000);

  setAlarminDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}


// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarm();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// checking if alarms are saved in local storage
function checkAlarm() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

//displaying the alarm in html container
function setAlarminDom(time, intervalId) {
  const divElement = document.createElement("div");
  divElement.classList.add("alarm", "margin-bottom", "display-flex");
  divElement.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = divElement.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(divElement);
}

//To delete the alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

//deleting alarm from local storage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarm();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}