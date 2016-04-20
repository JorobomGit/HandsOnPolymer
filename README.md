<pre>
    __   ___   _____  _____   ___    ___  ____    ___   ____  
   /  ] /   \ |     ||     | /  _]  /  _]|    \  /   \ |    \ 
  /  / Y     Y|   __j|   __j/  [_  /  [_ |  o  )Y     Y|  o  )
 /  /  |  O  ||  l_  |  l_ Y    _]Y    _]|   _/ |  O  ||   _/ 
/   \_ |     ||   _] |   _]|   [_ |   [_ |  |   |     ||  |   
\     |l     !|  T   |  T  |     T|     T|  |   l     !|  |   
 \____j \___/ l__j   l__j  l_____jl_____jl__j    \___/ l__j   
                                                                  
</pre>

##Web Application with coffee shops near you.
###Server uses express in order to follow MVC basic pattern.

###To start server: 

 1 Run startMongo.bat to start Mongo server
```
startMongo
```
 2 cd server
```
cd server
```
 3 Install dependencies with npm
```
npm install
```
 4 npm run InstallDB (opcional). Para inicializar base de datos
```
npm run installDB
```
 5 Para generar documentación: npm run apidoc
```
npm run apidoc
```
 6 nodemon para ejecutar nuestra aplicación
```
nodemon
```


###Instrucciones de Uso:

* Ver anuncios (deberemos autenticarnos): 
	```
	localhost:3000/anuncios/
	```
* Ver etiquetas de anuncios:
	```
	localhost:3000/anuncios/tags
	```
* Ver usuarios:
	```
	localhost:3000/usuarios/
	```

* Ejemplo filtrado anuncios:
	```
	http://localhost:3000/anuncios?tag=mobile&venta=false&nombre=ip&precio=50&start=0&limit=2&sort=precio
	```

* Insertar usuario:
	```
	POST a localhost:3000/usuarios/
	```
* Insertar anuncio:
	```
	POST a localhost:3000/anuncios/
	```

* Ver documentación
	```
	localhost:3000/apidoc/
	```


## Changelog

### v.1.0.0 - 2016-03-18

* Implementación base de datos con Mongo.
* Node básico con express.
* Script InstallDB asíncrono con promesas.
* Iniciación en Apidoc.
* Introducción de usuarios y anuncios.
* Añadido filtrado, paginación y ordenación.
* Registro.
* Autenticación.
* Hashing
* Muestra de tags
* Vistas simples

