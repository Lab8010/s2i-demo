const certifications = [
  { id: 'RHCSA', label: 'RHCSA', description: 'Red Hat Certified System Administrator' },
  { id: 'RHCE', label: 'RHCE', description: 'Red Hat Certified Engineer' },
  { id: 'RHCA', label: 'RHCA', description: 'Red Hat Certified Architect' },
  { id: 'RHTS', label: 'Red Hat Certified Specialist', description: 'Specialist Certification' },
  { id: 'RHCE-ADV', label: 'Red Hat Certified Expert', description: 'Expert Certification' },
  { id: 'RHCA-TECH', label: 'Red Hat Certified Architect (技術系)', description: 'Architect Specialty' }
];

const list = document.getElementById('draggable-list');
const targets = document.querySelectorAll('.drop-target');
const lamps = {
  RHCSA: document.getElementById('lamp-rhcsa'),
  RHCE: document.getElementById('lamp-rhce'),
  RHCA: document.getElementById('lamp-rhca')
};

let draggedItem = null;

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.id = item.id;
  card.textContent = `${item.label} — ${item.description}`;

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

function updateLamps() {
  const placedValues = Array.from(targets).map(target => target.dataset.current);
  Object.keys(lamps).forEach(key => {
    const lamp = lamps[key];
    if (placedValues.includes(key)) {
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

function handleDrop(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (!draggedItem) return;

  const existing = target.querySelector('.card');
  if (existing) {
    list.appendChild(existing);
  }

  target.textContent = '';
  target.appendChild(draggedItem);
  target.classList.add('filled');
  target.dataset.current = draggedItem.id;
  updateLamps();
}

function setupDropTargets() {
  targets.forEach(target => {
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
