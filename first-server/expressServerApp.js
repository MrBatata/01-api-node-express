/** Import needed to use env secrets */
require('dotenv').config(); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
console.log(process.env.MESSAGE_STYLE);
/** 1 - Import needed to install Express packages
 * Nodejs does not support full ES6
 */
let express = require('express');

/** Import needed if ES6 -> replacement for `__dirname` */
// import * as url from 'url';
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/** 2 - Server will listen at http://localhost:3000/ */
let app = express();
const port = 3000;

/** 3 - Start a Working Express Server + middleware function -> .listen()  */
const middlewareConsoleLog = function () {
  console.log(`Example app listening on port ${port}!`);
};
// app.listen(port);
app.listen(port, middlewareConsoleLog);

/** 4 - App methods
 * app.use(PATH, MIDDLEWARE FUNC) -> applies mw function to all request from the path
 * app.get(...) -> applies mw function to all GETS in the path
 * app.post(...)
 */
const middlewareFunction = function (req, res, next) {
  let string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
}
// Won't work for '/' as the root was declared earlier... 
app.use(middlewareFunction);

/** app method -> .get() */
const middlewareMessage = function (req, res) {
  res.send("Hello Batata!");
};
app.get("/", middlewareMessage);

/** 11 - Use body-parser to Parse POST Requests 
 * To parse the data coming from POST requests, you must use the body-parser package
 * https://www.npmjs.com/package/body-parser
 * ! All these statements need to go above any routes that might have been defined
 */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** 5 - Serve with .get() an HTML file at http://localhost:3000/home */
const absolutePathHTML = __dirname + '\\views\\index.html'; // need double slashes... don't know why.
console.log(absolutePathHTML);

const middlewareHTML = function (req, res) {
  res.sendFile(absolutePathHTML);
};
app.get('/home', middlewareHTML);

/** 6 - Serve JSON using secret variables .env -> http://localhost:3000/json */
const middlewareJSON = function (req, res) {
  // Variable assignment as object
  const messageJSON = { "message": "hello json" };
  // Check `.env` requires `dotenv` package and import at the beginning
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    messageJSON.message = messageJSON.message.toUpperCase();
  }
  return res.json(messageJSON);
}
app.get('/json', middlewareJSON);

/** 7 - Serve Static Assets with .use() + middleware function */
const absolutePathCSS = __dirname + '\\public'; // need double slashes... don't know why.
console.log(absolutePathCSS);
//can be checked -> http://localhost:3000/public/style.css
app.use('/public', express.static(absolutePathCSS));

/** 8 - Chain Middleware to Create a Time Server */
// app.get(PATH, MIDDLEWARE) -> MIDDLEWARE can have chained functions
app.get('/now', function (req, res, next) {
  req.time = new Date().toString();  // Hypothetical synchronous operation
  next();
}, function (req, res) {
  res.json({ "time": req.time });
});

/** 9 - Get Route Parameter Input from the Client with req.params 
 * route_path: '/routeparam/:word'
 * actual_request_URL: '/routeparam/tetaculo'
 * req.params: {word: 'tetaculo'}
 */
app.get('/routeparam/:word', function (req, res, next) {
  res.json(req.params.word);
});
// Could also have route after the params
app.get('/routeparam/:word/route', function (req, res, next) {
  res.json(req.params.word.toUpperCase());
});

/** 10 - Get Query Parameter Input from the Client
 * route_path: '/name'
 * actual_request_URL: '/name?first=firstname&last=lastname'
 * req.query: {first: 'firstname', last: 'lastname'}
 */
app.get('/name_1', function (req, res, next) {
  const first = req.query.first;
  const last = req.query.last;
  const name = { name: `${first} ${last}` }
  res.json(name);
});

/** Chain different verb handlers on the same path route 
 * ? app.route(path).get(handler).post(handler)
 */

/** 12 - Get Data from POST Requests 
 * (first need step 11 above)
 */
app
  .get('/name', function (req, res, next) {
    const first = req.query.first;
    const last = req.query.last;
    const name = { name: `${first} ${last}` }
    res.json(name);
  })
  .post('/name', function (req, res, next) {
    const name = { name: `${req.body.first} ${req.body.last}` }
    res.json(name);
  });