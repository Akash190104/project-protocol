// ==========================================
// DATA LAYER (Chrome Storage)
// ==========================================
const STORAGE_KEY = 'protocol_data';

let appState = {
    userName: "",
    startDate: "",
    deadline: "",
    goals: []
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const setupScreen = document.getElementById('setup-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

const setupName = document.getElementById('setup-name');
const setupStart = document.getElementById('setup-start');
const setupEnd = document.getElementById('setup-end');
const initBtn = document.getElementById('initialize-btn');

const projectHeader = document.getElementById('project-header'); // New Reference
const userNameDisplay = document.getElementById('user-name-display');
const goalsList = document.getElementById('goals-list');
const inputField = document.getElementById('new-goal-input');

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY] && result[STORAGE_KEY].userName) {
            appState = result[STORAGE_KEY];
            loadDashboard();
        } else {
            setupScreen.classList.remove('hidden');
        }
    });
}

// ==========================================
// SETUP LOGIC
// ==========================================
initBtn.addEventListener('click', () => {
    const name = setupName.value;
    const start = setupStart.value;
    const end = setupEnd.value;

    if (!name || !start || !end) {
        alert("PROTOCOL ERROR: All fields required for initialization.");
        return;
    }

    appState = {
        userName: name,
        startDate: start + "T00:00:00",
        deadline: end + "T00:00:00",
        goals: [
            { id: Date.now(), title: "Example Protocol", description: "Delete this and add your own." }
        ]
    };

    saveData(() => {
        setupScreen.classList.add('hidden');
        loadDashboard();
    });
});

document.getElementById('config-btn').addEventListener('click', () => {
    if(confirm("WARNING: This will reset your identity and timeline. Continue?")) {
        chrome.storage.sync.remove(STORAGE_KEY, () => {
            location.reload();
        });
    }
});

// ==========================================
// CORE FUNCTIONS
// ==========================================
function saveData(callback) {
    let data = {};
    data[STORAGE_KEY] = appState;
    chrome.storage.sync.set(data, callback);
}

function loadDashboard() {
    dashboardScreen.classList.remove('hidden');
    userNameDisplay.innerText = appState.userName;
    
    // Set Project Title Dynamically
    setProjectName();
    
    renderAllGoals();
    loop(); 
}

function setProjectName() {
    const start = new Date(appState.startDate).getTime();
    const end = new Date(appState.deadline).getTime();
    
    // Calculate total duration in days
    const totalDuration = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    
    // Update Header
    projectHeader.innerText = `PROJECT ${totalDuration}`;
}

// ==========================================
// TIME ENGINE
// ==========================================
function updateTime() {
    const start = new Date(appState.startDate).getTime();
    const end = new Date(appState.deadline).getTime();
    const now = new Date().getTime();
    
    if (now > end) {
        document.querySelector('.message').innerHTML = "PROTOCOL DEADLINE REACHED.";
        return { totalDays: 0, daysPassed: 0 };
    }

    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days-big').innerText = days;
    document.getElementById('timer-precise').innerText = 
        `${days}d ${hours.toString().padStart(2,'0')}h ${minutes.toString().padStart(2,'0')}m ${seconds.toString().padStart(2,'0')}s`;

    const totalDuration = end - start;
    const timePassed = now - start;
    
    return { 
        totalDays: Math.floor(totalDuration / (1000 * 60 * 60 * 24)), 
        daysPassed: Math.floor(timePassed / (1000 * 60 * 60 * 24)) 
    };
}

// ==========================================
// VISUALIZATION ENGINE
// ==========================================
let lastRenderedHash = ""; 

function renderGrid(data) {
    const { totalDays, daysPassed } = data;
    const currentHash = `${totalDays}-${daysPassed}`;
    if (currentHash === lastRenderedHash) return;
    lastRenderedHash = currentHash;

    const grid = document.getElementById('visual-grid');
    grid.innerHTML = '';

    for (let i = 0; i < totalDays; i++) {
        const block = document.createElement('div');
        if (i < daysPassed) {
            block.className = 'day-block spent';
            block.title = `Day ${i+1}: GONE`;
        } else {
            block.className = 'day-block active';
            block.title = `Day ${i+1}: REMAINING`;
        }
        grid.appendChild(block);
    }
}

// ==========================================
// GOALS SYSTEM
// ==========================================
function createGoalElement(goal) {
    const div = document.createElement('div');
    div.className = 'goal-item';
    div.id = `goal-${goal.id}`;

    const content = document.createElement('div');
    content.className = 'goal-content';

    const titleInput = document.createElement('input');
    titleInput.className = 'editable-title';
    titleInput.value = goal.title;
    titleInput.oninput = (e) => { goal.title = e.target.value; saveData(); };

    const descInput = document.createElement('textarea');
    descInput.className = 'editable-desc';
    descInput.value = goal.description;
    descInput.placeholder = "Add operational details...";
    descInput.rows = 1; 
    descInput.oninput = (e) => { goal.description = e.target.value; saveData(); };

    content.appendChild(titleInput);
    content.appendChild(descInput);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerText = "[ TERMINATE ]";
    delBtn.onclick = () => {
        div.style.opacity = '0';
        div.style.transform = 'translateX(20px)';
        setTimeout(() => {
            appState.goals = appState.goals.filter(g => g.id !== goal.id);
            saveData();
            div.remove();
        }, 200);
    };

    div.appendChild(content);
    div.appendChild(delBtn);

    return div;
}

function renderAllGoals() {
    goalsList.innerHTML = '';
    appState.goals.forEach(goal => {
        goalsList.appendChild(createGoalElement(goal));
    });
}

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && inputField.value.trim() !== "") {
        const newGoal = {
            id: Date.now(),
            title: inputField.value,
            description: ""
        };
        appState.goals.push(newGoal);
        saveData();
        goalsList.appendChild(createGoalElement(newGoal));
        inputField.value = '';
        goalsList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
});

function loop() {
    const data = updateTime();
    renderGrid(data);
    requestAnimationFrame(loop);
}

// Start
init();