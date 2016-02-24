WebApp is an example of a generic web application with React and Redux.

Features

* Babel 6
* React
* React-router
* Redux
* Webpack
* Isomorphic (universal) rendering
* Hot reload (aka Hot Module Replacement) for React components, Redux reducers, Redux action creators, translated messages
* Internationalization with React-intl
* User authentication (JSON Web Token) & authorization (roles)
* REST API
* SQL ORM (PostgreSQL + Bookshelf)
* MongoDB
* Microservice architecture
* Responsive web design
* Works both with Javascript enabled and disabled (suitable for DarkNet purposes)
* Koa
* Bunyan logging (log file rotation is built-in)
* Correctly handles Http Cookies on the server-side
* To be done: GraphQL + Relay
* To be done: native Node.js clustering
* // maybe: Protection against Cross Site Request Forgery attacks

Quick Start
===========

* `npm install`
* `npm run dev`
* wait for it to finish the build (green stats will appear in the terminal, and it will say "Now go to http://127.0.0.1:3000")
* go to `http://127.0.0.1:3000`
* interact with the development version of the web application
* `Ctrl + C`
* `npm run production`
* wait a bit for Webpack to finish the build (green stats will appear in the terminal, plus some `node.js` server running commands)
* go to `http://127.0.0.1:3000`
* interact with the production version of the web application

Installation
============

```sh
npm install
```

Configuration
=============

One can configure this application through creation of `configuration.js` file in the root folder (use `configuration.defaults.js` file as a reference).

All the options set in that file will overwrite the corresponding options set in `configuration.defaults.js` file.

Running (in development)
========================

```sh
npm run dev
```

After it finishes loading go to `http://127.0.0.1:3000`

(the web page will refresh automatically when you save your changes)

localhost vs 127.0.0.1
======================

On my Windows machine in Google Chrome I get very slow Ajax requests.

That's a strange bug related to Windows and Google Chrome [discussed on StackOverflow](http://stackoverflow.com/questions/28762402/ajax-query-weird-delay-between-dns-lookup-and-initial-connection-on-chrome-but-n/35187876)

To workaround this bug I'm using `127.0.0.1` instead of `localhost` in the web browser.

Architecture
============

The application consists of microservices

  * `web-server` is the gateway (serves static files and proxies to all the other microservices)
  * `page-server` renders web pages on the server side (using [react-isomorphic-render](https://github.com/halt-hammerzeit/react-isomorphic-render))
  * `authentication-service` handles user authentication (sign in, sign out, register) and auditing (keeps a list of user sessions and traces latest activity time)
  * `password-service` performs password hashing and checking (these operations are lengthy and CPU-intensive)
  * `api-service` provides some generic Http REST Api
  * `image-server` (will be split into `storage-server` and `image-service`) resized uploaded images
  * `log-service` aggregates logs from all the other services

<!-- 
Running in production (to be done)
====================

./automation/start.sh

./automation/stop.sh

Сгенерировать скрипт автозапуска на сервере:

./automation/start.sh

pm2 startup

pm2 save

https://github.com/Unitech/pm2

Посмотреть статус процесса: 

pm2 list

Мониторинг процесса: 

pm2 monit

Посмотреть логи:

pm2 logs webapp

Возможна кластеризация, безостановочное самообновление и т.п.
 -->

<!-- Redis
=====

The application will run without Redis but user authenication will only work in demo mode.

To enable full support for user authentication Redis must be installed for storing user sessions.

After installing Redis edit the configuration.js file accordingly

```javascript
redis:
{
	host     : 'localhost',
	port     : 6379,
	// password : '...' // is optional
}
```

To secure Redis from outside intrusion set up your operating system firewall accordingly. Also a password can be set and tunneling through an SSL proxy can be set up between the microservices. Also Redis should be run as an unprivileged `redis` user.
 -->

Security
========

The application should be run as an unprivileged user.

When switching to TLS will be made all cookies should be recreated (`{ secure: true }` option will be set on them automatically upon Https detection when they are recreated).

Image Server
============

In order to be able to upload pictures ImageMagic is required to be installed

https://github.com/elad/node-imagemagick-native#installation-windows

http://www.imagemagick.org/script/binary-releases.php

<!-- Then it should be configured in your `configuration.js` file

```javascript
imagemagic: true
``` -->

Redis
=====

This application can run in demo mode without Redis being installed.

If you want this application make use of Redis then you should install it

https://github.com/MSOpenTech/redis/releases

and configure it in your `configuration.js` file

```javascript
redis:
{
  host     : 'localhost',
  port     : 6379,
  password : ... // is optional
}
``` 

MongoDB
=======

This application can run in demo mode without MongoDB being installed.

If you want this application make use of MongoDB then you should install it and configure it in your `configuration.js` file

```javascript
mongodb:
{
  host     : 'localhost',
  port     : 27017,
  database : ...,
  user     : ...,
  password : ...
}
``` 

Setting up a freshly installed MongoDB

```sh
mongo --port 27017

use admin
db.createUser({
  user: "administrator",
  pwd: "[administrator-password]",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, { role: "dbAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" } ]
})

exit

# set "security.authorization" to "enabled" in your mongod.conf and restart MongoDB
```

```sh
mongo --port 27017 -u administrator -p [administrator-password] --authenticationDatabase admin

# mongo --eval "..."

use database
db.createUser({
  user: "user",
  pwd: "password",
  roles:
  [
    { role: "readWrite", db: "database" }
  ]
})

exit
```

One may also use [Robomongo](https://robomongo.org/download) (or [Mongo Management Studio Community Edition](http://www.litixsoft.de/english/mms/#pg-231-23), or [MongoChef](http://3t.io/mongochef/download/)) as an operational GUI for MongoDB.

PostgreSQL
==========

This application can run in demo mode without PostgreSQL being installed.

If you want this application make use of PostgreSQL then you should first install it.

(hypothetically MySQL and SQLite3 will also do but I haven't checked that since PostgreSQL is the most advanced open source SQL database nowadays)

To change the default PostgreSQL superuser password

```sh
sudo -u postgres psql
postgres=# \password postgres
```

Then create a new user in PostgreSQL and a new database. For example, in Linux terminal, using these commands

```sh
createuser --username=postgres --interactive USERNAME
createdb --username=USERNAME --encoding=utf8 --owner=USERNAME DATABASE_NAME --template=template0
```

Then create your `knexfile.js` file

```sh
npm run postgresql-knex-init
```

Then configure your `knexfile.js` file. An example of how it might look

```
module.exports = {
  client: 'postgresql',
  connection: {
    database: 'webapp',
    user:     'webapp',
    password: 'webapp'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
```

Then initialize PostgreSQL database

```sh
npm run postgresql-migrate
```

To rollback the latest PostgreSQL migration
```sh
npm run postgresql-rollback
```

Or one can alternatively drop the database and create it from scratch initializing it with the command given above.

PostgreSQL database migration points can be created using the following command
```sh
npm run postgresql-checkpoint -- migration_point_name
```

They are stored in the `migrations` folder.

Online status
=============

Each Http request to the server will update the user's latest activity time.

If a certain Http request is automated and shouldn't be interpreted as a user being online then this Http request URL should contain `bot=✓` parameter.

This works for GET requests, and I suppose it would work for POST requests too.

Troubleshooting
===============

#### Error: Invariant Violation: `mapStateToProps` must return an object. Instead received [object Promise]

This error is strange and is obscuring the source error. One may try `Ctrl + C` and `npm run dev` again.

To do
====================

сделать какую-нибудь миграцию для mongodb наподобие sql





если регистрация прошла, но не прошёл последующий sign_in, то никакой ошибки внизу не показывается



поменять String на Email в схеме пользователя MongoDB



превентивно валидировать email и пароль. (с фокусом) + на сервере (с ошибками и фокусом)

сделать ошибку "пользователь с таким именем уже зарегистрирован" (с фокусом на имени)


убрать Async и promisifyAll, если mongoose возвращает thennable


email сделать уникальным в mongodb (ensureIndex())




вычленить общий код из memory_store и mongodb_store в api methods

хранить пользователей в mongodb (и токены)



в react-router /user/profile изменить на /user/:id

сделать страницу профиля пользователя

проверить работу профиля пользователя как с postgresql, так и без неё
проверить работу профиля пользователя как с mongodb, так и без неё

проверить работу профиля с отключенным javascript'ом




при переключении языка - записывать язык в данные пользователя в бд, чтобы потом знать, на каком языке ему слать письма.





authentication-service пересадить на mongodb




клиентские ошибки отправлять на сервис типа log-service




встроить защиту от DoS: ввести специальный переключатель, принимающий запросы только от пользователей, и всем остальным выдающий статическую страницу (или не статическую, а нормальную). регистрация при этом отключается (с пояснительным текстом).

в конфигурации добавить параметр allowed_ips: [], с которых можно будет разрешать вход на сайт (wildcards) (по умолчанию, будет ['*.*.*.*']).

в мониторинге показывать самые долго выполняющиеся запросы с группировкой по пользователям.
(хранить данные в течение суток) — так можно будет засекать пользователей, которые досят, и замораживать их.

у замороженного пользователя ставить флажок frozen с датой и причиной блокировки. проверять этот флажок при /authenticate и /sign-in : если при вызове /authenticate выяснилось, что пользователь заблокирован, то не выполнять дальнейшие @preload()ы, и выдавать страницу с сообщением о блокировке (дата, причина). если пользователя нет при вызове /authenticate, то перенаправлять на страницу входа с сообщением о доступности только для пользователей.

при этом включателе, даже если web server не имеет флага authenticate:
если запрос идёт (common/web server), и нет токена в нём, то выдавать статус 401 (unauthenticated).
если есть токен, то должен быть вызван метод /verify-token, который при непрохождении вернёт статус 401 (unauthenticated).





в common/web server сделать monitoting middleware, у которой будет метод checkpoint(text),
и по завершении весь список чекпоинтов и их таймингов будет отправляться на monitoring service
(можно сделать IPC по UDP)



по каждому сервису, мониторить cpu load, ram.




monitoring-service:

сделать страницу мониторинга, которая будет показывать (для начала) время исполнения http запроса (common/web server) в таблице вида "сервис, url, время".

потом ещё сделать метрики отзывчивости event loop'а (процентили), и количество запросов в секунду.





мониторинг - показывать в меню только для роли 'administrator'
в мониторинге - логгировать время каждого запроса (оборачивать yield next())
показывать статус бекапа базы данных






имя пользователя - dropdown с пунктами "Профиль", "Уведомления", "Выйти"

если клик на имени пользователя при наличии <Badge/> - переход сразу в "Уведомления".

сделать компонент <Badge/> (взять из тех двух библиотек)





мобильное меню сделать с поддержкой pan на touchdown, как в materialize css





на странице мониторинга - количество зареганных пользователей + график, количество сессий + график





писать в лог файл все http запросы на web server, чтобы потом если что смотреть, какие дыры нашли




на личной странице пользователя ему одному сделать список IP, для которых есть remember me (мб страны, города), и когда была последняя активность по этим remember me. возможность разлогинивать сессии (уничтожение remember me из базы данных + вызов sign_out для сессии каким-то образом). отображать список текущих сессий (ip, города, страны) и время recent activity







В react-isomorphic-render мб перейти потом на async-props и react-router-redux, когда они стабилизируются со второй версией react-router'а








file-server -> storage-server 







при загрузке картинок:

jpg - ресайзы делать: 300x300, 600x600, 1000x1000, 1500x1500, 2100x2100, 2800x2800, 3600x3600, 4500x4500

если размер картинки меньше 1.1 * размер ресайза, то не делать ресайз

png - ресайзы как для jpg
svg - без ресайза

сделать ограничение на размер картинки - мегабайтов 10.

возможность добавлять картинку по url'у

имя ресайза: id@widthxheight.type

при upload-е выдавать ошибку "недостаточно места на диске", если свободного места меньше 5%, например.

ошибку реконнекта к лог сервису - выдавать в лог

буферить сообщения, если нету соединения к лог сервису



видео - mp4, webm; с первым кадром (ресайзы - как для jpg)
ограничение - мегабайтов 100

пока - только возможность добавлять video по url'у


message:
{
  text: '...',
  images: 
  [{
    id: '...',
    type: 'jpg',
    meta: ...,
    url: ..., // если добавлена по url'у
    sizes: 
    [{
      width: ...,
      height: ...,
      size: ...байтов
    }]
  }],
  videos:
  [{
    {
      id: '...',
      type: 'mp4',
      width: ...,
      height: ...,
      meta: ...,
      size: ...байтов,
      url: ..., // если добавлено по url'у
      preview: то же самое, что для картинки (без meta)
  }]
}









написать метод для api, проверяющий наличие аутентикации, и производящий её, если есть remember me cookie, и выдающий ошибку, если аутентикация по remember me не удалась






страницы пользователя: profile + history, feedback






Напоминания взять отсюда

http://materializecss.com/dialogs.html

(в showcase)





Увеличение фотографий

http://materializecss.com/media.html

(в showcase)











endless scroll в логах: выгрузка тех страниц, которые выходят за предел "показывать страниц", + url нормальный (с какой страницы показывать до + "показывать страниц")

на странице логов - фильтр по error, warning, info и т.п.

из log server - писать в MongoDB (опционально)

https://github.com/mafintosh/mongojs

на клиенте сделать log, посылающий всё в консоль, и заменить все console.log на log.info и console.error на log.error






сделать пользователей (регистрация + вход)

защитить логи на доступ только админу (раздел + на web server proxy делать только для админов)





сделать application settings get (языки (считывать имена файлов из папки), путь к картинкам) - в начале, перед показом страницы

языки оттуда подставлять в locale switcher

путь к картинкам подставлять из settings на странице пользователей





image server -> file upload server

image server: imagemagick

ресайз картинки сделать (2 размера: по клику и просто маленький)

добавлять расширение к имени файла

сделать ошибку "не удалось загрузить картинку" для пользователя (inline)

refresh тоже сделать с крутилкой

busy (uploading_picture, deleting, ...) - сделать индивидуальными для каждого id пользователя

создание пользователя сделать без диалога, инлайном
ошибку - тоже

/users -> /user_ids
/users сделать нормальным, и в action тоже

ошибку удаления и переименования (inline)

user: patch (rename)
add user: validation

крутилки на добавление, удаление, переименование, загрузку.








при вошедшем пользователе - проверить, что генерится страница нормально (то есть как бы работает вход на сервере при запросе страницы, даже если нету сессии, но есть "remember me")

remember me - хранить в базе данных, вместе с полем user_id

если происходит новый логин - добавлять новый remember me в базу (проверять по нескольким совпадение можно)

по каждой remember me писать дату последней активности




login_success чтобы перенаправляла на ту страницу, с которой входили





upload только при вошедшем пользователе (и ресайз тоже, и api тоже (не все методы - логин, например, публичен должен быть, и пинг, и настройки))






в showcase в форму добавить загрузку файла
отсылать её по API на сервер
+ валидацию формы сделать (вводимых значений, с inline ошибками)





перевести title страниц






сделать статические страницы (nginx) для status 500 (как web server, так и page server) и 503, 401, 403, 404







showcase: сабмит формы, чтобы она сохраняла в оперативку на сервере, и обновляла store на клиенте
(+ чтобы работала при обновлении страницы)

showcase form чтобы имел кнопку с валидацией и записью на сервере в оперативку, и получал бы с сервера





можно упаковывать каждый сервис в docker и как-то запускать это на Windows







в button.js сделать автопрефиксы

сделать перепосылку сообщений (с ID) при неполучении подтверждения

соединяться с log server, пока он не запустится (если отвалится, то пересоединяться)

вместо флага demo - entry в конфиге на redis, mongo, imagemagick
(если нету чего-то - выдавать баннер в логах с флагом warning)

вычленить dropdown, menu, menu-button в react-responsive-ui
зарелизить react-responsive-ui, с react и react-router - peerDependencies

сделать диалоговое окошко (и зарелизить в react-responsive-ui)

showcase элементов: dropdown, modal, ...

если нету imagemagick'а, то просто возвращать нересайженную картинку (npm run demo)

rotating log per worker

monitoring server, который будет принимать статистику по udp и писать в память или MongoDB

// мб в будущем: логи слать по ssl

// мб в будущем сделать можно загрузку более специфичного 'intl/locale-data/jsonp/ru-...'

мониторинг: image server (status, uptime, размер папки со временными файлами) и другие

сервер мониторинга с хранением в бд (пока в оперативе)

графики на d3

в меню сделать пункт Мониторинг

сделать возможность горячей замены image server'а (и других, (у web server'а хранить сессии в редисе для этого можно (если он установлен)))

// во время загрузки картинки - показывать выбранную картинку, уменьшенную, в обозревателе
(либо прямо через src, либо предварительно уменьшив), и тикать, как установка приложения в AppStore, пока не загрузится на сервер

// мб перейти на imagemagick-native, когда будет исправлен build
// https://github.com/elad/node-imagemagick-native/issues
// + потестить ресайз аватаров: чтобы выравнивало по центру как по ширине, так и по высоте

// можно сделать проверку на установленность image magic (необязательно)

сделать 4 страницы example: ram, database, graphql, graphql + database

чтобы работало без наличия postgresql (чтобы запусклось, и в API выдавало ошибку просто с показом на странице)

http://city41.github.io/bookends/




вставить в production build и в development rendering server run

{
  "plugins": ["react-intl"],
  "extra": {
    "react-intl": {
        "messagesDir": "./build/messages/",
        "enforceDescriptions": true
    }
  }
}


попробовать defineMessages as define_messages
(сработает ли в этом случае Babel plugin)







сделать showcase с drag n drop

https://github.com/gaearon/react-dnd




тикающие relative_time




В react-router сделать модульность (постепенную загрузку dependencies)




update-schema вызывать при изменении схемы Relay (nodemon)




graphiql в development mode

https://github.com/graphql/graphiql

localized routes

locale hot switch

https://github.com/gpbl/react-locale-hot-switch/

preload вызывается для всей цепочки (Layout, About) (автор пишет, что preload сам должен определять, нужно ли ему вызываться - на мой взгляд, не лучшее решение)

https://www.google.com/design/icons/

nodemon не watch'ит новые файлы

Долго рестартует web сервер после изменений - мб улучшить это как-то

// Мб перейти с bluebird на обычные Promises
// Пока bluebird лучше:
// http://programmers.stackexchange.com/questions/278778/why-are-native-es6-promises-slower-and-more-memory-intensive-than-bluebird
// к тому же, в bluebird есть обработчик ошибок по умолчанию; есть .cancel(); есть много разного удобного.

Мб использовать это:

https://github.com/obscene/Obscene-Layout

Скрипты установки сразу писать на чём-нибудь типа fabric мб (если он кроссплатформенный)

NginX

https://github.com/acdlite/redux-react-router


Рендеринг React'а вместе с React-router'ом и Redux'ом взят отсюда
(будет обновляться после 13.02.2016 - мержить к себе новые изменения):

https://github.com/erikras/react-redux-universal-hot-example/commits/master

Разделить проект на ядро (модуль npm) и чисто кастомный код (actions, stores, pages, components)

можно сделать уведомление (на почту, например, и ограничение функциональности) при заходе с "нового" ip-адреса (опция)
ip-адреса можно "запоминать", назначая им имя, если ввести пароль

Загрузку видео + плеер
http://videojs.com/

Прочее
====================

В javascript'овом коде используется ES6/ES7 через Babel:
https://github.com/google/traceur-compiler/wiki/LanguageFeatures


В качестве среды разработки используется Sublime Text 3, с плагинами

https://github.com/babel/babel-sublime


Чтобы Sublime Text 3 не искал в ненужных папках во время Find in Files,
можно использовать такой "Where": <open folders>,-node_modules/*,-build/*


Для общей сборки и для запуска процесса разработки сейчас используется Gulp, но вообще он мало кому нравится, и мб его можно убрать из цепи разработки.


Для сборки клиентской части проекта используется WebPack

https://www.youtube.com/watch?v=VkTCL6Nqm6Y

http://habrahabr.ru/post/245991/


Webpack development server по умолчанию принимает все запросы на себя, 
но некоторые из них может "проксировать" на Node.js сервер, например.
Для этого требуется указать шаблоны Url'ов, которые нужно "проксировать",
в файле webpack/development server.js, в параметре proxy запуска webpack-dev-server'а.


Для "профайлинга" сборки проекта Webpack'ом можно использовать Webpack Analyse Tool
http://stackoverflow.com/questions/32923085/how-to-optimize-webpacks-build-time-using-prefetchplugin-analyse-tool


На Windows при запуске в develpoment mode Webpack вызывает событие изменения файлов,
когда делает их require() в первый раз, поэтому nodemon глючит и начинает много раз
перезапускаться.

Ещё, на Windows у nodemon'а, который запускается параллельно в нескольких экземплярах, может быть ошибка "EPERM: operation not permitted", которая не исправляется:
https://github.com/remy/nodemon/issues/709


При сборке каждого chunk'а к имени фала добавляется хеш.

Таким образом обходится кеширование браузера (с исчезающе малой вероятностью "коллизии" хешей).

Нужные url'ы подставляются в index.html плагином HtmlWebpackPlugin.


При запуске через npm run dev работает hot reload для компонентов React, 
а также для Redux'а (например, для action response handlers)


Вместо LESS и CSS в "компонентах" React'а используются inline стили.

Можно также использовать Radium, если понадобится

https://github.com/FormidableLabs/radium


Для подгрузки "глобального" стиля используется модуль Webpack'а style-loader,
и поэтому при запуске в режиме разработчика при обновлении страницы присутствует 
как бы "мигание" протяжённостью в секунду: это время от загрузки Html разметки до
отработки javascript'а style-loader'а, который динамически создаёт элемент <style/>
с "глобальными" стилями (преимущество: работает hot reload для "глобальных" стилей)


В качестве реализации Flux'а используется Redux:

https://github.com/gaearon/redux


Подключен react-hot-loader

http://gaearon.github.io/react-hot-loader/


Для подключения модулей из bower'а, по идее, достаточно раскомментировать два помеченных места в webpack.coffee.

Альтернативно, есть плагин:

https://github.com/lpiepiora/bower-webpack-plugin


Для кеширования Html5 через manifest можно будет посмотреть плагин AppCachePlugin


// Небольшой мониторинг есть по адресу http://localhost:5959/

// (npm модуль look) (не компилируется на новой Node.js, поэтому выключен)


React Context

http://jaysoo.ca/2015/06/09/react-contexts-and-dependency-injection/


Если возникает такая ошибка в клиентском коде:

"Module parse failed: G:\work\webapp\code\common\log levels.js Line 1: Unexpected token
 You may need an appropriate loader to handle this file type."

то это означает, что данный файл не подключен в webpack.config.js к babel-loader


Redis для Windows по умолчанию съедает сразу около 40-ка ГигаБайтов места.

Чтобы исправить это, нужно поправить файлы redis.windows.conf и redis.windows-service.conf:

maxmemory 1gb

(править файлы в Program Files не получится, их можно править, скопировав в другое место и потом перезаписав обратно поверх)


Для того, чтобы git не отслеживал файл с переводом en.js, нужно выполнить такую команду:

git update-index --assume-unchanged code/client/international/translations/en.js