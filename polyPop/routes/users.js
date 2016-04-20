var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var crypto = require('crypto');


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

    User.list(req, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err });
        }
        /*No queremos devolver la contraseña
        De esta forma ningun usuario puede acceder a la contraseña de otro
        */
        for(var i=0; i<rows.length; i++){
            rows[i].password = undefined;
        }
        res.json({ result: true, rows: rows });
    });
});

/**
 * @api {post} /users Post User: Insert user into db
 * @apiVersion 1.0.0
 * @apiName PostUsers
 * @apiGroup Users
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
 * 
 * @apiError (Error 500) DBError Error Database
 * 
 * @apiErrorExample Error-Response-DB:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "result": "false",
 *        "err": "DBError"
 *     }
 */

router.post('/', function(req, res) {

    register(req)
        .then(function(user) {
            res.status(200).send(user); //Registro creado
        })
        .catch(function(err) {
            console.log(err);
            res.status(400).send(err); //Error al añadir registro
        })
});

/***************************************/
/*Nombre: registro**********************/
/*Descripcion: dado un nombre, email y */
/*clave, registra un usuario************/
/*Parametros:***************************/
/**Entrada:*****************************/
/***req: request del usuario************/
/**Salida:******************************/
/***Json con datos introducidos si OK***/
/***Texto indicando error si ERR********/
/***************************************/

function register(req) {
    var usuario = new User(req.body);
    var query = User.find(req.body);

    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var number = req.body.number;
    var favorites = req.body.favorites;

    console.log("Name: ", name);
    console.log("Password: ", password);
    console.log("Email: ", email);
    console.log("Number: ", number);
    console.log("Favorites: ", favorites);

    return new Promise(function(resolve, rejected) {
        validation(name, email, number)
            .then(
                function() {
                    console.log('salvando');
                    /*Hashing*/
                    req.body['password'] = crypto.createHmac('sha256', password)
                        .digest('hex');

                    var user = new User(req.body);
                    //Lo guardamos en la BD
                    user.save(function(err, newRow) {
                        if (err) {
                            return rejected(err);
                        }
                        return resolve(newRow);
                    });
                })
            .catch(
                function(err) {
                    console.log(err);
                    rejected(err);
                }
            );
    });
}

/***************************************/
/*Nombre: validacion********************/
/*Descripcion: dado un nombre y un email/
/*valida un usuario campo a campo*******/
/*Parametros:***************************/
/**Entrada:*****************************/
/***nombre: nombre del usuario**********/
/***email: email del usuario************/
/**Salida:******************************/
/***Promesa indicando resolve o rejected/
/***************************************/

function validation(name, email, number) {
    console.log('Name');
    return new Promise(function(resolve, rejected) {
        validateData('name', name)
            .then(
                function() {
                    console.log('Email');
                    return validateData('email', email);
                })
            .then(
                function() {
                    console.log('Number');
                    return validateData('number', number);
                })
            .then(
                function() {
                    console.log('Promise resolved');
                    resolve();
                }
            )
            .catch(
                function(err) {
                    console.log(err);
                    rejected(err);
                }
            )
    });

}


/***************************************/
/*Nombre: validarCampo******************/
/*Descripcion: dado un campo y su dato */
/*comprobamos que no exista en la BD****/
/*Parametros:***************************/
/**Entrada:*****************************/
/***campo: campo a buscar***************/
/***dato: dato a validar****************/
/**Salida:******************************/
/***Promesa indicando resolve o rejected/
/***************************************/
function validateData(campo, dato) {
    return new Promise(function(resolve, rejected) {
        var filtro = {};
        filtro[campo] = dato;

        var query = User.find(filtro);
        query.exec(function(err, rows) {
            if (err) {
                console.log(err)
                return rejected(err);
            }
            //Comprobamos que no hemos obtenido resultados
            if (rows.length > 0) {
                console.log('Data already exists');
                console.log(dato);
                error = 'Data already exists: ' + dato;
                return rejected(error);
            }
            console.log('Correct data!');
            resolve();
        });
    });
}


//Actualizar un user
router.put('/', function(req, res) {
    var user = new User(req.body);
    User.update({ _id: req.body._id }, { $set: user },
        function(err, data) {
            if (err) return res.json({ result: false, err: err });
            res.json({ result: true, row: data });
        });
});

module.exports = router;
