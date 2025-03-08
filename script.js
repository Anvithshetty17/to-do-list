document.addEventListener("DOMContentLoaded", () => renderTasks("all"));

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const resetButton = document.getElementById("reset");
const filterButtons = document.querySelectorAll(".filter-btn");

addTaskButton.addEventListener("click", addTask);
resetButton.addEventListener("click", clearAll);
filterButtons.forEach(button =>
    button.addEventListener("click", function () {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        this.classList.add("active");
        renderTasks(this.dataset.filter);
    })
);

function addTask() {
    let taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Task cannot be empty!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    renderTasks(getActiveFilter());
}

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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
