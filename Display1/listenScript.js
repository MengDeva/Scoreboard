const socket = new WebSocket('ws://localhost:8991');

socket.onopen = function (event) {
  console.log("WebSocket connection opened");
};

socket.onmessage = function (event) {
  const scoreData = JSON.parse(event.data);
  updateScores(scoreData);
};

socket.onerror = function (event) {
  console.error("WebSocket error:", event);
};

function changeCircleColor(circleId, newColor) {
  const circleElement = document.getElementById(circleId);

  if (circleElement) {
    circleElement.style.backgroundColor = newColor;
  } else {
    console.error(`Circle with ID '${circleId}' not found.`);
  }
}

function updateInfo(team, png_name, name){
  logo = `/public/TeamLogo/${png_name}.png` 
  document.getElementById(`${team}-logo`).src = logo
  document.getElementById(`${team}-name`).textContent = name
}

function updateScores(data) {
  document.getElementById("team1-total-score").textContent = data.plant1*10 + data.harvest1*10 + data.store1*30;
  document.getElementById("team2-total-score").textContent = data.plant2*10 + data.harvest2*10 + data.store2*30;

  document.getElementById("rP1").textContent = data.plant1;
  document.getElementById("rH1").textContent = data.harvest1;
  document.getElementById("rS1").textContent = data.store1;
  document.getElementById("bP2").textContent = data.plant2;
  document.getElementById("bH2").textContent = data.harvest2;
  document.getElementById("bS2").textContent = data.store2;

  for(let i=0;i<5;i++){
    data.silos[i].forEach((ball, index )=> {
      if(ball==1){c = "red"}
      else if(ball==2){c="blue"}
      else{c=""}
      changeCircleColor(`s${i+1}-${index+1}`, c)
    });
  }
  updateInfo("team1", data.team1[0], data.team1[1])
  updateInfo("team2", data.team2[0], data.team2[1])
  document.getElementById("timerd").textContent = data.time;

  if(data.cheyyo != 0){
    if (data.cheyyoPlayed == 0){
      if(data.cheyyo == 1){
        openModal('/public/Cheyyo/red.PNG')
      } else if (data.cheyyo==2){
        openModal('/public/Cheyyo/blue.PNG')
      }
    }
  }
  if(data.bg_hidden == true){
    openOverlay(data.time);
  } else{
    closeOverlay();
  }
}

function openModal(imgSrc) {
  const modal = document.getElementById('modal');
  const imgElement = modal.querySelector('img');

  // Update the image source
  imgElement.src = imgSrc;

  // Show the modal
  modal.classList.remove('hidden');

  // Set a timeout to close the modal after 3 seconds
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 3000);
}

function openOverlay(text) {
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  overlayText.innerText = text;
  overlay.style.display = 'flex';
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
}