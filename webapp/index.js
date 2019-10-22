const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');

const cors = require('cors') // Fix the frontend no-CORS issues

const dfsData       = require('./mockData/mockDFS');
const bfsData       = require('./mockData/mockBFS')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.post("/dfsData", (req, res) => {

  if (req.body.url == null) {
    return res.status(404).send('Please Enter the URL.');
  }

	return res.status(201).send(dfsData); // Hard-coded mock data
})

app.post("/bfsData", (req, res) => {

  if (req.body.url == null) {
    return res.status(404).send('Please Enter the URL.');
  }

	return res.status(201).send(bfsData); // Hard-coded mock data
})


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});