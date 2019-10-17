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

app.get('/history', (req, res)=>{
  res.send(req.cookies.searchingHistory);
});

app.get("/dfsData", (req, res) => {
  let currentCookie = req.cookies.searchingHistory;
  currentCookie =  addSearchingHistoryInCurrentCookie(req.cookies.searchingHistory, "get DFS data!");

  res.cookie("searchingHistory", currentCookie);

	res.send(dfsData);
})

app.get("/bfsData", (req, res) => {

  let currentCookie = req.cookies.searchingHistory;
  currentCookie =  addSearchingHistoryInCurrentCookie(req.cookies.searchingHistory, "get BFS data!");

  res.cookie("searchingHistory", currentCookie);

  res.send(bfsData);
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