let shuffledNumbers, currentNumber, startTime, timerInterval;
let placedPositions = []; // Track all placed positions to avoid overlap
let lives = 3; // Player starts with 3 lives
let wrongGuesses = 0; // Track wrong guesses

const gameArea = document.getElementById('gameArea');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const currentNumberDisplay = document.getElementById('currentNumberDisplay');
const printButton = document.getElementById('printButton');
const shareButton = document.getElementById('shareButton');
const heartIcons = document.getElementById('heartIcons');
const gameOverPopup = document.getElementById('gameOverPopup');
const tryAgainButton = document.getElementById('tryAgainButton');

function startGame() {
    const playerName = localStorage.getItem('playerName');
    const useBackgroundColor = JSON.parse(localStorage.getItem('useBackgroundColor'));
    const totalNumbers = parseInt(localStorage.getItem('numberInput'));

    // Greet the player
    document.getElementById('greeting').textContent = `Hello, ${playerName}!`;

    if (useBackgroundColor) {
        // Apply random background color and set contrasting number colors
        const randomBackgroundColor = getRandomColor();
        gameArea.style.backgroundColor = randomBackgroundColor;

        // Set number color to contrast with background color
        const contrastingColor = getContrastingColor(randomBackgroundColor);
        setNumberColor(contrastingColor);
    } else {
        // Apply white background and set numbers to black
        gameArea.style.backgroundColor = 'white';
        setNumberColor('black');
    }

    shuffledNumbers = shuffleArray([...Array(totalNumbers).keys()].map(i => i + 1)); // Shuffle numbers
    gameArea.innerHTML = ''; // Clear previous numbers
    currentNumber = 1; // Start from 1
    startTime = Date.now();
    scoreElement.textContent = '';
    placedPositions = []; // Reset placed positions
    wrongGuesses = 0; // Reset wrong guesses
    lives = 3; // Reset lives
    heartIcons.innerHTML = '❤️❤️❤️'; // Reset heart icons

    // Hide the game over popup if visible
    gameOverPopup.classList.add('hidden');

    // Display the current number to pick
    updateCurrentNumberDisplay();

    // Display shuffled numbers in non-overlapping random positions
    shuffledNumbers.forEach(number => {
        const div = document.createElement('div');
        div.className = 'number';
        div.textContent = number;

        // Apply random font size between 16px and 30px
        const randomFontSize = Math.floor(Math.random() * 15) + 16; // Random size between 16 and 30
        div.style.fontSize = randomFontSize + 'px';

        gameArea.appendChild(div); // Temporarily add the element to get its size

        let position = getRandomNonOverlappingPosition(div);

        div.style.left = position.x + 'px';  // Set horizontal position
        div.style.top = position.y + 'px';   // Set vertical position

        // Apply random rotation between 0 and 360 degrees
        const randomRotation = getRandomRotation();
        div.style.transform = `rotate(${randomRotation}deg)`;

        div.addEventListener('click', () => checkNumber(div, number));
    });

    startTimer();

    // Show the print and share buttons after the game starts
    printButton.style.display = 'block';
    shareButton.style.display = 'block';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkNumber(element, number) {
    if (number === currentNumber) {
        element.style.visibility = 'hidden'; // Hide the clicked number
        currentNumber++;
        if (currentNumber > shuffledNumbers.length) {
            endGame();
        } else {
            updateCurrentNumberDisplay(); // Update the display to the next number
        }
    } else {
        handleWrongGuess(); // Handle wrong guess
    }
}

function handleWrongGuess() {
    if (lives > 0) {
        wrongGuesses++;
        lives--;
        heartIcons.innerHTML = '❤️'.repeat(lives); // Update heart icons

        if (lives === 0) {
            showGameOver(); // Trigger game over when wrong guesses reach 3
        }
    }
}

function updateCurrentNumberDisplay() {
    currentNumberDisplay.textContent = `Current Number: ${currentNumber}`;
}

function startTimer() {
    timerElement.textContent = 'Time: 0 seconds';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Time: ${elapsedTime} seconds`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const playerName = localStorage.getItem('playerName');
    const totalNumbers = shuffledNumbers.length;

    scoreElement.textContent = `Great job, ${playerName}! Your time: ${elapsedTime} seconds.`;

    // Save the player's score and name to localStorage for sharing
    localStorage.setItem('sharePlayerName', playerName);
    localStorage.setItem('shareTotalNumbers', totalNumbers);
    localStorage.setItem('shareElapsedTime', elapsedTime);

    // Show the print and share buttons after the game ends
    printButton.style.display = 'block';
    shareButton.style.display = 'block';
}

function showGameOver() {
    clearInterval(timerInterval); // Stop the timer
    console.log("Game Over triggered"); // Debug line
    // Remove the 'hidden' class from the game over popup to make it visible
    gameOverPopup.classList.remove('hidden'); 

    // Alternatively, set the display style directly
    gameOverPopup.style.display = 'block'; 
}

function resetGame() {
    startGame(); // Restart the game
}

// Set the color of the numbers
function setNumberColor(color) {
    document.querySelectorAll('.number').forEach(numberElement => {
        numberElement.style.color = color; // Set text color
    });
}

// Get a random non-overlapping position
function getRandomNonOverlappingPosition(element) {
    let x, y, overlap;
    const maxAttempts = 100;
    let attempts = 0;

    const padding = 10; // Add extra space between elements
    const elementWidth = element.offsetWidth + padding;
    const elementHeight = element.offsetHeight + padding;

    do {
        x = Math.random() * (gameArea.clientWidth - elementWidth);
        y = Math.random() * (gameArea.clientHeight - elementHeight);
        overlap = checkOverlap(x, y, elementWidth, elementHeight);
        attempts++;
    } while (overlap && attempts < maxAttempts);

    placedPositions.push({ x, y, width: elementWidth, height: elementHeight });
    return { x, y };
}

// Check if the new element overlaps with existing ones
function checkOverlap(x, y, width, height) {
    for (let pos of placedPositions) {
        if (
            x < pos.x + pos.width &&
            x + width > pos.x &&
            y < pos.y + pos.height &&
            y + height > pos.y
        ) {
            return true;
        }
    }
    return false;
}

// Get a random rotation angle between 0 and 360 degrees
function getRandomRotation() {
    return Math.floor(Math.random() * 361); // Random angle between 0 and 360
}

// Get a random color (background color)
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Get contrasting color (either black or white)
function getContrastingColor(hexColor) {
    // Convert hex to RGB
    const rgb = hexToRgb(hexColor);

    // Calculate luminance to determine if background is light or dark
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // If luminance is more than 0.5, it's a light background, so return black. Otherwise, return white.
    return luminance > 0.5 ? 'black' : 'white';
}

// Convert hex color to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Start the game when the page loads
window.onload = startGame;

// Handle try again button click
tryAgainButton.addEventListener('click', resetGame);
