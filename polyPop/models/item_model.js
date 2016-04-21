'use strict';

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    name: String,
    picture: String,
    price: Number
});


itemSchema.statics.list = function(req, cb) {
    var filtro = {};
    if (req.params.itemFlag == 1) {
        /*Buscamos por subcategorias con OR*/
        filtro['$or'] = [];        
        for(var i=0; i<req.params.items.length; i++){            
            var aux = {
                name: req.params.items[i]
            }
            filtro['$or'].push(aux);
        }
    }
    var query = Item.find(filtro);
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


var Item = mongoose.model('Item', itemSchema);
