// Application state

const appState = {
  service: null,
  date: null,
  time: null,
  client: {
    name: "",
    email: "",
  },
};

// Elements

const serviceButtons = document.querySelectorAll(".service-button");
const dateInput = document.getElementById("dateInput");
const timeSlotsContainer = document.getElementById("timeSlots");
const bookingForm = document.getElementById("bookingForm");
const summaryText = document.getElementById("summaryText");

// Service selection


serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    serviceButtons.forEach((btn) =>
      btn.classList.remove("selected-service")
    );

    button.classList.add("selected-service");
    appState.service = button.dataset.service;

    updateSummary();
  });
});

// Date & time

const availableTimes = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

dateInput.addEventListener("change", () => {
  appState.date = dateInput.value;
  generateTimeSlots();
  updateSummary();
});

function generateTimeSlots() {
  timeSlotsContainer.innerHTML = "";

  availableTimes.forEach((time) => {
    const slot = document.createElement("button");
    slot.className = "time-slot";
    slot.textContent = time;

    slot.addEventListener("click", () => {
      document
        .querySelectorAll(".time-slot")
        .forEach((el) => el.classList.remove("selected-time"));

      slot.classList.add("selected-time");
      appState.time = time;

      updateSummary();
    });

    timeSlotsContainer.appendChild(slot);
  });
}

// Form

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("clientName");
  const emailInput = document.getElementById("clientEmail");

  appState.client.name = nameInput.value;
  appState.client.email = emailInput.value;

  if (!isBookingValid()) {
    alert("Please complete all booking steps.");
    return;
  }

  saveBooking();
  updateSummary(true);
  bookingForm.reset();
});

// Helpers

function isBookingValid() {
  return (
    appState.service &&
    appState.date &&
    appState.time &&
    appState.client.name &&
    appState.client.email
  );
}

function updateSummary(isConfirmed = false) {
  if (!appState.service) {
    summaryText.textContent = "No appointment selected yet.";
    return;
  }

  summaryText.innerHTML = `
    <strong>Service:</strong> ${appState.service}<br />
    <strong>Date:</strong> ${appState.date || "-"}<br />
    <strong>Time:</strong> ${appState.time || "-"}<br />
  `;

  if (isConfirmed) {
    summaryText.innerHTML += `
      <br /><strong>Status:</strong> Appointment confirmed ✔️
    `;
  }
}

function saveBooking() {
  const bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  bookings.push({
    ...appState,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem("bookings", JSON.stringify(bookings));
}
