document.getElementById('startButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    const numberInput = document.getElementById('numberInput').value;
    const useBackgroundColor = document.getElementById('useBackgroundColor').checked;

    if (playerName === '') {
        alert('Please enter your name.');
        return;
    }

    // Save the settings to localStorage
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('numberInput', numberInput);
    localStorage.setItem('useBackgroundColor', useBackgroundColor);

    // Redirect to the game page
    window.location.href = 'game.html';
});
