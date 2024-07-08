let team1TotalScore = 0
let team2TotalScore = 0
const colorPoints = {
  none: 0,
  red: 30,
  blue: 30,
}

// Scores for planting and harvesting
let plantingTeam1Score = 0
let plantingTeam2Score = 0
let harvestingTeam1Score = 0
let harvestingTeam2Score = 0
const socket = new WebSocket('ws://192.168.0.140:8834')

socket.addEventListener('open', function (event) {
  console.log('WebSocket is connected.')
})

socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data)
})

function sendData(team, area, index) {
  const data = {
    team: team,
    area: area,
    index: index,
  }

  socket.send(JSON.stringify(data))
  console.log('Sent:', data)
}

document.getElementById('planting-minus-team1').addEventListener('click', function () {
  sendData(1, 1, 0)
})
document.getElementById('planting-plus-team1').addEventListener('click', function () {
  sendData(1, 1, 1)
})
document.getElementById('planting-minus-team2').addEventListener('click', function () {
  sendData(2, 1, 0)
})
document.getElementById('planting-plus-team2').addEventListener('click', function () {
  sendData(2, 1, 1)
})

document.getElementById('harvesting-minus-team1').addEventListener('click', function () {
  sendData(1, 2, 0)
})
document.getElementById('harvesting-plus-team1').addEventListener('click', function () {
  sendData(1, 2, 1)
})
document.getElementById('harvesting-minus-team2').addEventListener('click', function () {
  sendData(2, 2, 0)
})
document.getElementById('harvesting-plus-team2').addEventListener('click', function () {
  sendData(2, 2, 1)
})

for (let i = 1; i <= 5; i++) {
  document.getElementById(`r${i}`).addEventListener('click', function () {
    sendData(1, 3, i - 1)
  })
  document.getElementById(`b${i}`).addEventListener('click', function () {
    sendData(2, 3, i - 1)
  })
}

function changeColor(columnId, color) {
  const column = document.getElementById(columnId)
  const circles = column.getElementsByClassName('circle')

  for (let i = circles.length - 1; i >= 0; i--) {
    // From bottom to top
    const circle = circles[i]
    if (circle.dataset.color === 'none') {
      updateCircle(circle, color)
      break
    }
  }
}

function updateCircle(circle, color) {
  const currentColor = circle.dataset.color
  const points = colorPoints[color]
  const currentPoints = colorPoints[currentColor]

  // Update circle properties
  circle.dataset.color = color
  circle.dataset.points = points
  circle.style.backgroundColor = color

  // Update team scores
  if (currentColor === 'red') {
    team1TotalScore -= currentPoints
  } else if (currentColor === 'blue') {
    team2TotalScore -= currentPoints
  }

  if (color === 'red') {
    team1TotalScore += points
  } else if (color === 'blue') {
    team2TotalScore += points
  }

  updateScores()
}

function undoColor(circleId) {
  const circle = document.getElementById(circleId)
  const currentColor = circle.dataset.color
  const points = colorPoints[currentColor]

  if (currentColor === 'red') {
    team1TotalScore -= points
  } else if (currentColor === 'blue') {
    team2TotalScore -= points
  }

  // Reset circle properties
  circle.dataset.color = 'none'
  circle.dataset.points = 0
  circle.style.backgroundColor = '#eee'

  updateScores()
}

function updateScores() {
  const totalTeam1Score = team1TotalScore + plantingTeam1Score * 10 + harvestingTeam1Score * 10
  const totalTeam2Score = team2TotalScore + plantingTeam2Score * 10 + harvestingTeam2Score * 10

  document.getElementById('red-score').innerText = totalTeam1Score
  document.getElementById('blue-score').innerText = totalTeam2Score
  localStorage.setItem('team1TotalScore', totalTeam1Score)
  localStorage.setItem('team2TotalScore', totalTeam2Score)
}

document.addEventListener('DOMContentLoaded', function () {
  // Harvesting Points
  document.getElementById('harvesting-minus-team1').addEventListener('click', function () {
    if (harvestingTeam1Score > 0) harvestingTeam1Score--
    updateScore('harvesting-score-team1', harvestingTeam1Score)
    updateScores()
  })

  document.getElementById('harvesting-plus-team1').addEventListener('click', function () {
    harvestingTeam1Score++
    updateScore('harvesting-score-team1', harvestingTeam1Score)
    updateScores()
  })

  document.getElementById('harvesting-minus-team2').addEventListener('click', function () {
    if (harvestingTeam2Score > 0) harvestingTeam2Score--
    updateScore('harvesting-score-team2', harvestingTeam2Score)
    updateScores()
  })

  document.getElementById('harvesting-plus-team2').addEventListener('click', function () {
    harvestingTeam2Score++
    updateScore('harvesting-score-team2', harvestingTeam2Score)
    updateScores()
  })

  // Planting Points
  document.getElementById('planting-minus-team1').addEventListener('click', function () {
    if (plantingTeam1Score > 0) plantingTeam1Score--
    updateScore('planting-score-team1', plantingTeam1Score)
    updateScores()
  })

  document.getElementById('planting-plus-team1').addEventListener('click', function () {
    plantingTeam1Score++
    updateScore('planting-score-team1', plantingTeam1Score)
    updateScores()
  })

  document.getElementById('planting-minus-team2').addEventListener('click', function () {
    if (plantingTeam2Score > 0) plantingTeam2Score--
    updateScore('planting-score-team2', plantingTeam2Score)
    updateScores()
  })

  document.getElementById('planting-plus-team2').addEventListener('click', function () {
    plantingTeam2Score++
    updateScore('planting-score-team2', plantingTeam2Score)
    updateScores()
  })

  function updateScore(elementId, score) {
    document.getElementById(elementId).textContent = score
  }

  updateScores()
})

socket.addEventListener('error', function (event) {
  console.error('WebSocket error observed:', event)
})

socket.addEventListener('close', function (event) {
  console.log('WebSocket is closed now.')
})
