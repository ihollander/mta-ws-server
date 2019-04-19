require("dotenv").config();

const WebSocket = require("ws");
const util = require("util");

const mtaAdapter = require("./mtaAdapter");

const { timer, Subject, from } = require("rxjs");
const { map, multicast, mergeMap } = require("rxjs/operators");

// every 60 seconds, get some data from subway API
const apiTicker = timer(0, 60000).pipe(
  mergeMap(() => from(mtaAdapter.getRealTimeFeed(16))),
  map(data =>
    // process the data
    data.entity
      .filter(trip => trip.trip_update)
      .map(trip => ({
        id: trip.id,
        train: trip.trip_update.trip.route_id,
        stops: trip.trip_update.stop_time_update.map(stop => ({
          stopId: stop.stop_id,
          time: stop.arrival.time.low * 1000
        }))
      }))
  )
);

// scan (reduce)
// const ticksCount = apiTicker.pipe(scan((count, n) => count + 1, 0));

// multicast same stream to all subscribers
const multicastTicks = apiTicker.pipe(multicast(() => new Subject()));

const server = new WebSocket.Server({ port: 3210 });
server.on("connection", ws => {
  console.log("connected");
  let multiConnect;
  multiConnect = multiConnect || multicastTicks.connect(); // setup connection to multicast stream
  // send data on initial connection??

  // send data at regular intervals
  const subscription = multicastTicks.subscribe(entity => {
    console.log("data received");
    ws.send(JSON.stringify(entity));
  });

  ws.on("close", () => {
    subscription.unsubscribe();
  });
});
