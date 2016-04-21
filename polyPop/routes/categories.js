var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Subcategory = mongoose.model('Subcategory');

var crypto = require('crypto');


router.get('/category/:name', function(req, res) {
    console.log(req.params.name);
    /*Teniendo el nombre de la categoria, obtenemos listado de subcategorías*/
    Category.list(req, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err });
        }

        /*En este punto, tenemos rows con las subcategorias*/
        /*Ahora queremos devolver todas las subcategorias con sus items*/
        var req_aux = req;
        req_aux.params['subFlag'] = 1;
        req_aux.params['subcategories'] = rows[0].subcategories;

        Subcategory.list(req_aux, function(err, rows2){
            if (err){
                return res.json({ result: false, err: err});
            }
            res.json({ result: true, rows: rows2 });
        })
    });
});


/**
 * @api {get} /users Get Users: Gets users from db.
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 *
 * @apiSuccess {String} id  User id (unique).
 * @apiSuccess {String} name  User name (unique).
 * @apiSuccess {String} password   User password.
 * @apiSuccess {String} email  User email (unique).
 * @apiSuccess {String} number User phone number (unique).
 * @apiSuccess {Array[Number]} favorites   User array of favorite coffees id's.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "name": "Smith",
 *       "password": "e2bd05dfa68d1b2fa5deabc4a9b37c311be54d2cb0fc540d819847db66d76a28",
 *       "email": "smith@matrix.com",
 *       "number": "666666665",
 *       "favorites": "[1,7,9,10]"
 *     }
 *
 * @apiError (Error 500) DBError Database error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "result": "false",
 *        "err": "DBError"
 *     }
 */
router.get('/', function(req, res) {

    Category.list(req, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err });
        }
        res.json({ result: true, rows: rows });
    });
});


module.exports = router;
