var credentials = require('../credentials.json');

var mysql=require("mysql");
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

credentials.host="ids";
var connection = mysql.createConnection(credentials);

var pool=mysql.createPool(credentials); //Setup the pool using our credentials.

var getConnection=function(){
    return pool.getConnectionAsync().disposer(
        function(connection){return connection.release();}
    );
};
var query=function(command){ //SQL comes in and a promise comes out.
    return using(getConnection(),function(connection){
        return connection.queryAsync(command);
    });
};

// end the pool without losing our results
var endPool=function(results){
    pool.end(function(err){});
    return results;
};

exports.query = query;
exports.releaseDBF=endPool;