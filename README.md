# API REST MUTATION
### Este es un api-rest para la consulta de mutaciones de cadenas de ADN.
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
## Instalación
Para instalar este proyecto, primero hacer un clone:
```
git clone https://github.com/tecnomanu/api-rest-mutation
```

### Paquetes
Instalar los paquetes basicos que requieren el proyecto para:
```
cd api-rest-mutation
npm install
```

### Valores de enviroment
Renombre el archivo ```.env.example```por ```.env``` y cambie los valores de puerto o ip de ser necesario.
(Se recomienda mantener por defecto)

```
NODE_ENV=development
IP=127.0.0.1
HTTP_PORT=3000
```

### Correr el servidor
Por utlimo podemos iniciar el servidor con este comando:
```
node start.js
```


## End-points
### hasMutation
Realiza un analisis de mutuación de una cadena de ADN
```
http://127.0.0.1/mutation
```

Valores permitidos:
```
{
    dna: [ "AAAAAA", "AAAAAA", "AAAAAA", "AAAAAA", "AAAAAA", "AAAAAA"]
}
```

Retorno si tiene mutación:
````
{
    "error": false,
    "code": 200,
    "message": "it´s had mutation"
}
````

Retorno si no tiene mutación:
````
{
    "error": false,
    "code": 403,
    "message": "Had not mutation"
}
````

### Stats
Retorna las estadisticas respecto a las pruebas realizadas hasta el momento
```
http://127.0.0.1/stats
```
Retorno:
````
{
    "count_mutations": X,
    "count_no_mutation": Y,
    "ratio": X/Y
}
````

## Errores
En caso de tener un error, el sistema retornará estos dos formatos:

### Error de Respuesta:
```
{
    "error": true,
    "code": STATUS_CODE,
    "message": MESSAGE_ERROR
}
```

### Error interno:
```
{
    "error": true,
    "code": 500,
    "message": INTERNAL_MESSAGE_ERROR
}
```