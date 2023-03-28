const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

function parse(url) {
  return url.split('/');
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    if (req.method === 'GET' && req.url === '/') {
      res.status = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog Club');
    }
    if (req.method === 'GET' && req.url === '/dogs') {
      res.status = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dogs index');
    }
    if (req.method === 'GET' && req.url.startsWith('/dogs/') && parse(req.url).length === 3) {
      let dogID = parse(req.url)[2];
      if (!isNaN(dogID)) {
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog details for dog ${dogID}`);
      }
    }
    if (req.method === 'GET' && req.url === '/dogs/new') {
      res.status = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog create form page');
    }
    if (req.method === 'POST' && req.url === '/dogs') {
      res.status = 302;
      let newDogID = getNewDogId();
      res.setHeader('Location', `/dogs/${newDogID}`);
      return res.end();
    }
    if (req.method === 'POST' && req.url.startsWith('/dogs/') && parse(req.url).length === 3) {
      let dogID = parse(req.url)[2];
      res.status = 302;
      console.log('test');
      res.setHeader('Location', `/dogs/${dogID}`);
      return res.end();
    }
    if (req.method === 'GET' && req.url.startsWith('/dogs/') && parse(req.url)[3] === 'edit') {
      let dogID = parse(req.url)[2];
      res.status = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end(`Dog edit form page for dog ${dogID}`);
    }

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
