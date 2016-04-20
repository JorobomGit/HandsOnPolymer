'use strict';

//Que borre las tablas y cargue anuncios, y algún usuario.
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');

var crypto = require('crypto');
/* Connect to the DB */
mongoose.connect('mongodb://localhost/polyPop', function() {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase(function() {
        //Cuando elimine la base de datos llama al cb
        mongoose.connection.close(function() {
            //Cuando cierre conexion en el cb la reabrimos con los datos cargados.
            mongoose.connect('mongodb://localhost/polyPop');
            require('./models/user_model');
            require('./models/category_model');
            require('./models/subcategory_model');
            require('./models/item_model');


            insertCategoriesJSON()
                .then(
                    function() {
                        console.log('Llega1');
                        return insertSubcategoriesJSON();
                    })
                .then(
                    function() {
                        console.log('Llega2');
                        return insertItemsJSON();
                    })
                .then(
                    function() {
                        console.log('Llega3');
                        return insertUsersJSON();
                    })
                .then(
                    function() {
                        console.log('Final');
                        mongoose.connection.close();
                    })
        });
    });
});


function insertCategoriesJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var Category = mongoose.model('Category');
        if (fs.existsSync('./categories.json')) {
            var parsedJSON = require('./categories.json');
            async.eachSeries(parsedJSON.categories,
                function(item, siguiente) {
                    var category = new Category(item);
                    category.save(function(err, category) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', category);
                        siguiente();
                    })
                },
                function() {
                    resolve();
                });
        } else {
            console.log('El fichero categories.json no existe');
            resolve();
        }
    });
}

function insertSubcategoriesJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var Subcategory = mongoose.model('Subcategory');
        if (fs.existsSync('./subcategories.json')) {
            var parsedJSON = require('./subcategories.json');
            async.eachSeries(parsedJSON.subcategories,
                function(item, siguiente) {
                    var subcategory = new Subcategory(item);
                    subcategory.save(function(err, subcategory) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', subcategory);
                        siguiente();
                    })
                },
                function() {
                    resolve();
                });
        } else {
            console.log('El fichero subcategories.json no existe');
            resolve();
        }
    });
}

function insertItemsJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var Item = mongoose.model('Item');
        if (fs.existsSync('./items.json')) {
            var parsedJSON = require('./items.json');
            async.eachSeries(parsedJSON.items,
                function(item, siguiente) {
                    var item = new Item(item);
                    item.save(function(err, item) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', item);
                        siguiente();
                    })
                },
                function() {
                    resolve();
                });
        } else {
            console.log('El fichero items.json no existe');
            resolve();
        }
    });
}


function insertUsersJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var User = mongoose.model('User');
        if (fs.existsSync('./users.json')) {
            var parsedJSON = require('./users.json');
            async.eachSeries(parsedJSON.users,
                function(item, siguiente) {
                    /*Hashing*/
                    item['password'] = crypto.createHmac('sha256', item['password'])
                        .digest('hex');
                    var user = new User(item);
                    user.save(function(err, user) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', user);
                        siguiente();
                    })
                },
                function() {
                    console.log("Y resuelve");
                    resolve();
                });
        } else {
            console.log('El fichero users.json no existe');
            resolve();
        }
    });
}
