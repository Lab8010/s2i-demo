const certifications = [
  { id: 'EX200', label: 'EX200', description: 'Red Hat Certified System Administrator (RHCSA)' },
  { id: 'EX342', label: 'EX342', description: 'Red Hat Certified Engineer (RHCE)' },
  { id: 'EX210', label: 'EX210', description: 'Red Hat Certified Specialist in Cloud Infrastructure' },
  { id: 'EX260', label: 'EX260', description: 'Red Hat Certified Specialist in Ceph Cloud Storage' },
  { id: 'EX358', label: 'EX358', description: 'Red Hat Certified Specialist in Services Management and Automation' },
  { id: 'EX362', label: 'EX362', description: 'Red Hat Certified Specialist in Identity Management' },
  { id: 'EX403', label: 'EX403', description: 'Red Hat Certified Specialist in Deployment and Systems Management' },
  { id: 'EX415', label: 'EX415', description: 'Red Hat Certified Specialist in Security: Linux' },
  { id: 'EX436', label: 'EX436', description: 'Red Hat Certified Specialist in High Availability Clustering' },
  { id: 'EX442', label: 'EX442', description: 'Red Hat Certified Specialist in Performance Tuning' }
];

const list = document.getElementById('draggable-list');
const mainTarget = document.getElementById('main-drop-zone');
const lamps = {
  l1: document.getElementById('lamp-l1'),
  l2: document.getElementById('lamp-l2'),
  l3: document.getElementById('lamp-l3'),
  l4: document.getElementById('lamp-l4'),
  l5: document.getElementById('lamp-l5')
};

let draggedItem = null;

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.id = item.id;

  const label = document.createElement('div');
  label.textContent = `${item.id}: ${item.description}`;
  label.className = 'card-label';

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.style.display = 'none';
  removeButton.addEventListener('click', event => {
    event.stopPropagation();
    moveCardBack(card);
  });

  card.appendChild(label);
  card.appendChild(removeButton);

  card.addEventListener('dragstart', () => {
    draggedItem = card;
    setTimeout(() => card.classList.add('dragging'), 0);
  });

  card.addEventListener('dragend', () => {
    draggedItem = null;
    card.classList.remove('dragging');
  });

  return card;
}

function populateList() {
  certifications.forEach(item => list.appendChild(createCard(item)));
}

function getPlacedIds() {
  return Array.from(mainTarget.querySelectorAll('.card')).map(card => card.id);
}

function updateLamps() {
  const placedIds = getPlacedIds();
  const hasEX200 = placedIds.includes('EX200');
  const hasEX342 = placedIds.includes('EX342');
  const specialistCount = placedIds.filter(id => id !== 'EX200' && id !== 'EX342').length;

  const states = {
    l1: hasEX200,
    l2: hasEX200 && hasEX342,
    l3: hasEX200 && hasEX342 && specialistCount >= 1,
    l4: hasEX200 && hasEX342 && specialistCount >= 2,
    l5: hasEX200 && hasEX342 && specialistCount >= 3
  };

  Object.entries(lamps).forEach(([key, lamp]) => {
    if (states[key]) {
      lamp.classList.add('on');
      lamp.classList.remove('off');
      lamp.textContent = 'ON';
    } else {
      lamp.classList.remove('on');
      lamp.classList.add('off');
      lamp.textContent = 'OFF';
    }
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function ensurePlaceholder() {
  if (!mainTarget.querySelector('.card')) {
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';
    placeholder.textContent = 'EX200 などの試験ブロックをドラッグしてください';
    mainTarget.innerHTML = '';
    mainTarget.appendChild(placeholder);
    mainTarget.classList.remove('filled');
  }
}

function removePlaceholder(target) {
  const placeholder = target.querySelector('.drop-placeholder');
  if (placeholder) {
    placeholder.remove();
  }
}

function moveCardBack(card) {
  const removeButton = card.querySelector('.remove-button');
  if (removeButton) {
    removeButton.style.display = 'none';
  }
  list.appendChild(card);
  ensurePlaceholder();
  updateLamps();
}

function handleDrop(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (!draggedItem) return;

  if (target === list) {
    moveCardBack(draggedItem);
    return;
  }

  removePlaceholder(target);
  target.appendChild(draggedItem);
  const removeButton = draggedItem.querySelector('.remove-button');
  if (removeButton) {
    removeButton.style.display = 'inline-flex';
  }
  target.classList.add('filled');
  updateLamps();
}

function setupDropTargets() {
  const dropZones = [mainTarget, list];
  dropZones.forEach(target => {
    target.addEventListener('dragover', allowDrop);
    target.addEventListener('dragenter', () => target.classList.add('over'));
    target.addEventListener('dragleave', () => target.classList.remove('over'));
    target.addEventListener('drop', event => {
      target.classList.remove('over');
      handleDrop(event);
    });
  });
}

function init() {
  populateList();
  setupDropTargets();
  updateLamps();
}

window.addEventListener('DOMContentLoaded', init);
