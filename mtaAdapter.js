const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

module.exports = (() => {
  const mtaKey = process.env.MTA_KEY;

  const getRealTimeFeed = feedId => {
    return fetch(
      `http://datamine.mta.info/mta_esi.php?key=${mtaKey}&feed_id=${feedId}`
    )
      .then(r => r.buffer())
      .then(data => GtfsRealtimeBindings.FeedMessage.decode(data));
  };

  return {
    getRealTimeFeed
  };
})();
