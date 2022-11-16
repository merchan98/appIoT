# appIoT

## Descricpcion del proyecto
Este proyecto tiene como objetivo realizar una propuesta de una plataforma IoT (Internet of Things) para la recopilación, el procesamiento, la visualización de datos y la gestión de dispositivos, para ello hace uso de distintas teconologias como MQTT, Nodejs o docker. Este el prototipo desarrollado como proyecto de fin de grado.

## Stack utilizado

El stack que se ha sequido a sido Nuxtjs para el front-end, express para la API, EMQX para el broker y MongoDb como SGBD. Para modularizarlo se ha usado docker, las intruciones para utilizarlo se pueden ver mas abajo.

## Build Setup
Para poner a funcionar la plataforma de forma local, basta con ver los pasos de abajo junto con el docker-compose modificado quitando las dependencias de node y modificado la IPs del protyecto.

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

#launch mongo and EMQX
$ ./Docker/docker-compose up
```
Si se opta por hacerlo de manera completa en docker, el docker-compose esta preparado para ejcuar la app con el comando docker-compose up dendero de la carpeta Doker del proyecto. Aún asi se sigue necesitando modificar las IPs del proyecto por las del servidor o ordenador que lo ejecute.


