// Initialize tasks from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || {
    'todo': [],
    'in-progress': [],
    'done': []
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const todoTasks = document.getElementById('todo-tasks');
const inProgressTasks = document.getElementById('in-progress-tasks');
const doneTasks = document.getElementById('done-tasks');

// Render all tasks
function renderTasks() {
    renderColumn('todo', todoTasks);
    renderColumn('in-progress', inProgressTasks);
    renderColumn('done', doneTasks);
}

// Render tasks for a specific column
function renderColumn(columnId, columnElement) {
    columnElement.innerHTML = '';
    tasks[columnId].forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.draggable = true;
        taskElement.innerHTML = `
            ${task.text}
            <button class="delete-btn" onclick="deleteTask('${columnId}', ${index})">×</button>
        `;
        taskElement.addEventListener('dragstart', () => {
            taskElement.classList.add('dragging');
            currentDraggedTask = { columnId, index };
        });
        columnElement.appendChild(taskElement);
    });
}

// Add drag-and-drop functionality
let currentDraggedTask = null;

document.querySelectorAll('.tasks').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
    });

    column.addEventListener('drop', e => {
        e.preventDefault();
        if (currentDraggedTask) {
            const task = tasks[currentDraggedTask.columnId][currentDraggedTask.index];
            tasks[currentDraggedTask.columnId].splice(currentDraggedTask.index, 1);
            const newColumnId = column.id.replace('-tasks', '');
            tasks[newColumnId].push(task);
            saveTasks();
            renderTasks();
        }
    });
});

// Add a new task
function addTask(columnId) {
    const text = prompt('Enter task:');
    if (text) {
        tasks[columnId].push({ text });
        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(columnId, index) {
    tasks[columnId].splice(index, 1);
    saveTasks();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll('.task').forEach(task => {
        const text = task.textContent.toLowerCase();
        task.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

// Initial render
renderTasks();
