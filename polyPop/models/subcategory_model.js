'use strict';

var mongoose = require('mongoose');

var subcategorySchema = mongoose.Schema({
    name: String,
    items: Array
});


subcategorySchema.statics.list = function(req, cb) {
    var filtro = {};
    if (req.params.subFlag == 1) {
        /*Buscamos por subcategorias con OR*/
        filtro['$or'] = [];        
        for(var i=0; i<req.params.subcategories.length; i++){            
            var aux = {
                name: req.params.subcategories[i]
            }
            filtro['$or'].push(aux);
        }
    }
    var query = Subcategory.find(filtro);
    var sort = req.query.sort || 'name';
    query.sort([
        [sort, 'descending']
    ]);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Subcategory = mongoose.model('Subcategory', subcategorySchema);
