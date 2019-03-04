Promise = require('bluebird');
mysql = require('mysql');
DBF=require('./dbf-setup.js');


var getButtons=function(){//Returns a promise that contains the buttons as a result of a sql query
    var sql = "select * from dataGangstas.invPrices";
    return DBF.query(mysql.format(sql)); //Return a promise
};


exports.buttons= getButtons().then(DBF.releaseDBF).catch(function(err){console.log("DANGER:",err)});