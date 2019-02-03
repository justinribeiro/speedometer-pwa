'use strict';

/** @enum {number} */
const readoutUnits = {
  mph: 2.23694,
  kmh: 3.6
};

/** @const */
const appOpts = {
  dom: {
    body: document.querySelector('body'),
    start: document.querySelector('#start'),
    readout: document.querySelector('#readout'),
    showMph: document.querySelector('#show-mph'),
    showKmh: document.querySelector('#show-kmh'),
  },
  readoutUnit: readoutUnits.mph,
  watchId: null,
  wakeLock: null
};

document.querySelector('#show-mph').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.mph;
  updateReadoutButtons();
});

document.querySelector('#show-kmh').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.kmh;
  updateReadoutButtons();
});

document.querySelector('#start').addEventListener('click', (event) => {
  if (appOpts.watchId) {
    navigator.geolocation.clearWatch(appOpts.watchId);

    if (appOpts.wakeLock) {
      appOpts.wakeLock.cancel();
    }

    appOpts.watchId = null;
  } else {
    const options = {
      enableHighAccuracy: true
    };
    appOpts.watchId = navigator.geolocation.watchPosition(parsePosition,
      null, options);
    startWakeLock();
  }
  updateStartButton();
});

const updateStartButton = () => {
  appOpts.dom.start.classList.toggle('selected', !!appOpts.watchId);
  appOpts.dom.start.textContent = (appOpts.watchId ? '🛑 Stop' : '🔑 Start');
};

const updateReadoutButtons = () => {
  const isMph = (appOpts.readoutUnit == readoutUnits.mph);
  appOpts.dom.showKmh.classList.toggle('selected', !isMph);
  appOpts.dom.showMph.classList.toggle('selected', isMph);
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
          appOpts.dom.body.classList.toggle('dark', (sensor.illuminance < 3));
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

const parsePosition = (position) => {
  appOpts.dom.readout.textContent = Math.round(
    position.coords.speed * appOpts.readoutUnit);
};

const startServiceWorker = () => {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  });
}

startAmbientSensor();
updateReadoutButtons();
updateStartButton();
startServiceWorker();
