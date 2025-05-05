// Store word-definition pairs
let wordPairs = [];
let currentMatches = new Map();
let availableDefinitions = new Set();

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for the game card
    const gameCard = document.getElementById('word-game-card');
    const openGameBtn = document.getElementById('open-game');
    const gameContainer = document.getElementById('game-container');

    openGameBtn.addEventListener('click', () => {
        gameContainer.classList.remove('hidden');
        // Initialize with 3 default input pairs
        for (let i = 0; i < 3; i++) {
            addInputPair();
        }
    });

    // Add close button functionality
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-game';
    closeBtn.className = 'btn btn-outline';
    closeBtn.innerHTML = '<i class="bi bi-x-lg"></i> Close';
    closeBtn.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        newWordSet(); // Reset the game state
    });
    gameContainer.appendChild(closeBtn);

    // Add new input pair
    document.getElementById('add-pair').addEventListener('click', addInputPair);

    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

    // Restart game button
    document.getElementById('restart-game').addEventListener('click', restartGame);

    // New word set button
    document.getElementById('new-word-set').addEventListener('click', newWordSet);

    // Check answers button
    document.getElementById('check-answers').addEventListener('click', checkAnswers);
});

function addInputPair() {
    const container = document.getElementById('input-container');
    const pairDiv = document.createElement('div');
    pairDiv.className = 'word-pair';
    pairDiv.innerHTML = `
        <input type="text" placeholder="Enter word" class="word-input">
        <input type="text" placeholder="Enter definition" class="definition-input">
    `;
    container.appendChild(pairDiv);
}

function startGame() {
    // Collect all word-definition pairs
    wordPairs = [];
    const pairs = document.querySelectorAll('.word-pair');
    pairs.forEach(pair => {
        const word = pair.querySelector('.word-input').value.trim();
        const definition = pair.querySelector('.definition-input').value.trim();
        if (word && definition) {
            wordPairs.push({ word, definition });
        }
    });

    if (wordPairs.length < 2) {
        alert('Please enter at least 2 word-definition pairs');
        return;
    }

    // Save to local storage
    localStorage.setItem('wordPairs', JSON.stringify(wordPairs));

    // Hide input container and show game container
    const inputCard = document.getElementById('game-container').querySelector('.card');
    const gameArea = document.getElementById('game-area');
    
    // Immediately hide the input card
    inputCard.style.display = 'none';
    
    // Show the game area
    gameArea.classList.add('visible');
    gameArea.style.display = 'block';

    // Clear any previous result
    document.getElementById('result').textContent = '';

    // Initialize game
    initializeGame();
}

function restartGame() {
    // Clear current matches
    currentMatches.clear();
    availableDefinitions.clear();
    
    // Clear result text
    document.getElementById('result').textContent = '';
    
    // Reinitialize the game
    initializeGame();
}

function newWordSet() {
    // Clear local storage
    localStorage.removeItem('wordPairs');
    
    // Reset the game state
    wordPairs = [];
    currentMatches.clear();
    availableDefinitions.clear();
    
    // Clear result text
    document.getElementById('result').textContent = '';
    
    // Show input container and hide game container
    const inputCard = document.getElementById('game-container').querySelector('.card');
    const gameArea = document.getElementById('game-area');
    
    // Hide game area
    gameArea.classList.remove('visible');
    gameArea.style.display = 'none';
    
    // Show input card
    inputCard.style.display = 'block';
    
    // Clear input container
    const inputContainer = document.getElementById('input-container');
    inputContainer.innerHTML = '';
    
    // Add 3 default input pairs
    for (let i = 0; i < 3; i++) {
        addInputPair();
    }
}

function initializeGame() {
    const wordsContainer = document.getElementById('words-container');
    const matchesContainer = document.getElementById('matches-container');
    const definitionsContainer = document.getElementById('definitions-container');
    
    // Clear previous content
    wordsContainer.innerHTML = '';
    matchesContainer.innerHTML = '';
    definitionsContainer.innerHTML = '';
    
    // Add the "Definitions" header
    const definitionsHeader = document.createElement('h3');
    definitionsHeader.textContent = 'Definitions';
    definitionsContainer.appendChild(definitionsHeader);

    // Shuffle words and definitions
    const shuffledWords = [...wordPairs].sort(() => Math.random() - 0.5);
    const shuffledDefinitions = [...wordPairs].sort(() => Math.random() - 0.5);

    // Create word boxes and empty match boxes
    shuffledWords.forEach((pair, index) => {
        // Word box
        const wordBox = document.createElement('div');
        wordBox.className = 'word-box';
        wordBox.textContent = pair.word;
        wordBox.dataset.word = pair.word;
        wordBox.dataset.index = index;
        wordsContainer.appendChild(wordBox);

        // Empty match box
        const matchBox = document.createElement('div');
        matchBox.className = 'match-box';
        matchBox.dataset.word = pair.word;
        matchBox.dataset.index = index;
        matchesContainer.appendChild(matchBox);

        // Add drop event listeners to match boxes
        matchBox.addEventListener('dragover', handleDragOver);
        matchBox.addEventListener('drop', handleDrop);
        matchBox.addEventListener('dragenter', handleDragEnter);
        matchBox.addEventListener('dragleave', handleDragLeave);
    });

    // Create definition boxes
    shuffledDefinitions.forEach((pair, index) => {
        const definitionBox = document.createElement('div');
        definitionBox.className = 'definition-box';
        definitionBox.textContent = pair.definition;
        definitionBox.draggable = true;
        definitionBox.dataset.definition = pair.definition;
        definitionBox.dataset.index = index;
        definitionsContainer.appendChild(definitionBox);

        // Add drag event listeners to definition boxes
        definitionBox.addEventListener('dragstart', handleDragStart);
        
        // Add to available definitions
        availableDefinitions.add(pair.definition);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.definition);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('highlight');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.target.classList.remove('highlight');
}

function handleDrop(e) {
    e.preventDefault();
    const definition = e.dataTransfer.getData('text/plain');
    const word = e.target.dataset.word;
    const draggedElement = document.querySelector('.dragging');
    
    // Remove highlight class
    e.target.classList.remove('highlight');
    
    // If dropping on a match box
    if (e.target.classList.contains('match-box')) {
        // If the dragged element is from the definitions bank
        if (draggedElement && draggedElement.parentElement.id === 'definitions-container') {
            // If target box is empty
            if (!e.target.textContent) {
                e.target.textContent = definition;
                e.target.draggable = true;
                e.target.dataset.definition = definition;
                currentMatches.set(word, definition);
                draggedElement.remove();
                availableDefinitions.delete(definition);
            } else {
                // If target box has content, swap with definition bank
                const oldDefinition = e.target.textContent;
                e.target.textContent = definition;
                e.target.dataset.definition = definition;
                currentMatches.set(word, definition);
                
                // Update the dragged element with the old definition
                draggedElement.textContent = oldDefinition;
                draggedElement.dataset.definition = oldDefinition;
            }
        } 
        // If the dragged element is from another match box
        else if (draggedElement && draggedElement.classList.contains('match-box')) {
            const sourceWord = draggedElement.dataset.word;
            const sourceDefinition = draggedElement.dataset.definition;
            const targetDefinition = e.target.dataset.definition;
            
            // Swap contents
            const tempText = e.target.textContent;
            e.target.textContent = draggedElement.textContent;
            draggedElement.textContent = tempText;
            
            // Swap dataset attributes
            e.target.dataset.definition = sourceDefinition;
            draggedElement.dataset.definition = targetDefinition;
            
            // Update currentMatches
            if (sourceDefinition) {
                currentMatches.set(word, sourceDefinition);
            } else {
                currentMatches.delete(word);
            }
            if (targetDefinition) {
                currentMatches.set(sourceWord, targetDefinition);
            } else {
                currentMatches.delete(sourceWord);
            }
        }
        
        // Reattach drag event listeners to the target box
        e.target.draggable = true;
        e.target.addEventListener('dragstart', handleDragStart);
    }
    
    // Remove dragging class
    document.querySelector('.dragging')?.classList.remove('dragging');
}

function checkAnswers() {
    let correct = true;
    const resultDiv = document.getElementById('result');
    
    // Remove any previous match/incorrect classes
    document.querySelectorAll('.word-box, .match-box').forEach(el => {
        el.classList.remove('matched', 'incorrect');
    });
    
    wordPairs.forEach(pair => {
        const matchedDefinition = currentMatches.get(pair.word);
        const isCorrect = matchedDefinition === pair.definition;
        
        if (!isCorrect) {
            correct = false;
        }
        
        // Update visual feedback
        const wordBox = document.querySelector(`.word-box[data-word="${pair.word}"]`);
        const matchBox = document.querySelector(`.match-box[data-word="${pair.word}"]`);
        
        if (isCorrect) {
            wordBox.classList.add('matched');
            matchBox.classList.add('matched');
        } else {
            wordBox.classList.add('incorrect');
            matchBox.classList.add('incorrect');
        }
    });
    
    // Show result
    resultDiv.textContent = correct ? 'All matches are correct! 🎉' : 'Some matches are incorrect. Try again!';
    resultDiv.className = correct ? 'correct' : 'incorrect';
} 