
const Memcached = require("memcached");

const memcached = new Memcached("127.0.0.1:11211");

const memcachedMiddleware = duration => (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  memcached.get(key, (err, data) => {
    if (data) {
      res.send(data);
      return;
    }
    res.sendResponse = res.send;
    res.send = (body) => {
      memcached.set(key, body, (duration * 60), (err) => {
        //
      });
      res.sendResponse(body);
    };
    next();
  });
};


module.exports = memcachedMiddleware;
