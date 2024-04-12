'use-strict';

import { months, repImages } from './utils.js';
import { calendarDays, repList, repDropdownItem } from './literals.js';

///////////// App Initialization ///////////////

const proxyUrl = new URL('https://corsproxy.io/?');
const currentMonth = new Date().getMonth();
let selectedMonth;
let currentDayNumber;
let currentSelectedTime;

//////////// Selectors ///////////////

// Labels
const monthLabel = document.querySelector('.month--label');
const calWeekLabel = document.querySelector('.calendar--week--label');
const repModalName = document.querySelector('.rep--modal--name');
const nextAppointment = document.querySelector('.next--appointment');
const repModalAvatar = document.querySelector('.rep--modal--avatar');
const currentRepAvatar = document.querySelector('.current--rep--avatar');
const currentRepName = document.querySelector('.current--rep--name');
const selectedDate = document.querySelector('.selected--date');
const calNav = document.querySelector('.cal--nav');

// Containers
const calDaysContainer = document.querySelector('.cal--days--container');
const calLoaderContainer = document.querySelector('.cal--loader--container');
const repsContainer = document.querySelector('.reps--container');
const repDropDownContainer = document.querySelector('.rep--dropdown--container');

// Buttons
const btnNextMonth = document.querySelector('.btn--next--month');
const btnPreviousMonth = document.querySelector('.btn--previous--month');
const btnCalBook = document.querySelector('.btn--cal--book');
const btnRepFormCancel = document.querySelector('.btn--rep--form--cancel');
const btnRepFormSubmit = document.querySelector('.btn--rep--form--submit');
const btnModalSuccess = document.querySelector('.btn--modal--success');
const btnDateSelectCancel = document.querySelector('.btn--date--select--cancel');
const btnDateSelectSubmit = document.querySelector('.btn--date--select--submit');
const btnTimeSelect = document.querySelectorAll('.btn--time--select');
const btnRepDropdown = document.querySelector('.btn--rep--dropdown');

// Modals
const repModalForm = document.querySelector('.rep--modal--form');
const overlayModalRep = document.querySelector('.overlay--modal--rep');
const successModal = document.querySelector('.success--modal');
const overlaySuccess = document.querySelector('.overlay--success');
const dateSelectModal = document.querySelector('.date--select--modal');
const dateSelectForm = document.querySelector('.date--select--form');
const overlayDateSelect = document.querySelector('.overlay--date--select');

// Forms
const repModalFormData = document.querySelector('.modal__rep-form');

///////////// Event Listeners ///////////////

window.addEventListener(
  'DOMContentLoaded',
  _initializeCalendar(currentMonth),
  _initializeRepList(),
  btnTimeSelect.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      _applySelectedTimeStyles(e);
    })
  }),
  _addCalendarDaysEventListeners()
);

btnNextMonth.addEventListener('click', function (e) {
  e.preventDefault();
  calNav.classList.toggle('hide');
  getNextMonth();
})

btnPreviousMonth.addEventListener('click', function (e) {
  e.preventDefault();
  calNav.classList.toggle('hide');
  getPreviousMonth();
});

btnRepFormCancel.addEventListener('click', toggleRepModal);

btnRepFormSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  submitRepModalForm();
});

btnDateSelectSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  submitDateSelectForm();
});

btnModalSuccess.addEventListener('click', toggleSuccessModal);

btnCalBook.addEventListener('click', function () {
  _setDefaultDropdown();
  toggleDateSelectModalForm();
});

btnDateSelectCancel.addEventListener('click', toggleDateSelectModalForm);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && repModalForm.classList.contains('modal-show'))
    toggleRepModal();

  if (e.key === 'Escape' && dateSelectModal.classList.contains('modal-show'))
    toggleDateSelectModalForm();
});

overlayModalRep.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay--modal--rep')) toggleRepModal();
});

overlaySuccess.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay--success')) toggleSuccessModal();
});

overlayDateSelect.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay--date--select')) toggleDateSelectModalForm();
});

btnRepDropdown.addEventListener('click', function () {
  _applyDropdownStyles();
});

////////////// Methods ///////////////

// Private

function _initializeCalendar(month) {
  selectedMonth = months[month];
  monthLabel.textContent = selectedMonth;
  if (currentMonth + 1 === months.indexOf(selectedMonth) + 1) {
    btnPreviousMonth.classList.add('hide');
  } else {
    btnPreviousMonth.classList.remove('hide');
  }
  _setCalendarDays();
}

function _setCalendarDays() {
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

function _addCalendarDaysEventListeners() {
  document.querySelectorAll('.btn--day').forEach(day => {
    day.addEventListener('click', function (e) {
      let date = e.currentTarget.querySelector('time').textContent;
      _setDefaultDropdown(date);
      toggleDateSelectModalForm();
    });
  });
}

function _showLoader() {
  calDaysContainer.innerHTML = null;
  _toggleCalendarStyles();
  setTimeout(function () {
    _setCalendarDays();
    _toggleCalendarStyles();
    _addCalendarDaysEventListeners();
    calNav.classList.toggle('hide');
  }, 800);
}

function _toggleCalendarStyles() {
  calWeekLabel.classList.toggle('hide');
  calDaysContainer.classList.toggle('hide');
  calLoaderContainer.classList.toggle('hide');
  btnCalBook.classList.toggle('hide');
}

async function _initializeRepList() {
  try {
    const response = await fetch(proxyUrl + 'https://dummyjson.com/users/filter?key=gender&value=female&limit=5');
    _buildPepList(await response.json());
  } catch (error) {
    _fetchRepError(error);
  }
  document.querySelectorAll('.btn--rep').forEach(btn => btn.addEventListener('click', function (e) {
    bookRep(e)
  }));
  document.querySelectorAll('.btn--selected--rep').forEach(btn => btn.addEventListener('click', function (e) {
    _setSelectedRep(e.currentTarget);
  }));
}

function _fetchRepError(error) {
  repsContainer.insertAdjacentHTML('afterbegin',
    `<p class="border border-gray-200 p-12 mt-12 text-lg text-white">Unable to load sales reps, please try again later.</p>`
  );
}

function _buildPepList(resp) {
  resp.users.forEach((user, ind) => {
    repsContainer.insertAdjacentHTML(
      'afterbegin',
      repList(user, ind, repImages, moment(`${currentDayNumber}`, 'DD').format('Do'), months[currentMonth])
    );
    _setRepDropdownItems(user, repImages[ind]);
  });
}

function _handleFormSuccess(overlay) {
  overlay.classList.toggle('animate-pulse');
  if (overlay.classList.contains('overlay--modal--rep')) {
    toggleRepModal();
  } else {
    toggleDateSelectModalForm();
  }
  toggleSuccessModal();
}

function _applySelectedTimeStyles(e) {
  if (currentSelectedTime) {
    currentSelectedTime.classList.toggle('bg-white');
    currentSelectedTime.classList.toggle('bg-teal-300');
    currentSelectedTime = null;
  }

  if (e) {
    currentSelectedTime = e.target;
    currentSelectedTime.classList.toggle('bg-white');
    currentSelectedTime.classList.toggle('bg-teal-300');
  }
}

function _applyDropdownStyles() {
  document.querySelector('ul').classList.toggle('dropdown_hide');
  document.querySelector('ul').classList.toggle('dropdown_show');
}

function _setSelectedRep(target) {
  currentRepAvatar.src = target.querySelector('img').src;
  currentRepName.textContent = target.querySelector('span').textContent;
  _applyDropdownStyles();
}

function _setRepDropdownItems(user, avatar) {
  repDropDownContainer.insertAdjacentHTML('afterbegin', repDropdownItem(user, avatar));
}

function _setDefaultDropdown(date) {
  if (date) {
    selectedDate.textContent = `${selectedMonth} `.concat(moment(`${date}`, 'DD').format('Do'));
  } else {
    selectedDate.textContent = `${selectedMonth} `.concat(moment(`${currentDayNumber}`, 'DD').format('Do'));
  }
  currentRepAvatar.src = document.querySelector('.reps--container').children[0].querySelector('img').src;
  currentRepName.textContent = document.querySelector('.reps--container').children[0].querySelector('h3').outerText;
}

// Public

function getNextMonth() {
  _initializeCalendar(months.indexOf(selectedMonth) + 1);
  _showLoader();
}

function getPreviousMonth() {
  _initializeCalendar(months.indexOf(selectedMonth) - 1);
  _showLoader();
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
    await response.json();
    _handleFormSuccess(overlayModalRep);
  } catch (error) {
    console.log(error);
  }
}

async function submitDateSelectForm() {
  overlayDateSelect.classList.toggle('animate-pulse');
  const formData = new FormData(dateSelectForm);
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
    await response.json();
    _handleFormSuccess(overlayDateSelect);
  } catch (error) {
    console.log(error);
  }
}

function toggleDateSelectModalForm() {
  dateSelectForm.reset();
  dateSelectModal.classList.toggle('modal-hide');
  dateSelectModal.classList.toggle('modal-show');
  _applySelectedTimeStyles();
}
