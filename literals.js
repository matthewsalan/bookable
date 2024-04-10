export function calendarDays(day, currentDayNumber, selectedMonth, currentMonth) {
  return `
<button
  type="button"
  class="py-1.5 text-gray-900 focus:z-10 ${
    day + 1 < currentDayNumber && selectedMonth === currentMonth
      ? 'cursor-not-allowed bg-gray-300'
      : 'bg-white hover:bg-gray-100 btn--day'
  }"
>
  <time
    class="date--num mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
      day + 1 === currentDayNumber && selectedMonth === currentMonth
        ? 'bg-orange-500 font-semibold text-white'
        : ''
    }"
    >${day + 1}</time
  >
</button>
`;
}

export function repList(user, ind, repImages, currentDayNumber, currentMonth) {
  const times = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:00 PM', '5:30 PM'];
  return `
  <li class="relative flex space-x-6 py-6 xl:static hover:bg-gray-500 cursor-pointer btn--rep">
      <img
        src="${repImages[ind]}"
        alt=""
        class="h-14 w-14 flex-none rounded-full rep--image"/>
      <div class="flex-auto">
        <h3 class="pr-10 font-semibold text-white xl:pr-0 rep--full--name">
          ${user.firstName} ${user.lastName}
        </h3>
        <dl class="mt-2 flex flex-col text-white xl:flex-row">
          <div class="flex items-start space-x-3">
            <dt class="mt-0.5">
              <span class="sr-only">Date</span>
              <svg class="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0
                    0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69
                    0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clip-rule="evenodd"/>
              </svg>
            </dt>
            <dd>
              <time><span class="font-semibold">Next available: </span><span class="ml-2">${currentMonth} ${currentDayNumber}, at ${times.random()}</span></time>
            </dd>
          </div>
          <div class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
            <dt class="mt-0.5">
              <span class="sr-only">Location</span>
              <svg class="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741
                    0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7
                    0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0
                    00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clip-rule="evenodd"/>
              </svg>
            </dt>
            <dd>Remote</dd>
          </div>
        </dl>
      </div>
    </li>
    `;
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
