
const formItem = document.getElementById('item-form');
const inputItem = document.getElementById('input-item');
const listItem = document.getElementById('items-list');
const clearBtn = document.getElementById('clear');
const filter = document.getElementById('filter');

// Global edit state
let isEditMode = false;
let itemToEdit = null;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = inputItem.value.trim();
    if (newItem === '') {
        alert('Please add item');
        return;
    }

    if (isEditMode && itemToEdit) {
        // Update item
        itemToEdit.textContent = newItem;

        // Recreate structure
        const li = itemToEdit.parentElement;
        li.innerHTML = '';

        const span = document.createElement('span');
        span.textContent = newItem;
        span.className = 'item-text';
        li.appendChild(span);
        li.appendChild(createButton('item-button'));

        isEditMode = false;
        itemToEdit = null;

        // Reset button
        const submitBtn = formItem.querySelector('button[type="submit"]');
        submitBtn.style.backgroundColor = '';
        submitBtn.innerHTML = 'Add Item';
    } else {
        // Normal add
        addItemToDOM(newItem);
        addItemToStorage(newItem);
    }

    inputItem.value = '';
    checkUI();
}

function addItemToDOM(item) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = item;
    span.className = 'item-text';
    li.appendChild(span);

    const button = createButton('item-button');
    li.appendChild(button);

    listItem.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-trash delete-btn');
    button.appendChild(icon);

    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function removeItem(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure to delete this item?')) {
            e.target.closest('li').remove();
            checkUI();
        }
    }
}

function clearItems() {
    if (confirm('Are you sure to delete all items?')) {
        listItem.innerHTML = '';
        checkUI();
    }
}

function filterItem(e) {
    const items = listItem.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function checkUI() {
    const items = listItem.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }
}

// Click to edit
listItem.addEventListener('click', (e) => {
    // Delete
    if (e.target.classList.contains('delete-btn')) {
        removeItem(e);
        return;
    }

    // Edit
    if (e.target.classList.contains('item-text')) {
        isEditMode = true;
        itemToEdit = e.target;

        inputItem.value = e.target.textContent;

        // Change button UI
        const submitBtn = formItem.querySelector('button[type="submit"]');
        submitBtn.style.backgroundColor = '#f0ad4e';
        submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item';
    }
});

// Event listeners
formItem.addEventListener('submit', onAddItemSubmit);
clearBtn.addEventListener('click', clearItems);
filter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();

