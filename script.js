const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const attendanceGoalDisplay = document.getElementById("attendanceGoal");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const celebrationMessage = document.getElementById("celebrationMessage");
const winningTeamNameDisplay = document.getElementById("winningTeamName");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");
const emptyAttendeeList = document.getElementById("emptyAttendeeList");
const attendanceGoal = 50;
const attendeeCountStorageKey = "eventCheckInAttendeeCount";
const waterCountStorageKey = "eventCheckInWaterCount";
const zeroCountStorageKey = "eventCheckInZeroCount";
const powerCountStorageKey = "eventCheckInPowerCount";
const attendeeListStorageKey = "eventCheckInAttendees";
let attendeeCount = Number(localStorage.getItem(attendeeCountStorageKey)) || 0;
let waterCount = Number(localStorage.getItem(waterCountStorageKey)) || 0;
let zeroCount = Number(localStorage.getItem(zeroCountStorageKey)) || 0;
let powerCount = Number(localStorage.getItem(powerCountStorageKey)) || 0;
let attendees = JSON.parse(
  localStorage.getItem(attendeeListStorageKey) || "[]",
);

function renderAttendeeList() {
  attendeeList.textContent = "";
  emptyAttendeeList.style.display = attendees.length === 0 ? "block" : "none";

  for (let index = 0; index < attendees.length; index += 1) {
    const attendeeItem = document.createElement("li");
    const attendeeName = document.createElement("strong");
    const attendeeTeam = document.createElement("span");

    attendeeName.textContent = attendees[index].name;
    attendeeTeam.textContent = attendees[index].team;
    attendeeItem.appendChild(attendeeName);
    attendeeItem.appendChild(attendeeTeam);
    attendeeList.appendChild(attendeeItem);
  }
}

function updateProgress() {
  attendeeCountDisplay.textContent = attendeeCount;

  const progressPercentage = Math.min(
    (attendeeCount / attendanceGoal) * 100,
    100,
  );
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute("aria-valuenow", progressPercentage);
  progressText.textContent = `${progressPercentage}% of attendance goal`;
}

function updateCelebration() {
  if (attendeeCount >= attendanceGoal) {
    let highestTeamCount = waterCount;
    let winningTeamNames = ["Team Water Wise"];

    if (zeroCount > highestTeamCount) {
      highestTeamCount = zeroCount;
      winningTeamNames = ["Team Net Zero"];
    } else if (zeroCount === highestTeamCount) {
      winningTeamNames.push("Team Net Zero");
    }

    if (powerCount > highestTeamCount) {
      highestTeamCount = powerCount;
      winningTeamNames = ["Team Renewables"];
    } else if (powerCount === highestTeamCount) {
      winningTeamNames.push("Team Renewables");
    }

    winningTeamNameDisplay.textContent = winningTeamNames.join(" and ");
    celebrationMessage.style.display = "block";
  }
}

attendanceGoalDisplay.textContent = attendanceGoal;
waterCountDisplay.textContent = waterCount;
zeroCountDisplay.textContent = zeroCount;
powerCountDisplay.textContent = powerCount;
renderAttendeeList();
updateProgress();
updateCelebration();

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  attendeeCount += 1;

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;
  attendees.push({ name: attendeeName, team: teamName });

  if (selectedTeam === "water") {
    waterCount += 1;
    waterCountDisplay.textContent = waterCount;
  } else if (selectedTeam === "zero") {
    zeroCount += 1;
    zeroCountDisplay.textContent = zeroCount;
  } else if (selectedTeam === "power") {
    powerCount += 1;
    powerCountDisplay.textContent = powerCount;
  }

  localStorage.setItem(attendeeCountStorageKey, attendeeCount);
  localStorage.setItem(waterCountStorageKey, waterCount);
  localStorage.setItem(zeroCountStorageKey, zeroCount);
  localStorage.setItem(powerCountStorageKey, powerCount);
  localStorage.setItem(attendeeListStorageKey, JSON.stringify(attendees));

  renderAttendeeList();
  updateProgress();
  updateCelebration();

  greeting.textContent = `Welcome, ${attendeeName}! You're checked in with ${teamName}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  checkInForm.reset();
  attendeeNameInput.focus();
});
