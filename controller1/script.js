document.addEventListener('DOMContentLoaded', function () {
  const startGameButton = document.getElementById('start-game-button')
  const timerDisplay = document.querySelector('.countdown-timer')
  const gameNumberDisplay = document.getElementById('game-number')
  const prevButton = document.getElementById('game-prev')
  const nextButton = document.getElementById('game-next')
  const battingButton = document.getElementById('batting-button')
  const resetAllButton = document.getElementById('reset-all-button')

  // Planting Score
  const plantingPlusTeam1Button = document.getElementById('planting-plus-team1')
  const plantingPlusTeam2Button = document.getElementById('planting-plus-team2')
  const plantingMinusTeam1Button = document.getElementById('planting-minus-team1')
  const plantingMinusTeam2Button = document.getElementById('planting-minus-team2')
  const plantingScoreTeam1Display = document.getElementById('planting-score-team1')
  const plantingScoreTeam2Display = document.getElementById('planting-score-team2')

  // Total Team Score
  const totalScoreTeam1Display = document.getElementById('total-score-team1')
  const totalScoreTeam2Display = document.getElementById('total-score-team2')

  // Harvesting Score
  const harvestingPlusTeam1Button = document.getElementById('harvesting-plus-team1')
  const harvestingPlusTeam2Button = document.getElementById('harvesting-plus-team2')
  const harvestingMinusTeam1Button = document.getElementById('harvesting-minus-team1')
  const harvestingMinusTeam2Button = document.getElementById('harvesting-minus-team2')
  const harvestingScoreTeam1Display = document.getElementById('harvesting-score-team1')
  const harvestingScoreTeam2Display = document.getElementById('harvesting-score-team2')

  let gameNumber = 1
  let gameCountdownInterval
  let battingCountdownInterval
  let plantingScoreTeam1 = 0
  let plantingScoreTeam2 = 0
  let harvestingScoreTeam1 = 0
  let harvestingScoreTeam2 = 0
  let totalScoreTeam1 = 0
  let totalScoreTeam2 = 0
  let displayText = document.getElementById('displayText')

  function updateGameNumberDisplay() {
    gameNumberDisplay.textContent = `Game ${gameNumber}`
  }

  prevButton.addEventListener('click', function () {
    if (gameNumber > 1) {
      gameNumber--
      updateGameNumberDisplay()
    }
  })

  nextButton.addEventListener('click', function () {
    gameNumber++
    updateGameNumberDisplay()
  })

  startGameButton.addEventListener('click', function () {
    displayText.style.color = 'red'

    setTimeout(function () {
      displayText.style.color = 'black'
    }, 3000) // 3000 milliseconds = 3 seconds
    startCountdown(3)
  })

  battingButton.addEventListener('click', function () {
    startBattingCountdown(60)
  })

  resetAllButton.addEventListener('click', function () {
    resetAll()
  })

  // Planting
  plantingPlusTeam1Button.addEventListener('click', function () {
    incrementPlantingScore(1)
  })

  plantingPlusTeam2Button.addEventListener('click', function () {
    incrementPlantingScore(2)
  })

  plantingMinusTeam1Button.addEventListener('click', function () {
    decrementPlantingScore(1)
  })

  plantingMinusTeam2Button.addEventListener('click', function () {
    decrementPlantingScore(2)
  })

  // Harvesting
  harvestingPlusTeam1Button.addEventListener('click', function () {
    incrementHarvestingScore(1)
  })

  harvestingPlusTeam2Button.addEventListener('click', function () {
    incrementHarvestingScore(2)
  })

  harvestingMinusTeam1Button.addEventListener('click', function () {
    decrementHarvestingScore(1)
  })

  harvestingMinusTeam2Button.addEventListener('click', function () {
    decrementHarvestingScore(2)
  })

  function startCountdown(seconds) {
    timerDisplay.textContent = seconds

    const countdownInterval = setInterval(() => {
      if (seconds <= 1) {
        clearInterval(countdownInterval)
        timerDisplay.textContent = '180'
        startGame(gameNumber)
      } else {
        seconds--
        timerDisplay.textContent = seconds
      }
    }, 1000)
  }

  function startBattingCountdown(seconds) {
    clearInterval(gameCountdownInterval) // Pause the game countdown
    timerDisplay.textContent = seconds

    battingCountdownInterval = setInterval(() => {
      if (seconds <= 0) {
        clearInterval(battingCountdownInterval)
        timerDisplay.textContent = '---'
        startGameDurationCountdown(gameNumber, remainingTime) // Resume the game countdown
      } else {
        seconds--
        timerDisplay.textContent = seconds
      }
    }, 1000)
  }

  function resetAll() {
    clearInterval(gameCountdownInterval)
    clearInterval(battingCountdownInterval)
    timerDisplay.textContent = '---'
    plantingScoreTeam1 = 0
    plantingScoreTeam2 = 0
    harvestingScoreTeam1 = 0
    harvestingScoreTeam2 = 0
    totalScoreTeam1 = 0
    totalScoreTeam2 = 0
    updateScoreDisplays()
    // Reset other game elements as needed
  }

  function startGame(gameNumber) {
    console.log(`Starting Game ${gameNumber}`)

    switch (gameNumber) {
      case 1:
        startGame1()
        break
      case 2:
        startGame2()
        break
      case 3:
        startGame3()
        break
      // Add more cases for additional games
      default:
        console.log('Unknown game number')
    }
  }
  function startGameDurationCountdown(seconds) {
    let remainingTime = seconds

    gameCountdownInterval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(gameCountdownInterval)
        console.log("Time's up!")
        timerDisplay.textContent = '---'
        // Handle the end of the game
      } else {
        remainingTime--
        updateTimerDisplay(timerDisplay, remainingTime)
      }
    }, 1000)
  }

  function updateTimerDisplay(timerDisplay, time) {
    timerDisplay.textContent = time
  }

  function incrementPlantingScore(team) {
    if (team === 1) {
      plantingScoreTeam1 += 1
      totalScoreTeam1 += 10
    } else if (team === 2) {
      plantingScoreTeam2 += 1
      totalScoreTeam2 += 10
    }
    updateScoreDisplays()
  }

  function decrementPlantingScore(team) {
    if (team === 1) {
      plantingScoreTeam1 = Math.max(plantingScoreTeam1 - 1, 0)
      totalScoreTeam1 = Math.max(totalScoreTeam1 - 10, 0)
    } else if (team === 2) {
      plantingScoreTeam2 = Math.max(plantingScoreTeam2 - 1, 0)
      totalScoreTeam2 = Math.max(totalScoreTeam2 - 10, 0)
    }
    updateScoreDisplays()
  }

  function incrementHarvestingScore(team) {
    if (team === 1) {
      harvestingScoreTeam1 += 1
      totalScoreTeam1 += 10
    } else if (team === 2) {
      harvestingScoreTeam2 += 1
      totalScoreTeam2 += 10
    }
    updateScoreDisplays()
  }

  function decrementHarvestingScore(team) {
    if (team === 1) {
      harvestingScoreTeam1 = Math.max(harvestingScoreTeam1 - 1, 0)
      totalScoreTeam1 = Math.max(totalScoreTeam1 - 10, 0)
    } else if (team === 2) {
      harvestingScoreTeam2 = Math.max(harvestingScoreTeam2 - 1, 0)
      totalScoreTeam2 = Math.max(totalScoreTeam2 - 10, 0)
    }
    updateScoreDisplays()
  }

  function updateScoreDisplays() {
    plantingScoreTeam1Display.textContent = plantingScoreTeam1
    plantingScoreTeam2Display.textContent = plantingScoreTeam2
    totalScoreTeam1Display.textContent = totalScoreTeam1
    totalScoreTeam2Display.textContent = totalScoreTeam2
    harvestingScoreTeam1Display.textContent = harvestingScoreTeam1
    harvestingScoreTeam2Display.textContent = harvestingScoreTeam2
  }

  // Initialize the game number display
  updateGameNumberDisplay()

  // Initialize score displays
  updateScoreDisplays()
})

document.querySelectorAll('.color-button').forEach((button) => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color')
    const circles = button.closest('.flex-col').querySelectorAll('.circle')
    for (let i = circles.length - 1; i >= 0; i--) {
      if (!circles[i].style.backgroundColor) {
        circles[i].style.backgroundColor = color
        checkResetButtonState()
        break
      }
    }
  })
})

document.querySelectorAll('.reset-button').forEach((button) => {
  button.addEventListener('click', () => {
    const circle = button.previousElementSibling
    circle.style.backgroundColor = ''
    checkResetButtonState()
  })
})

function checkResetButtonState() {
  document.querySelectorAll('.reset-button').forEach((button) => {
    const circle = button.previousElementSibling
    if (circle.style.backgroundColor) {
      button.disabled = false
      button.classList.remove('text-gray-500')
      button.classList.add('text-gray-900')
    } else {
      button.disabled = true
      button.classList.remove('text-gray-900')
      button.classList.add('text-gray-500')
    }
  })
}

// Initial check to disable/enable reset buttons based on initial state
checkResetButtonState()