require("dotenv").config();

const WebSocket = require("ws");
const fetch = require("node-fetch");

const util = require("util");

const { timer, Subject, from } = require("rxjs");
const { scan, tap, multicast, mergeMap } = require("rxjs/operators");

const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

// mta things
const mtaKey = process.env.MTA_KEY;
// fetch to the real time feed
const feedId = 16; // N/R/W

fetch(`http://datamine.mta.info/mta_esi.php?key=${mtaKey}&feed_id=${feedId}`)
  .then(r => r.buffer())
  .then(data => GtfsRealtimeBindings.FeedMessage.decode(data))
  .then(parsed =>
    console.log(util.inspect(parsed.entity, { showHidden: false, depth: null }))
  );

// const Mta = require("mta-gtfs");
// const mta = new Mta({
//   key: mtaKey
// });

// mta.schedule(635, 1).then(function(result) {
//   console.log(result.schedule["635"]["N"]);
// });

// // every 60 seconds, get some data from subway API
// const apiTicker = timer(0, 60000).pipe(
//   mergeMap(() => from(mta.status("subway")))
// );

// // scan (reduce)
// // const ticksCount = apiTicker.pipe(scan((count, n) => count + 1, 0));

// // multicast same stream to all subscribers
// const multicastTicks = apiTicker.pipe(multicast(() => new Subject()));

// const server = new WebSocket.Server({ port: 3210 });

// server.on("connection", ws => {
//   console.log("connected");
//   let multiConnect;
//   multiConnect = multiConnect || multicastTicks.connect(); // setup connection to multicast stream

//   multicastTicks.subscribe(data => {
//     console.log(data);
//     ws.send(data);
//   });
// });
