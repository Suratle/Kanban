const attachCard = (card) => {
  const todoLane = document.querySelector(".swimlane.todo");
  todoLane.appendChild(card);
};

const createCard = (title, lane = "todo", id = Date.now().toString()) => {
  const cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.innerText = title;
  cardElement.id = id;
  cardElement.draggable = "true";

  cardElement.addEventListener("dragstart", (e) => {
    e.target.id = "dragged";
  });

  cardElement.addEventListener("dragend", (e) => {
    e.target.id = e.target.getAttribute("data-original-id");
  });

  const targetLane = document.querySelector(`.swimlane.${lane}`);
  targetLane.appendChild(cardElement);
};

const saveCardToStorage = (card) => {
  let cards = JSON.parse(localStorage.getItem("kanbanCards")) || [];

  const existingIndex = cards.findIndex((c) => c.id === card.id);
  if (existingIndex !== -1) {
    cards[existingIndex] = card;
  } else {
    cards.push(card);
  }

  localStorage.setItem("kanbanCards", JSON.stringify(cards));
};

const removeCardFromStorage = (id) => {
  let cards = JSON.parse(localStorage.getItem("kanbanCards")) || [];
  cards = cards.filter((card) => card.id !== id);
  localStorage.setItem("kanbanCards", JSON.stringify(cards));
};

const loadCardsFromStorage = () => {
  const cards = JSON.parse(localStorage.getItem("kanbanCards")) || [];
  cards.forEach((card) => {
    createCard(card.title, card.lane, card.id);
  });
};

loadCardsFromStorage();

const getUserName = () => {
  let name = localStorage.getItem("kanbanUserName");
  if (!name) {
    name = prompt("Welcome! What's your name?");
    if (name) {
      localStorage.setItem("kanbanUserName", name);
    }
  }
  return name;
};

const updateGreeting = () => {
  const greetingSpan = document.getElementById("greeting");
  const name = localStorage.getItem("kanbanUserName") || "Guest";
  greetingSpan.textContent = `Hello ${name}!`;
};

document.getElementById("change-name-btn").addEventListener("click", () => {
  const newName = prompt("Enter your new name:");
  if (newName) {
    localStorage.setItem("kanbanUserName", newName);
    updateGreeting();
  }
});

updateGreeting();

const addEventListenersToSwimlanes = () => {
  const swimlanes = document.querySelectorAll(".swimlane");

  swimlanes.forEach((swimlane) => {
    swimlane.addEventListener("dragover", (e) => e.preventDefault());

    swimlane.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedCard = document.querySelector("#dragged");
      if (!draggedCard) return;

      const cardId = draggedCard.id;
      const title = draggedCard.innerText;
      const laneName = swimlane.classList[1];

      draggedCard.parentNode.removeChild(draggedCard);

      if (laneName === "delete") {
        removeCardFromStorage(cardId);
        return;
      }

      swimlane.appendChild(draggedCard);
      saveAllCardsToStorage();
    });
  });
};

document.getElementById("add-card-btn").addEventListener("click", () => {
  const input = document.getElementById("card-title-input");
  const title = input.value.trim();
  if (title !== "") {
    createCard(title);
    input.value = "";
  }
});

document.getElementById("card-title-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("add-card-btn").click();
  }
});

document.getElementById("add-card-btn").addEventListener("click", () => {
  const input = document.getElementById("card-title-input");
  const title = input.value.trim();
  if (title !== "") {
    createCard(title); 
    saveAllCardsToStorage(); 
    input.value = "";
  }
});

addEventListenersToSwimlanes();

const saveAllCardsToStorage = () => {
  const allCards = [];
  const lanes = document.querySelectorAll(".swimlane");

  lanes.forEach((lane) => {
    const laneName = lane.classList[1]; // e.g., 'todo', 'doing'
    const cards = lane.querySelectorAll(".card");

    cards.forEach((card) => {
      allCards.push({
        id: card.id,
        title: card.innerText,
        lane: laneName,
      });
    });
  });

  localStorage.setItem("kanbanCards", JSON.stringify(allCards));
};

[
  { id: "card1", title: "Task 1", lane: "todo" },
  { id: "card2", title: "Task 2", lane: "doing" },
  { id: "card3", title: "Task 3", lane: "todo" },
];
