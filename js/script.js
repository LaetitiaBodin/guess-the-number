// Default values.
let randomNumber;
let tries;
let guesses;
let chances;
let chancesLeft;
let maxNumber;
// A numeral value is needed (which will be incremented with each victory / loss). 
let rWon = 0;
let rLost = 0;

function setUp () {
    playGround.style.display = `none`;
    gameOver.style.display = `none`;
    addLevelChoice();
    // Starting values, they will be updated later on.
    tries = 0;
    guesses = [];
}

// Only available on setup.
function addLevelChoice () {
    levelChoice.style.display = `block`;
    // The player chooses a difficulty level. Default values will be updated accordingly.
    levelChoice.innerHTML = `
    <p>Please chose a level</p>
    <button onclick="choseLevel('easy');">Easy</button>
    <button onclick="choseLevel('medium');">Medium</button>
    <button onclick="choseLevel('hard');">Hard</button>`;
}

function choseLevel (level) {
    // Sets the playing values according the player's chosen difficulty level.
    levelChoice.style.display = `none`;
    chances = 20;
    chancesLeft = chances;
    if (level == `easy`) {
        maxNumber = 50;
    } else if (level == `medium`) {
        maxNumber = 100;
    } else if (level == `hard`) {
        maxNumber = 150;
    }
    // Picks a random number between 0 and maxNumber included.
    randomNumber = Math.floor(Math.random() * (maxNumber + 1));
    addPlayground();
}

function addPlayground () {
    // Setup values are taken in.
    // Playground is made visible so that the player can play.
    playGround.style.display = `block`;
    playGround.innerHTML = `
    <div>
        <div id="scores"><p>Rounds won: ${rWon}<br>Rounds lost: ${rLost}</p></div>
        <img src="img/icon.svg" alt="crystal ball" class="my-2 w-100">
    </div>
    <div id="dynamicDiv">
        <label for="guessedNumber">I see... </label>
        <input type="number" id="guessedNumber" min="0" max="${maxNumber}">
        <button onclick="check();">Am I right?</button>
        <p>Chances left: ${chancesLeft}</p>
    </div>`;
}

// Function triggered when the player clicks on "Am I right?".
function check () {
    tries += 1;
    chancesLeft -= 1;
    numberCorrection();
    addGuesses();
}

function numberCorrection () {
    // Checks if the given number is an integer between 0 and the maxNumber (depending on the chosen level).
    // If not, changes the value so that it obeys the game's rules.
    let guessedNumber = Math.round(document.getElementById(`guessedNumber`).value);
    if (guessedNumber < 0 || guessedNumber == -0) {
        guessedNumber = 0;
    } else if (guessedNumber > maxNumber) {
        guessedNumber = maxNumber;
    }
    guesses.push(guessedNumber);
}

function addGuesses () {
    dynamicDiv.innerHTML = ``;
    let foundNumber = ``;
    // The given number obeys the game's rules.
    for (let i = 0; i < guesses.length; i ++) {
        // A message is given onscreen to tell whether the secret number has been found or not.
        let createP = document.createElement(`p`);
        dynamicDiv.appendChild(createP);
        if (guesses[i] == randomNumber) {
            foundNumber = `Yes`;
            createP.innerText = `${guesses[i]}? — Yes, I found it!`;
        // The secret number has not been found. A tip is given.
        } else if (guesses[i] != randomNumber) {
            foundNumber = `No`;
            if (guesses[i] < randomNumber) {
                createP.innerText = `${guesses[i]}? — Nope, it's more!`;
            } else if (guesses[i] > randomNumber) {
                createP.innerText = `${guesses[i]}? — Nope, it's less!`;
            }
        }        
    }
    let createDiv = document.createElement(`div`);
    dynamicDiv.appendChild(createDiv);
    if (foundNumber == `Yes`) {
        // Updates the scores.
        rWon += 1;
        scores.innerHTML = `<p>Rounds won: ${rWon}<br>Rounds lost: ${rLost}</p>`;
        // The secret number has been found. The game ends, the player wins.
        createDiv.innerHTML = `
        <p>I knew it!</p>
        <div>
            <p>New round?</p>
            <button onclick="newRound();">Yes!</button>
            <button onclick="endGame();">No.</button>
        </div>`;
    } else if (foundNumber == `No`) {
        if (guesses.length < chances) {
            // The secret number has not been found. The game continues, the player is given another chance.
            createDiv.innerHTML = `
            <label for="guessedNumber">I see... </label>
            <input type="number" id="guessedNumber" min="0" max="${maxNumber}">
            <button onclick="check();">Am I right?</button>
            <p>Chances left: ${chancesLeft}</p>`;
        } else if (guesses.length == chances) {
            // Updates the scores.
            rLost += 1;
            scores.innerHTML = `<p>Rounds won: ${rWon}<br>Rounds lost: ${rLost}</p>`;
            // The secret number has not been found. The game ends, the player loses.
            createDiv.innerHTML = `
            <p>No more tries!</p>
            <div>
                <p>New round?</p>
                <button onclick="newRound();">Yes!</button>
                <button onclick="endGame();">No.</button>
            </div>`;
        }
    }
}

// Only available if at least one round has been played.
function newRound () {
    // Resets the playing area but keeps the scores.
    setUp();
}

// The player does not want another round. The game ends. The final scores are given.
function endGame () {
    playGround.innerHTML = ``;
    playGround.style.display = `none`;
    gameOver.style.display = `block`;
    gameOver.innerHTML = `
    <h1>Game Over</h1>
    <h2>Final scores:</h2>
    <p>Rounds won: ${rWon}<br>Rounds lost: ${rLost}</p>`;
}