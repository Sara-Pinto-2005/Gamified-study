let currentLevel = 1;
let levelsData = []; // Array to hold all levels with their tasks and chest links
let xp = 0;
let totalXpRequired = 100;
let levelCounter = 1; // Tracks the current level being added

// Dynamically add a new level in the setup phase
document.getElementById("add-level-btn").addEventListener("click", () => {
    levelCounter++; // Increment the level counter
    const levelSetup = document.getElementById("level-setup");
    
    const newLevel = document.createElement("div");
    newLevel.innerHTML = `
        <h2>Level ${levelCounter}</h2>
        <textarea class="tasks-input" placeholder="Enter tasks for Level ${levelCounter} (one per line)"></textarea>
        <textarea class="chest-input" placeholder="Enter chest links for Level ${levelCounter} (one per line)"></textarea>
    `;
    levelSetup.appendChild(newLevel);
});

// Start the game and switch to the main game interface
document.getElementById("start-game-btn").addEventListener("click", () => {
    const gameTitle = document.getElementById("game-title").value || "My Game";
    document.getElementById("game-title-display").textContent = gameTitle;

    // Collect level data
    const tasksInputs = document.querySelectorAll(".tasks-input");
    const chestInputs = document.querySelectorAll(".chest-input");
    levelsData = [];

    tasksInputs.forEach((tasksInput, index) => {
        const tasks = tasksInput.value.split("\n").filter(task => task.trim() !== "");
        const chestLinks = chestInputs[index].value.split("\n").filter(link => link.trim() !== "");
        levelsData.push({ tasks, chestLinks, completedTasks: 0 });
    });

    // Render levels
    renderLevels();

    // Switch view
    document.getElementById("setup-page").classList.add("hidden");
    document.getElementById("game-page").classList.remove("hidden");
    saveProgress();
});

// Render levels dynamically in the game page
function renderLevels() {
    const levelsContainer = document.getElementById("levels-container");
    levelsContainer.innerHTML = ""; // Clear previous levels

    levelsData.forEach((level, index) => {
        const levelDiv = document.createElement("div");
        levelDiv.classList.add("level");
        levelDiv.innerHTML = `
            <h2>Level ${index + 1}</h2>
            <ul>
                ${level.tasks
                    .map(
                        (task, taskIndex) =>
                            `<li>
                                <input type="checkbox" id="task${index + 1}-${taskIndex}">
                                <label for="task${index + 1}-${taskIndex}">${task}</label>
                            </li>`
                    )
                    .join("")}
            </ul>
            <div class="chest">
                <button id="chest${index + 1}" disabled>Open Chest</button>
            </div>
        `;
        levelsContainer.appendChild(levelDiv);

        // Attach event listeners for tasks
        level.tasks.forEach((_, taskIndex) => {
            document
                .getElementById(`task${index + 1}-${taskIndex}`)
                .addEventListener("change", () => completeTask(index, taskIndex));
        });
    });
}

// Handle task completion and chest unlocking
function completeTask(levelIndex, taskIndex) {
    const level = levelsData[levelIndex];
    if (!level) return;

    // Update task completion
    if (!document.getElementById(`task${levelIndex + 1}-${taskIndex}`).checked) return;
    level.completedTasks++;

    // Update XP
    xp += 20;
    xp = Math.min(xp, totalXpRequired); // Cap XP at 100%
    document.querySelector(".exp-bar span").textContent = `${((xp / totalXpRequired) * 100).toFixed(0)}%`;

    // Unlock chest if all tasks are done
    if (level.completedTasks === level.tasks.length) {
        document.getElementById(`chest${levelIndex + 1}`).disabled = false;

        // Unlock next level
        if (levelIndex + 1 < levelsData.length) {
            document.getElementById(`chest${levelIndex + 2}`).disabled = false;
        }
    }

    saveProgress();
}

// Save and load progress (localStorage)
function saveProgress() {
    localStorage.setItem("gameData", JSON.stringify({ levelsData, currentLevel, xp }));
}

function loadProgress() {
    const savedData = JSON.parse(localStorage.getItem("gameData"));
    if (!savedData) return;

    levelsData = savedData.levelsData;
    currentLevel = savedData.currentLevel;
    xp = savedData.xp;

    renderLevels();
    document.querySelector(".exp-bar span").textContent = `${((xp / totalXpRequired) * 100).toFixed(0)}%`;
}

function completeTask(levelIndex, taskIndex) {
    const level = levelsData[levelIndex];
    if (!level) return;

    // Update task completion
    if (!document.getElementById(`task${levelIndex + 1}-${taskIndex}`).checked) return;
    level.completedTasks++;

    // Update XP
    xp += 20;
    xp = Math.min(xp, totalXpRequired); // Cap XP at 100%
    updateXPBar(); // Update the progress bar

    // Unlock chest if all tasks are done
    if (level.completedTasks === level.tasks.length) {
        document.getElementById(`chest${levelIndex + 1}`).disabled = false;

        // Unlock next level
        if (levelIndex + 1 < levelsData.length) {
            document.getElementById(`chest${levelIndex + 2}`).disabled = false;
        }
    }

    saveProgress();
}

// Update the XP progress bar and percentage text
function updateXPBar() {
    const progressBar = document.getElementById("xp-progress");
    const xpPercent = document.getElementById("xp-percent");

    const xpPercentage = (xp / totalXpRequired) * 100;
    progressBar.value = xpPercentage;
    xpPercent.textContent = `${xpPercentage.toFixed(0)}%`;
}

// Restart game
document.getElementById("restart-btn").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

// Load progress on page load
window.onload = loadProgress;