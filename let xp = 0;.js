let xp = 0;
let taskCompleted = 0;
let pomodoroCount = 0;
let timerInterval;

// Elements
const xpElement = document.getElementById('xp-value');
const chestButton = document.getElementById('chest-button');
const taskList = document.querySelectorAll('.task');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const pomodoroTimer = document.getElementById('pomodoro-timer');
const timerDisplay = document.getElementById('timer-display');
const slots = document.querySelectorAll('.slot');

// Carregar progresso salvo
function loadProgress() {
    const savedXP = localStorage.getItem('xp');
    const savedTaskCompleted = localStorage.getItem('taskCompleted');
    const savedPomodoroCount = localStorage.getItem('pomodoroCount');
    
    if (savedXP !== null) {
        xp = parseInt(savedXP);
    }
    if (savedTaskCompleted !== null) {
        taskCompleted = parseInt(savedTaskCompleted);
    }
    if (savedPomodoroCount !== null) {
        pomodoroCount = parseInt(savedPomodoroCount);
    }
    
    updateXP();
    updatePomodoroSlots();
}

// Salvar progresso
function saveProgress() {
    localStorage.setItem('xp', xp);
    localStorage.setItem('taskCompleted', taskCompleted);
    localStorage.setItem('pomodoroCount', pomodoroCount);
}

// Atualizar barra de XP
function updateXP() {
    xp = (taskCompleted / taskList.length) * 100;
    xpElement.textContent = `${xp.toFixed(0)}%`;
    if (xp === 100) {
        chestButton.disabled = false;
    }
}

// Atualizar os slots do Pomodoro
function updatePomodoroSlots() {
    slots.forEach((slot, index) => {
        if (index < pomodoroCount) {
            slot.classList.add('filled');
        } else {
            slot.classList.remove('filled');
        }
    });
}

// Adicionar evento de alteração de tarefa
taskList.forEach(task => {
    task.addEventListener('change', () => {
        taskCompleted = Array.from(taskList).filter(task => task.checked).length;
        updateXP();
        saveProgress(); // Salvar progresso a cada alteração de tarefa
    });
});

// Habilitar baú quando XP for 100%
chestButton.addEventListener('click', () => {
    alert('Você desbloqueou o baú e obteve novos recursos de estudo!');
    saveProgress();
});

// Iniciar temporizador Pomodoro
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
                saveProgress(); // Salvar progresso ao completar um Pomodoro
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
        saveProgress(); // Salvar após preencher um slot
    }
}

function resetSlots() {
    slots.forEach(slot => slot.classList.remove('filled'));
    saveProgress(); // Salvar após resetar os slots
}

// Carregar o progresso ao carregar a página
loadProgress();