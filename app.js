let tareas = [];

const form = document.getElementById("form");
const output = document.getElementById("output");
const error = document.getElementById("errorMessage");
const heading = document.getElementById("title");
const description = document.getElementById("description");
const priority = document.getElementById("priority");

let option = false;
let taskToEdit = 0;
/****************** DESARROLLO *************************/

/****************** EVENTS  *************************/

document.addEventListener("DOMContentLoaded", () => {
  clearForm(heading, description, priority);
  tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  createTask();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [heading.value, priority.value, description.value].includes("");
  if(inputs){
    error.style.display = 'block';
    return
  }

  if (option === true) {
    const newTasks = updateTask(taskToEdit);
    tareas = newTasks;
    createTask();
    clearForm(heading, description, priority);
  }

  if (option === false) {
    console.log("entro aqui", option);
    const id = generateId();
    const title = heading.value;
    const prio = priority.value;
    const desc = description.value;
    const flag = false;
    const tarea = { id, title, prio, desc, flag };
    tareas = [...tareas, tarea];
    createTask();
    clearForm(heading, description, priority);
  }

  option = false
});

/****************** FUNCTIONS *************************/

function createTask() {
  clearBefore();
  tareas.forEach((tarea) => {
    output.innerHTML += createTemplate(tarea);
  });

  toLocalStorage();
}

function toLocalStorage() {
  const arrayTareas = JSON.stringify(tareas);
  localStorage.setItem("tareas", arrayTareas);
}

function generateId() {
  return Date.now().toString() + Math.round(Math.random(36)).toString();
}

function clearForm(setTitle, setDesc, setPrio) {
  setTitle.value = "";
  setDesc.value = "";
  setPrio.value = "";
  error.style.display = 'none'
}

function clearBefore() {
  output.innerHTML = "";
}

function remove(event) {
  const taskToDelete = event.target.getAttribute("task-id");
  tareas = tareas.filter((tarea) => tarea.id !== taskToDelete);
  createTask();
}

function edit(event) {
  option = true;

  taskToEdit = event.target.getAttribute("task-id");
  tareas.map((tarea) => {
    if (tarea.id === taskToEdit) {
      heading.value = tarea.title;
      description.value = tarea.desc;
      priority.value = tarea.prio;
    }
  });
}

function updateTask(id) {
  const tareasUpdate = tareas.map((tarea) => {
    if (tarea.id === id) {
      return {
        ...tarea,
        title: heading.value,
        prio: priority.value,
        desc: description.value,
      };
    }

    return tarea;
  });

  return tareasUpdate;
}

function createTemplate(tarea) {
  let template = `
    <div class="card mt-5 animate__animated animate__bounceIn" id="task">
            <div class="mb-5">
              <span class="bold block">Titulo:</span>
              <h4>${tarea.title}</h4>
            </div>

            <div class="mt-1 mb-5">
              <span class="bold block">Prioridad:</span>
              <p>
                ${
                  tarea.prio === "low"
                    ? "🟩 Baja"
                    : tarea.prio === "medium"
                    ? "🟨 Media"
                    : "🟥 Alta"
                }
              </p>
            </div>

            <div class="mb-5">
              <span class="bold block">Description:</span>
              <p>
                ${tarea.desc}
              </p>
            </div>

            <div class="check mb-5">
              <span class="bold">¿Terminado?</span>

              <input type="checkbox" id="done"/>
            </div>

            <div class="actions mt-5">
              <button class="btn" id="edit" task-id="${
                tarea.id
              }" onclick="edit(event)">
                Editar
              </button>
              <button class="btn-delete" id="delete" task-id="${
                tarea.id
              }" onclick="remove(event)">
                Borrar
              </button>
            </div>

          </div>
  `;

  return template;
}
