document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        savedTasks.forEach(task => tasks.push(task));
    }
    updateTaskList();
    updateStats();
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = ()=> {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    
    const text = taskInput.value.trim();
    const dateValue = taskDate.value;
    const timeValue = taskTime.value;

    if (text) {
        const newTask = {
            text: text,
            completed: false
        };
        
        // Add date and time if provided
        if (dateValue) {
            newTask.date = dateValue;
        }
        if (timeValue) {
            newTask.time = timeValue;
        }
        
        tasks.push(newTask);

        updateTaskList();
        updateStats();
        saveTasks();

        taskInput.value = '';
        taskDate.value = '';
        taskTime.value = '';
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    console.log(tasks);
    updateTaskList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

const updateTaskList = ()=> {
    const taskList = document.getElementById('task-list');
    
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        
        // Format date and time if they exist
        let dateTimeHTML = '';
        if (task.date || task.time) {
            const formattedDate = task.date ? new Date(task.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            }) : '';
            const formattedTime = task.time || '';
            dateTimeHTML = `<span class="task-date-time">${formattedDate} ${formattedTime}</span>`;
        }
        
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${
                        task.completed ? 'checked' : ''
                    } />
                    <div class="task-content">
                        <p>${task.text}</p>
                        ${dateTimeHTML}
                    </div>
                </div>
                <div class="icons">
                    <img src="./img/edit.png" onClick="editTask(${index})" />
                    <img src="./img/bin.png" onClick="deleteTask(${index})" />
                </div>
            </div>
        `;
        listItem.addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};

document.getElementById('newTask').addEventListener('click', function(e){
    e.preventDefault();

    addTask();
});

const blastConfetti = () => {
    const count = 200,
    defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};