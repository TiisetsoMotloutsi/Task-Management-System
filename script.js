// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Escape HTML to prevent injection
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return m;
    }
  });
}

// Display tasks based on current filter
function displayTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; color:#777; padding: 20px;">
      No tasks found.
    </li>`;
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div>
        <strong>${escapeHtml(task.title)}</strong>
        <small>${escapeHtml(task.desc)}</small>
      </div>
      <div>
        <button aria-label="${task.completed ? "Mark task as pending" : "Mark task as complete"}"
                onclick="toggleTask(${task.id})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="delete-btn" aria-label="Delete task"
                onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add a new task
function addTask(title, desc) {
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    desc: desc.trim(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  displayTasks(currentFilter);
}

// Toggle completed state of a task
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  displayTasks(currentFilter);
}

// Delete task by ID
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    displayTasks(currentFilter);
  }
}

// Filter button click handler
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    displayTasks(currentFilter);
  });
});

// Handle form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDesc");

  const title = titleInput.value;
  const desc = descInput.value;

  if (!title.trim()) {
    alert("Task title is required!");
    return;
  }

  addTask(title, desc);
  titleInput.value = "";
  descInput.value = "";
  titleInput.focus();
});

// Initial display
displayTasks();
