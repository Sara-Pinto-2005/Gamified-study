let xp = 0;
let taskCompleted = 0;
let pomodoroCount = 0;
let timerInterval;

const xpElement = document.getElementById('xp-value');
const chestButton = document.getElementById('chest-button');
const taskList = document.querySelectorAll('.task');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const pomodoroTimer = document.getElementById('pomodoro-timer');
const timerDisplay = document.getElementById('timer-display');
const slots = document.querySelectorAll('.slot');

function updateXP() {
    xp = (taskCompleted / taskList.length) * 100;
    xpElement.textContent = `${xp.toFixed(0)}%`;
    if (xp === 100) {
        chestButton.disabled = false;
    }
}

taskList.forEach(task => {
    task.addEventListener('change', () => {
        taskCompleted = Array.from(taskList).filter(task => task.checked).length;
        updateXP();
    });
});

chestButton.addEventListener('click', () => {
    alert('Você desbloqueou o baú e obteve novos recursos de estudo!');
});

pomodoroBtn.addEventListener('click', () => {
    pomodoroTimer.classList.toggle('hidden');
    startPomodoro();
});

function startPomodoro() {
    let minutes = 25;
    let seconds = 0;

    function updateTimer() {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                fillSlot();
                if (pomodoroCount < 4) {
                    startPomodoro();
                } else {
                    alert('Você completou 4 Pomodoros! Inicie o próximo ciclo.');
                    pomodoroCount = 0;
                    resetSlots();
                }
            } else {
                seconds = 59;
                minutes--;
            }
        } else {
            seconds--;
        }

        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    timerInterval = setInterval(updateTimer, 1000);
}

function fillSlot() {
    if (pomodoroCount < 4) {
        slots[pomodoroCount].classList.add('filled');
        pomodoroCount++;
    }
}