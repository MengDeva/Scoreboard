function updateTimerDisplay(timerId) {
  let timeLeft = parseInt(localStorage.getItem('timer' + timerId + 'TimeLeft'), 10)
  let duration = timerId === 1 ? 10 : 180
  let percentage = ((duration - timeLeft) / duration) * 100
  let minutes = Math.floor(timeLeft / 60)
  let seconds = timeLeft % 60
  document.getElementById('timer' + timerId + '-display').style.setProperty('--percentage', percentage + '%')
  document.querySelector('#timer' + timerId + '-display .timer-inner').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`

  if (timerId === 1 && localStorage.getItem('overlayVisible') === 'true') {
    document.getElementById('overlay-time').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    document.getElementById('overlay').classList.remove('hidden')
  }
}

function checkTimerStatus(timerId) {
  if (localStorage.getItem('timer' + timerId + 'Running') === 'true') {
    startDisplayTimer(timerId)
  } else {
    stopDisplayTimer(timerId)
    if (timerId === 1 && localStorage.getItem('overlayVisible') !== 'true') {
      document.getElementById('overlay').classList.add('hidden')
    }
  }
}

function startDisplayTimer(timerId) {
  if (displayTimers[timerId]) clearInterval(displayTimers[timerId])
  displayTimers[timerId] = setInterval(() => {
    updateTimerDisplay(timerId)
  }, 1000)
}

function stopDisplayTimer(timerId) {
  if (displayTimers[timerId]) clearInterval(displayTimers[timerId])
}

function closeOverlay() {
  localStorage.setItem('timer1TimeLeft', 10)
  localStorage.setItem('timer1Running', 'false')
  localStorage.setItem('overlayVisible', 'false')
  updateTimerDisplay(1)

  document.getElementById('overlay').classList.add('hidden')

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'timer1TimeLeft',
      newValue: '60',
    })
  )
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'timer1Running',
      newValue: 'false',
    })
  )
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'overlayVisible',
      newValue: 'false',
    })
  )
}

window.addEventListener('storage', (event) => {
  if (event.key.startsWith('timer') && event.key.endsWith('TimeLeft')) {
    let timerId = parseInt(event.key.match(/\d+/)[0], 10)
    updateTimerDisplay(timerId)
  }
  if (event.key.startsWith('timer') && event.key.endsWith('Running')) {
    let timerId = parseInt(event.key.match(/\d+/)[0], 10)
    checkTimerStatus(timerId)
  }
  if (event.key === 'overlayVisible') {
    if (localStorage.getItem('overlayVisible') === 'true') {
      document.getElementById('overlay').classList.remove('hidden')
    } else {
      document.getElementById('overlay').classList.add('hidden')
    }
  }
})

window.onload = function () {
  ;[1, 2].forEach((timerId) => {
    updateTimerDisplay(timerId)
    checkTimerStatus(timerId)
  })
}
