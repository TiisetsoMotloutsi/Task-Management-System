let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();

  if (!title) return alert("Task title is required!");

  const task = {
    id: Date.now(),
    title,
    desc,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  displayTasks();
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  displayTasks();
}

function filterTasks(filter) {
  displayTasks(filter);
}

function displayTasks(filter = 'all') {
  const list = document.getElementById("taskList");
  list.innerHTML = '';

  let filtered = tasks;
  if (filter === 'completed') {
    filtered = tasks.filter(t => t.completed);
  } else if (filter === 'pending') {
    filtered = tasks.filter(t => !t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong><br/>
        <small>${task.desc}</small>
      </div>
      <div>
        <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

displayTasks();
