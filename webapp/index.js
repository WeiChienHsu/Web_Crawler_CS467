const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');

const dfsData       = require('./mockData/mockDFS');
const bfsData       = require('./mockData/mockBFS')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use("/", (req, res, next) => {
  const cookie = req.cookies.cookieName;
	if (req.cookies === undefined || req.cookies.searchingHistory === undefined) {
		res.cookie("searchingHistory", "[]");
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.get('/history', (req, res)=> {
  res.send(req.cookies.searchingHistory);
});

app.delete('/history', (req, res) => {
  res.cookie("searchingHistory", "[]"); // Reset Cookie
  res.status(204).end();
});

app.post("/dfsData", (req, res) => {

  if (req.body.url == null) {
    return res.status(404).send('Please Enter the URL.');
  }

  let currentCookie = req.cookies.searchingHistory;

  const depth = req.body.depth;
  const algorithm = 'dfs';
  const url = req.body.url;
  const keyword = req.body.keyword;

  const searchResult = {
    "algorithm": algorithm,
    "url": url,
    "depth": depth,
    "keyword": keyword
  }

  currentCookie =  addSearchingHistoryInCurrentCookie(req.cookies.searchingHistory, searchResult);

  // console.log("Search for: " + JSON.stringify(searchResult));

  res.cookie("searchingHistory", currentCookie);

	return res.status(201).send(dfsData); // Hard-coded mock data
})

app.post("/bfsData", (req, res) => {

  if (req.body.url == null) {
    return res.status(404).send('Please Enter the URL.');
  }

  let currentCookie = req.cookies.searchingHistory;

  const depth = req.body.depth;
  const algorithm = 'bfs';
  const url = req.body.url;
  const keyword = req.body.keyword;

  const searchResult = {
    "algorithm": algorithm,
    "url": url,
    "depth": depth,
    "keyword": keyword
  }

  currentCookie =  addSearchingHistoryInCurrentCookie(req.cookies.searchingHistory, searchResult);

  res.cookie("searchingHistory", currentCookie);

  // console.log("Search for: " + JSON.stringify(searchResult));

	return res.status(201).send(dfsData); // Hard-coded mock data
})


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


function addSearchingHistoryInCurrentCookie(cookie, url) {
  // const url = validatedURL.trim();

  cookie = JSON.parse(cookie);      // parse string to JSON
	cookie.push(url);                 // append URL into searching history object
  cookie = JSON.stringify(cookie);  // transfer JSON back to string

  // console.log(cookies)
  return cookie
}