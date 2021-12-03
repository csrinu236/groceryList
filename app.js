// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const mainCenter = document.querySelector(".mainCenter");
const clearBtn = document.querySelector(".clearBtn");
const submitBtn = document.querySelector(".submitBtn");

const groceryInput = document.getElementById("groceryInput");
// edit option

let editEle;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearAll);
window.addEventListener("load", setUpItems);
// ****** FUNCTIONS **********

function addItem(e) {
  e.preventDefault();
  const value = groceryInput.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    makeUpItem(id, value);
    addToLocalStorage(id, value);
    setBackDefault();
    displayAlert("success", "Item added");
    clearBtn.classList.add("showClearBtn");
  } else if (value && editFlag) {
    editEle.innerHTML = value;
    displayAlert("success", "item edited");
    editFromLocalStorage(editId, value);
    setBackDefault();
  } else {
    displayAlert("danger", "please enter some value");
  }
}

function displayAlert(type, value) {
  alert.innerHTML = value;
  alert.classList.add(`alert-${type}`);
  setTimeout(() => {
    alert.classList.remove(`alert-${type}`);
  }, 1000);
}

function setBackDefault() {
  groceryInput.value = "";
  submitBtn.textContent = "Submit";
  editFlag = false;
}

function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  mainCenter.removeChild(item);
  if (mainCenter.children.length === 0) {
    clearAll();
  } else {
    displayAlert("danger", "item deleted");
  }
  deleteFromLocalStorage(id);
}

function editItem(e) {
  editEle = e.currentTarget.parentElement.previousElementSibling;
  editId = e.currentTarget.parentElement.parentElement.dataset.id;
  groceryInput.value = editEle.textContent;
  editFlag = true;
  submitBtn.textContent = "Edit";
}

function clearAll() {
  mainCenter.innerHTML = "";
  clearBtn.classList.remove("showClearBtn");
  displayAlert("danger", "all items cleared");
  setBackDefault();
  localStorage.removeItem("list");
}

// ****** LOCAL STORAGE **********
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function addToLocalStorage(id, value) {
  const list = getLocalStorage();
  list.push({ id, value });
  localStorage.setItem("list", JSON.stringify(list));
}
function deleteFromLocalStorage(id) {
  const list = getLocalStorage();
  const newList = list.filter(function (item) {
    if (item.id != id) return item;
  });
  localStorage.setItem("list", JSON.stringify(newList));
}

function editFromLocalStorage(id, value) {
  const list = getLocalStorage();
  const newList = list.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(newList));
}
// ****** SETUP ITEMS **********
function makeUpItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("groceryItem");
  element.setAttribute("data-id", id);
  element.innerHTML = `<p class="groceryValue">${value}</p>
          <div class="btnContainer">
            <button type="button" data-id="${id}" class="mybtn deleteBtn">
              <i class="fas fa-trash"></i>
            </button>
            <button type="button" data-id=${id} class="mybtn editBtn">
              <i class="fas fa-edit"></i>
            </button>
          </div>`;
  mainCenter.appendChild(element);

  // delete edit options
  const deleteBtn = element.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".editBtn");
  editBtn.addEventListener("click", editItem);
}
function setUpItems() {
  const list = getLocalStorage();
  if (list.length > 0) {
    list.forEach(function (item) {
      makeUpItem(item.id, item.value);
    });
    clearBtn.classList.add("showClearBtn");
  }
}
