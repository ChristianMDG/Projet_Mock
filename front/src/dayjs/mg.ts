import dayjs from 'dayjs';

const mg = {
  name: 'mg',
  weekdays: ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Asabotsy'],
  weekdaysShort: ['Alah', 'Alat', 'Tal', 'Alar', 'Alak', 'Zom', 'Asab'],
  weekdaysMin: ['Ah', 'At', 'Ta', 'Ar', 'Ak', 'Zo', 'As'],
  months: [
    'Janoary',
    'Febroary',
    'Martsa',
    'Aprily',
    'Mey',
    'Jona',
    'Jolay',
    'Aogositra',
    'Septambra',
    'Oktobra',
    'Novambra',
    'Desambra',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mey', 'Jon', 'Jol', 'Aog', 'Sep', 'Okt', 'Nov', 'Des'],
  ordinal: function (number: number) {
    return `faha-${number}`;
  },
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: "ao aorian'ny %s",
    past: '%s lasa izay',
    s: 'segondra vitsivitsy',
    m: 'iray minitra',
    mm: 'minitra %d',
    h: 'iray ora',
    hh: 'ora %d',
    d: 'iray andro',
    dd: 'andro %d',
    M: 'iray volana',
    MM: 'volana %d',
    y: 'iray taona',
    yy: 'taona %d',
  },
  meridiem: function (hour: number) {
    return hour < 12 ? 'AM' : 'PM';
  },
};

dayjs.locale('mg', mg, true);

export default mg;
