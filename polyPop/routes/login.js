var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var crypto = require('crypto');


/**
 * @api {post} /coffee Post Login: Check Login
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Login
 *
 * @apiSuccess {String} id  User id (unique).
 * @apiSuccess {String} name  User name.
 * @apiSuccess {String} password User password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "name": "Jonny",
 *       "password": "gergdfgsdger"
 *     }
 *
 * 
 * @apiError (Error 401) Auth Errror
 * 
 * @apiErrorExample Error-:
 *     HTTP/1.1 401 Auth Error
 *     {
 *        "result": "false",
 *        "err": "DBError"
 *     }
 */

router.post('/', function(req, res) {


    console.log("Body: ", req.body);
    console.log("Nombre: ", req.body.name);
    console.log("Password: ", req.body.password);

    var username = req.body.name;
    var password = req.body.password;

    /*Con el nombre y contraseña respondemos al cliente si se ha logeado con exito*/
    //Realizamos un find para ver si concuerda
    var filter = {};
    filter['name'] = username;

    console.log(password);
    var hash = crypto.createHmac('sha256', password)
        .digest('hex');
        console.log(hash);
    filter['password'] = hash;

    var query = User.find(filter);

    query.exec(function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
        //Comprobamos que no hemos obtenido resultados
        if (rows.length == 0) {
            console.log('Login incorrecto');
            res.sendStatus(401);
            return;
        }
        console.log('Login Correcto');
        res.status(200).send(rows);
    });
    return;
});

module.exports = router;
