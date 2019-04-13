
const Memcached = require('memcached');

let memcached = new Memcached("127.0.0.1:11211")

    let memcachedMiddleware = (duration) => {
        return  (req,res,next) => {
        let key = "__express__" + req.originalUrl || req.url;
        memcached.get(key, function(err,data){
            if(data){
                res.send(data);
                return;
            }else{
                res.sendResponse = res.send;
                res.send = (body) => {
                    memcached.set(key, body, (duration*60), function(err){
                        // 
                    });
                    res.sendResponse(body);
                }
                next();
            }
        });
    }
    };


    module.exports = memcachedMiddleware;