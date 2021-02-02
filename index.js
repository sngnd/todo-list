const addTaskBtn = document.querySelector("#addTaskBtn");
const taskSubmitBtn = document.querySelector(".task__submitBtn");
const taskForm = document.querySelector(".task__form");
const modalWrapper = document.querySelector(".modal__wrapper");
const okBtn = document.querySelector("#okBtn");
const boardContent = document.querySelectorAll(".board__content");

let toDoArray = [];
let deletedArray = [];
let inProcessArray = [];
let doneArray = [];

const isNameValid = (name) => {
    if (name.value === "" || name.value === " ") {
        name.style.border = "1px solid red";

        return false;
    }

    return true;
};

const isDescriptionValid = (description) => {
    if (description.value === "" || description.value === " ") {
        description.style.border = "1px solid red";

        return false;
    }

    return true;
};

const closeTaskForm = (taskForm, name, description) => {
    taskForm.reset();
    taskForm.style.display = "none";
    name.style.border = "1px solid transparent";
    description.style.border = "1px solid transparent";
};

const displayTasks = (id) => {
        const boardContent = document.querySelector(`#${id}`);

        let array, type;
        switch (id) {
            case "board__content_task":
                array = toDoArray;
                type = "todo";
                break;

            case "board__content_process":
                array = inProcessArray;
                type = "inprocess";
                break;

            case "board__content_done":
                array = doneArray;
                type = "done";
                break;

            case "board__content_deleted":
                array = deletedArray;
                type = "deleted";
        }

        boardContent.innerHTML = "";

        array.forEach((item, index) => {
                    boardContent.innerHTML += `<div class="task__card" draggable="true" data-index="${index}" data-type="${type}">
        <div class="task__card_content">
            <h3 class="task__card_name">${item.name}</h3>
            <p class="task__card_description">${item.description}</p>
        </div>
        ${
          type === "deleted"
            ? ""
            : `<div class="task__buttons">
            <button class="task__editBtn">
              <img class="editBtn__icon" src="icons/edit.png"></img>
            </button>
            <button class="task__deleteBtn">
              <img class="deleteBtn__icon" src="icons/delete.png"></img>
            </button>
          </div>`
        }</div>`;
  });

  taskCardHandler();
};

const taskCardHandler = () => {
  const taskCard = [...document.querySelectorAll(".task__card")];
  taskCard.forEach((card) => {
    addDragAndDrop(card);
  });
};

const addDragAndDrop = (card) => {
  card.addEventListener("dragstart", (event) => {
    event.target.classList.add("selected");
  });

  card.addEventListener("dragend", (event) => {
    event.target.classList.remove("selected");
  });
};

for (const board of boardContent) {
  board.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  board.addEventListener("dragenter", () => {
    board.style.border = "1px dashed red";
  });

  board.addEventListener("dragleave", () => {
    board.style.border = "none";
  });

  board.addEventListener("drop", (event) => {
    const activeElement = document.querySelector(`.selected`);
    board.style.border = "none";

    const currentId = board.id;
    const parentId = activeElement.parentElement.id;
    if (currentId == parentId) return;

    const name = activeElement.querySelector(".task__card_name");
    const description = activeElement.querySelector(".task__card_description");

    deleteElement(parentId, name, description);
    addElement(currentId, name, description);
  });

  board.addEventListener("click", (event) => {
    const card = event.target.offsetParent.offsetParent;

    if (event.target.closest(".task__editBtn")) {
      handleEditBtn(card);
    } else if (event.target.closest(".task__deleteBtn")) {
      handleDeleteBtn(card);
    }
  });
}

const deleteElement = (parentId, name, description) => {
  switch (parentId) {
    case "board__content_task":
      toDoArray.splice(
        toDoArray.findIndex(
          (item) => item.name === name && item.description === description
        ),
        1
      );
      break;

    case "board__content_process":
      inProcessArray.splice(
        inProcessArray.findIndex(
          (item) => item.name === name && item.description === description
        ),
        1
      );
      break;

    case "board__content_done":
      doneArray.splice(
        doneArray.findIndex(
          (item) => item.name === name && item.description === description
        ),
        1
      );
      break;

    case "board__content_deleted":
      deletedArray.splice(
        deletedArray.findIndex(
          (item) => item.name === name && item.description === description
        ),
        1
      );
      break;
  }
  displayTasks(parentId);
};

const addElement = (currentId, name, description) => {
  switch (currentId) {
    case "board__content_task":
      toDoArray.push({
        name: name.textContent,
        description: description.textContent,
      });

      break;
    case "board__content_process":
      inProcessArray.push({
        name: name.textContent,
        description: description.textContent,
      });

      break;
    case "board__content_done":
      doneArray.push({
        name: name.textContent,
        description: description.textContent,
      });

      break;

    case "board__content_deleted":
      deletedArray.push({
        name: name.textContent,
        description: description.textContent,
      });

      break;
  }
  displayTasks(currentId);
};

const handleDeleteBtn = (card) => {
  const indexOfTask = card.dataset.index;
  const type = card.dataset.type;
  let arr;
  switch (type) {
    case "todo":
      arr = toDoArray.splice(indexOfTask, 1);
      break;
    case "inprocess":
      arr = inProcessArray.splice(indexOfTask, 1);
      break;
    case "done":
      arr = doneArray.splice(indexOfTask, 1);
      break;
  }

  deletedArray.push(arr.pop());

  displayTasks("board__content_deleted");
  displayTasks(card.parentElement.id);
};

const handleEditBtn = (card) => {
  const name = card.querySelector(".task__card_name").textContent;
  const description = card.querySelector(".task__card_description").textContent;
  const indexToEdit = card.dataset.index;
  const type = card.dataset.type;

  openModal(name, description, indexToEdit, type);
};

const openModal = (name, description, indexToEdit, type) => {
  modalWrapper.style.display = "block";

  const modalInfo = modalWrapper.querySelector(".modal__info");
  modalInfo.dataset.type = type;
  modalInfo.dataset.index = indexToEdit;
  modalInfo.innerHTML = `<label for='edit-name'>Name:</label>
    <input id="edit-name" value=${name} required>
    <label for='edit-description'>Description:</label>
    <textarea id="edit-description" required>${description}</textarea>`;
};

okBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const modalInfo = document.querySelector(".modal__info");
  const type = modalInfo.dataset.type;
  const index = modalInfo.dataset.index;
  const editDescription = document.querySelector("#edit-description").value;
  const editName = document.querySelector("#edit-name").value;

  let arr, id;
  switch (type) {
    case "todo":
      arr = toDoArray;
      id = "board__content_task";
      break;
    case "inprocess":
      arr = inProcessArray;
      id = "board__content_process";
      break;
    case "done":
      arr = doneArray;
      id = "board__content_done";
      break;
  }

  arr.splice(index, 1, {
    name: editName,
    description: editDescription,
  });

  closeModal();
  displayTasks(id);
});

const closeModal = () => {
  modalWrapper.style.display = "none";
};

addTaskBtn.addEventListener("click", () => {
  if (taskForm.style.display === "block") {
    //при повторном нажатии на кнопку форма закрывается
    const name = document.querySelector(".task__name");
    const description = document.querySelector(".task__description");
    closeTaskForm(taskForm, name, description);
  } else {
    taskForm.style.display = "block";
  }
});

taskSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const name = document.querySelector(".task__name");
  const description = document.querySelector(".task__description");

  const descriptionValidation = isDescriptionValid(description);
  const nameValidation = isNameValid(name);

  if (descriptionValidation && nameValidation) {
    toDoArray.push({ name: name.value, description: description.value });
    closeTaskForm(taskForm, name, description);
    displayTasks("board__content_task");
  }
});

modalWrapper.addEventListener("click", (event) => {
  if (
    !event.target.closest(".modal__content") ||
    event.target.closest("#closeBtn")
  )
    closeModal();
});