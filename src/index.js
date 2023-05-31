'use strict';

/** @enum {number} */
const readoutUnits = {
  watt: 0,
  kmh: 3.6
};

// Opgeslagen waarden voor A, B en n.
const A = 34.82;
const B = 4.01;
const n = 8;

/** @const */
const appOpts = {
  dom: {
    body: document.querySelector('body'),
    start: document.querySelector('#start'),
    readout: document.querySelector('#readout'),
    history: document.querySelector('#history'),
    showMph: document.querySelector('#show-mph'),
    showKmh: document.querySelector('#show-kmh'),
  },
  readoutUnit: readoutUnits.mph,
  watchId: null,
  wakeLock: null,
  speedHistory: []
};

document.querySelector('#show-watt').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.watt;
  if (!appOpts.dom.showWatt.classList.contains('selected')) {
    toggleReadoutButtons();
  }
});

document.querySelector('#show-kmh').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.kmh;
  if (!appOpts.dom.showKmh.classList.contains('selected')) {
    toggleReadoutButtons();
  }
});

document.querySelector('#start').addEventListener('click', (event) => {
  if (appOpts.watchId) {
    navigator.geolocation.clearWatch(appOpts.watchId);

    if (appOpts.wakeLock) {
      appOpts.wakeLock.cancel();
    }

    appOpts.watchId = null;
    appOpts.dom.start.textContent = '🔑 Start';
    appOpts.dom.start.classList.toggle('selected');
  } else {
    const options = {
      enableHighAccuracy: true
    };
    appOpts.watchId = navigator.geolocation.watchPosition(parsePosition,
      null, options);
    startWakeLock();

    appOpts.dom.start.textContent = '🛑 Stop';
    appOpts.dom.start.classList.toggle('selected');
  }
});

const toggleReadoutButtons = () => {
  appOpts.dom.showKmh.classList.toggle('selected');
  appOpts.dom.showMph.classList.toggle('selected');
};

const startAmbientSensor = () => {
  if ('AmbientLightSensor' in window) {
    navigator.permissions.query({ name: 'ambient-light-sensor' })
      .then(result => {
        if (result.state === 'denied') {
          return;
        }
        const sensor = new AmbientLightSensor({frequency: 0.25});
        sensor.addEventListener('reading', () => {
          if (sensor['illuminance'] < 3 && !appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          } else if (sensor['illuminance'] > 3 && appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          };
        });
        sensor.start();
    });
  }
}

const startWakeLock = () => {
  try {
    navigator.getWakeLock("screen").then((wakeLock) => {
      appOpts.wakeLock = wakeLock.createRequest();
    });
  } catch(error) {
    // no experimental wake lock api build
  }
}

const calculateP = (v) => {
  const A = 34.82;
  const B = 4.01;
  const n = 8;

  const Cw = A / (1 - Math.pow((v / B), 2));
  const P = Math.pow(v, 3) * Cw / n;

  return P;
};

const parsePosition = (position) => {
  let output;
  if (appOpts.readoutUnit === readoutUnits.watt) {
    const v = position.coords.speed;
    const Cw = A / (1 - (v / B)**2);
    output = v**3 * Cw / n;
  } else {
    output = position.coords.speed * appOpts.readoutUnit;
  }
  appOpts.dom.readout.textContent = Math.round(output);
};

const calculateAverageSpeed = (speeds) => {
  const sum = speeds.reduce((acc, val) => acc + val, 0);
  const average = sum / speeds.length;
  return average;
};

const startServiceWorker = () => {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  });
}

startAmbientSensor();
startServiceWorker();
