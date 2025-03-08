document.addEventListener("DOMContentLoaded", () => renderTasks("all"));

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const resetButton = document.getElementById("reset");
const filterButtons = document.querySelectorAll(".filter-btn");

// Event Listeners
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});
resetButton.addEventListener("click", clearAll);
filterButtons.forEach(button =>
    button.addEventListener("click", function () {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        this.classList.add("active");
        renderTasks(this.dataset.filter);
    })
);

// Add Task
function addTask() {
    let taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Task cannot be empty!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

 
    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        alert("Task already exists!");
        return;
    }

    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    renderTasks(getActiveFilter());
}

// Render Tasks
function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length === 0) {
        taskList.innerHTML = `<p class="no-tasks">No tasks available</p>`;
        return;
    }

    tasks.forEach((task, index) => {
        if (filter === "active" && task.completed) return;
        if (filter === "completed" && !task.completed) return;

        let li = document.createElement("li");
        li.classList.add("task-item");
        if (task.completed) li.classList.add("completed");

        let taskText = document.createElement("span");
        taskText.innerText = task.text;
        taskText.classList.add("task-text");

        let actions = document.createElement("div");
        actions.classList.add("task-actions");

        if (!task.completed) {
            let editButton = document.createElement("button");
            editButton.innerHTML = `<i class="fas fa-edit"></i>`;
            editButton.classList.add("edit");
            editButton.onclick = () => editTask(index);
            actions.appendChild(editButton);

            let doneButton = document.createElement("button");
            doneButton.innerHTML = `<i class="fas fa-check"></i>`;
            doneButton.classList.add("done");
            doneButton.onclick = () => markCompleted(index);
            actions.appendChild(doneButton);
        }

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        deleteButton.classList.add("delete");
        deleteButton.onclick = () => deleteTask(index);
        actions.appendChild(deleteButton);

        li.appendChild(taskText);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let newText = prompt("Edit Task:", tasks[index].text);
    if (newText) {
        tasks[index].text = newText.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(getActiveFilter());
    }
}


function markCompleted(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(getActiveFilter());
}


function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(getActiveFilter());
}


function clearAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("tasks");
        renderTasks("all");
    }
}


function getActiveFilter() {
    return document.querySelector(".filter-btn.active")?.dataset.filter || "all";
}
