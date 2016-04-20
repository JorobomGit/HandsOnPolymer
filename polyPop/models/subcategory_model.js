'use strict';

var mongoose = require('mongoose');

var subcategorySchema = mongoose.Schema({
    name: String,
    items: Array
});


subcategorySchema.statics.list = function(req, cb) {
    var filtro = {};
    var query = Subcategory.find(filtro);
    var sort = req.query.sort || 'name';
    query.sort([[sort, 'descending']]);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Subcategory = mongoose.model('Subcategory', subcategorySchema);