function updateDisplay() {
  // Update team scores
  document.getElementById('score1-display').innerText = localStorage.getItem('score1') || '0'
  document.getElementById('score2-display').innerText = localStorage.getItem('score2') || '0'

  // Update individual color scores for Team A
  document.getElementById('score1green-display').innerText = localStorage.getItem('score1green') || '0'
  document.getElementById('score1purple-display').innerText = localStorage.getItem('score1purple') || '0'
  document.getElementById('score1yellow-display').innerText = localStorage.getItem('score1yellow') || '0'
  document.getElementById('score1blue-display').innerText = localStorage.getItem('score1blue') || '0'

  // Update individual color scores for Team B
  document.getElementById('score2green-display').innerText = localStorage.getItem('score2green') || '0'
  document.getElementById('score2purple-display').innerText = localStorage.getItem('score2purple') || '0'
  document.getElementById('score2yellow-display').innerText = localStorage.getItem('score2yellow') || '0'
  document.getElementById('score2blue-display').innerText = localStorage.getItem('score2blue') || '0'

  // Update timer display
  document.getElementById('timer-display').innerText = localStorage.getItem('timer') || '30:00'
}

// Update the display every second
setInterval(updateDisplay, 1000)

// Initial update when the page loads
document.addEventListener('DOMContentLoaded', updateDisplay)
