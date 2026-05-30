const tracks = {
  RHEL: {
    label: 'RHEL',
    description: 'EX200 / EX342 とスペシャリスト試験を組み合わせて RHEL レベルを達成します。',
    available: true,
    exams: [
      { id: 'EX200', description: 'Red Hat Certified System Administrator (RHCSA)' },
      { id: 'EX210', description: 'Red Hat Certified Specialist in Cloud Infrastructure' },
      { id: 'EX260', description: 'Red Hat Certified Specialist in Ceph Cloud Storage' },
      { id: 'EX342', description: 'Red Hat Certified Engineer (RHCE)' },
      { id: 'EX358', description: 'Red Hat Certified Specialist in Services Management and Automation' },
      { id: 'EX362', description: 'Red Hat Certified Specialist in Identity Management' },
      { id: 'EX403', description: 'Red Hat Certified Specialist in Deployment and Systems Management' },
      { id: 'EX415', description: 'Red Hat Certified Specialist in Security: Linux' },
      { id: 'EX436', description: 'Red Hat Certified Specialist in High Availability Clustering' },
      { id: 'EX442', description: 'Red Hat Certified Specialist in Performance Tuning' }
    ]
  },
  OpenShift: {
    label: 'OpenShift',
    description: 'OpenShift トラックは準備中です。',
    available: false,
    exams: []
  },
  Ansible: {
    label: 'Ansible',
    description: 'Ansible トラックは準備中です。',
    available: false,
    exams: []
  },
  'Cloud Native': {
    label: 'Cloud Native',
    description: 'Cloud Native トラックは準備中です。',
    available: false,
    exams: []
  },
  AI: {
    label: 'AI',
    description: 'AI トラックは準備中です。',
    available: false,
    exams: []
  }
};

const list = document.getElementById('draggable-list');
const mainTarget = document.getElementById('main-drop-zone');
const lamps = {
  l1: document.getElementById('lamp-l1'),
  l2: document.getElementById('lamp-l2'),
  l3: document.getElementById('lamp-l3'),
  l4: document.getElementById('lamp-l4'),
  l5: document.getElementById('lamp-l5')
};
const trackButtons = document.querySelectorAll('.track-button');
const trackTitle = document.getElementById('track-title');
const trackDescription = document.getElementById('track-description');
const trackStatus = document.getElementById('track-status');

let draggedItem = null;
let activeTrack = 'RHEL';

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

function sortExams(exams) {
  return exams.slice().sort((a, b) => {
    const numA = parseInt(a.id.replace(/[^0-9]/g, ''), 10);
    const numB = parseInt(b.id.replace(/[^0-9]/g, ''), 10);
    return numA - numB;
  });
}

function populateList() {
  list.innerHTML = '';
  const track = tracks[activeTrack];
  if (!track.available) {
    return;
  }

  sortExams(track.exams).forEach(item => list.appendChild(createCard(item)));
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
    placeholder.textContent = tracks[activeTrack].available
      ? 'EX200 などの試験ブロックをドラッグしてください'
      : 'このトラックは Coming Soon です。別のトラックをお試しください。';
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
  
  // Find the correct position to insert the card to maintain sorted order
  const track = tracks[activeTrack];
  const sortedExams = sortExams(track.exams);
  const cardExamIndex = sortedExams.findIndex(e => e.id === card.id);
  
  const existingCards = Array.from(list.querySelectorAll('.card'));
  let inserted = false;
  
  for (const existingCard of existingCards) {
    const existingExamIndex = sortedExams.findIndex(e => e.id === existingCard.id);
    if (cardExamIndex < existingExamIndex) {
      list.insertBefore(card, existingCard);
      inserted = true;
      break;
    }
  }
  
  if (!inserted) {
    list.appendChild(card);
  }
  
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

function setTrack(trackId) {
  activeTrack = trackId;
  trackButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.track === trackId);
  });

  trackTitle.textContent = `${tracks[trackId].label} Track`;
  trackDescription.textContent = tracks[trackId].description;
  trackStatus.textContent = tracks[trackId].available ? 'Available' : 'Coming Soon';

  Array.from(mainTarget.querySelectorAll('.card')).forEach(card => list.appendChild(card));
  populateList();
  ensurePlaceholder();
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

  trackButtons.forEach(button => {
    button.addEventListener('click', () => setTrack(button.dataset.track));
  });
}

function init() {
  populateList();
  setupDropTargets();
  updateLamps();
}

window.addEventListener('DOMContentLoaded', init);
