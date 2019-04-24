/**
 * Cache.js
 * This is the cache configuration file
 */


const flatCache = require("flat-cache");
const path = require("path");

const cache = flatCache.load("cache", path.resolve("./cache"));

const flatCacheMiddleware = (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  const cacheContent = cache.getKey(key);
  if (cacheContent) {
    res.send(cacheContent);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.setKey(key, body);
      cache.save();
      res.sendResponse(body);
    };
    next();
  }
  // cache.removeKey(key);
};

module.exports = flatCacheMiddleware;
