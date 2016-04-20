'use strict';

var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    name: String,
    subcategories: Array,
    icon: String
});


categorySchema.statics.list = function(req, cb) {
    var filtro = {};
    var query = Category.find(filtro);
    var sort = req.query.sort || 'name';
    query.sort([[sort, 'descending']]);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Category = mongoose.model('Category', categorySchema);
