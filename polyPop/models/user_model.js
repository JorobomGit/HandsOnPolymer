'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    password: String
});


userSchema.statics.list = function(req, cb) {
    var filtro = {};
    if(req.query.id!=undefined){
        filtro['_id'] = req.query.id;
    }
    if(req.query.name!=undefined){
        filtro['name'] = req.query.name;
    }
    console.log("Filtro: ", filtro);
    var query = User.find(filtro);
    var sort = req.query.sort || 'name';
    query.sort(sort);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var User = mongoose.model('User', userSchema);
