'use-strict';

import { months, repImages } from './utils.js';
import { calendarDays, repList } from './literals.js';

///////////// App Initialization ///////////////

const proxyUrl = new URL('https://corsproxy.io/?');
const currentMonth = new Date().getMonth();
let selectedMonth;
let currentDayNumber;

//////////// Selectors ///////////////

// Labels
const monthLabel = document.querySelector('.month--label');
const calWeekLabel = document.querySelector('.calendar--week--label');
const repModalName = document.querySelector('.rep--modal--name');
const nextAppointment = document.querySelector('.next--appointment');
const repModalAvatar = document.querySelector('.rep--modal--avatar');

// Containers
const calDaysContainer = document.querySelector('.cal--days--container');
const calLoaderContainer = document.querySelector('.cal--loader--container');
const repsContainer = document.querySelector('.reps--container');

// Buttons
const btnNextMonth = document.querySelector('.btn--next--month');
const btnPreviousMonth = document.querySelector('.btn--previous--month');
const btnCalBook = document.querySelector('.btn--cal--book');
const btnRepFormCancel = document.querySelector('.btn--rep--form--cancel');
const btnRepFormSubmit = document.querySelector('.btn--rep--form--submit');
const btnModalSuccess = document.querySelector('.btn--modal--success');

// Modals
const repModalForm = document.querySelector('.rep--modal--form');
const overlayModalRep = document.querySelector('.overlay--modal--rep');
const successModal = document.querySelector('.success--modal');
const overlaySuccess = document.querySelector('.overlay--success');

// Forms
const repModalFormData = document.querySelector('.modal__rep-form');

///////////// Event Listeners ///////////////

window.addEventListener(
  'DOMContentLoaded',
  initializeCalendar(currentMonth),
  initializeRepList()
);

btnNextMonth.addEventListener('click', function (e) {
  e.preventDefault();
  getNextMonth();
})

btnPreviousMonth.addEventListener('click', function (e) {
  e.preventDefault();
  getPreviousMonth();
});

btnRepFormCancel.addEventListener('click', toggleRepModal);

btnRepFormSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  submitRepModalForm();
});

btnModalSuccess.addEventListener('click', toggleSuccessModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && repModalForm.classList.contains('modal-show'))
    toggleRepModal();
});

overlayModalRep.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay--modal--rep')) toggleRepModal();
});

overlaySuccess.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay--success')) toggleSuccessModal();
});

////////////// Methods ///////////////

function initializeCalendar(month) {
  selectedMonth = months[month];
  monthLabel.textContent = selectedMonth;
  if (currentMonth + 1 === months.indexOf(selectedMonth) + 1) {
    btnPreviousMonth.classList.add('hide');
  } else {
    btnPreviousMonth.classList.remove('hide');
  }
  setCalendarDays();
}

function getNextMonth() {
  initializeCalendar(months.indexOf(selectedMonth) + 1);
  showLoader();
}

function getPreviousMonth() {
  initializeCalendar(months.indexOf(selectedMonth) - 1);
  showLoader();
}

function setCalendarDays() {
  let daysInMonth = moment().month(selectedMonth).daysInMonth();
  currentDayNumber = new Date().getDate();

  Array.from(Array(daysInMonth).keys())
    .reverse()
    .forEach(day => {
      calDaysContainer.insertAdjacentHTML(
        'afterbegin',
        calendarDays(day, currentDayNumber, months.indexOf(selectedMonth), currentMonth)
      );
    });
}

function showLoader() {
  calDaysContainer.innerHTML = null;
  toggleCalendarStyles();
  setTimeout(function () {
    setCalendarDays();
    toggleCalendarStyles();
  }, 800);
}

function toggleCalendarStyles() {
  calWeekLabel.classList.toggle('hide');
  calDaysContainer.classList.toggle('hide');
  calLoaderContainer.classList.toggle('hide');
  btnCalBook.classList.toggle('hide');
}

async function initializeRepList() {
  try {
    const response = await fetch(proxyUrl + 'https://dummyjson.com/users/filter?key=gender&value=female&limit=5');
    buildPepList(await response.json());
  } catch (error) {
    fetchRepError(error);
  }
  document.querySelectorAll('.btn--rep').forEach(btn => btn.addEventListener('click', function (e) {
    bookRep(e)
  }));
}

function fetchRepError(error) {
  repsContainer.insertAdjacentHTML('afterbegin',
    `<p class="border border-gray-200 p-12 mt-12 text-lg text-white">Unable to load sales reps, please try again later.</p>`
  );
}

function buildPepList(resp) {
  resp.users.forEach((user, ind) => {
    repsContainer.insertAdjacentHTML(
      'afterbegin',
      repList(user, ind, repImages, moment(`${currentDayNumber}`, 'DD').format('Do'), months[currentMonth])
    );
  });
}

function bookRep(e) {
  repModalName.textContent = e.currentTarget.querySelector('h3').innerText;
  nextAppointment.textContent = e.currentTarget
    .querySelector('time')
    .innerText.split(': ')[1];
  repModalAvatar.src = e.currentTarget.querySelector('img').src;
  toggleRepModal();
}

function toggleRepModal() {
  repModalFormData.reset();
  repModalForm.classList.toggle('modal-hide');
  repModalForm.classList.toggle('modal-show');
}

function toggleSuccessModal() {
  successModal.classList.toggle('modal-hide');
  successModal.classList.toggle('modal-show');
}

async function submitRepModalForm() {
  overlayModalRep.classList.toggle('animate-pulse');
  const formData = new FormData(repModalFormData);
  try {
    const response = await fetch(
      proxyUrl + 'https://staging.leadjar.app/bookable/send_email',
      {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': 'application/json',
          'Bookable-Signature':
            '2d524326c503e5bf60923f8e70cfa987bd3b4793dd4dce291a6dc5be8ec956f0',
        },
      }
    );
    handleFormSuccess(await response.json());
  } catch (error) {
    console.log(error);
  }
}

function handleFormSuccess() {
  overlayModalRep.classList.toggle('animate-pulse');
  toggleRepModal();
  toggleSuccessModal();
}
