'use strict';

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    name: String,
    picture: String,
    price: Number
});


itemSchema.statics.list = function(req, cb) {
    var filtro = {};
    var query = Item.find(filtro);
    var sort = req.query.sort || 'name';
    query.sort([[sort, 'descending']]);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Item = mongoose.model('Item', itemSchema);
