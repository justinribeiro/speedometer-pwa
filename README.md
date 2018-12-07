# speedometer-pwa
A tiny no-frills speedometer progressive web app based on Geolocation API and AmbientLightSensor API.

![test-drive-into-wall](https://user-images.githubusercontent.com/643503/49669717-0fbc7180-fa17-11e8-84a3-17c74c2d87a1.jpg)

## Why?

Because the Combination Meter on my 2005 Prius is on the fritz, and I need a speedometer until I can tear apart and repair the faulty caps. :-)

## How it works

The [GeoLocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation) has a `Position` interface, which contains a `Coordinates` object, `coords`. This `Coordinates` interface contains not only things you might expect (latitude, longitude), but also contains a property called `speed`, which is represents the device velocity in meters per second. Fun fact, Chrome on Android returns this prop with very little effort, at which point it's just a matter of some quick math to do the mph/kmh conversion.

## Night mode

I implemented [AmbientLightSensor API](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor) to enable a dark mode while driving at night. To get this working in Chrome on Android you have to enable Generic Sensor extra classes, which is behind a flag: chrome://flags#enable-generic-sensor-extra-classes

![20181207-day-night-mode](https://user-images.githubusercontent.com/643503/49672919-8c544d80-fa21-11e8-9f2c-80b1d582b21c.png)

## Dev

Hop into the `src` folder and run the local web server of your choice. No specific tool required.

## Build

I didn't really wrap this with build tooling, but I did crunch it down to 1.7K gzip'ed for fun using closure compiler and http-minifier. The rest is just some fancy Linux CLI jumping and sed (and I almost just used a make file instead ;-).

```
$ yarn install
$ yarn dist
```

### FAQ

> 1. How accurate is this?

When the dash is working on the Prius, it's pretty accurate from the looks of it. You're going to be constainted on any number of know problems with GPS (e.g., when the `Coordinates.accuracy` is not very good because of lock or assist issues).

> 2. Why didn't you use build tools/a framework/something I like.

Didn't feel the need.

> 3. Couldn't you have done this with the Generic Sensors API and the accelerometer?

Yeah, probably.