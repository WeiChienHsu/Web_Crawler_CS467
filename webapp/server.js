const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');

const cors = require('cors'); // Fix the frontend no-CORS issues

const dfsData       = require('./mockData/mockDFS');
const bfsData       = require('./mockData/mockBFS')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();


const PORT = process.env.PORT || 8080;


/**
 * Enum for crawl type.
 * @readonly
 * @enum {{name: string}}
 */
const CrawlType = Object.freeze({
    BFS:   { name: "bfs"},
    DFS:  { name: "dfs"}
});


/**
 * Function to call crawler for data to pass back to visualizer
 * @param type
 * @param url
 * @returns {{status: number, data: *}}
 */
function getCrawlerData(type, url) {

    let response = { status: 201, data: null };

    // Mock for now until we get data from crawler
    if(type === CrawlType.BFS) {
        response.data = bfsData;
    } else {
        response.data = dfsData;
    }

    /* connect to crawler, try a few times with limit */

    /* send request for data */


    /* validate response */
    if ( response.data == null ) {
        response.status = 404;
        response.Error = "Not found. The crawler did not find any nodes, please check the url and try again."
    }


    return response;
}

/**
 * Function to validate request and required attributes by client,
 * @param req - api request
 * @returns {*}
 */
function validateRequest(req) {

    if(req.body == null || req.body.length <=0 ) {
        return { status: 400, error: "One or more required fields are missing. No body in request." }
    }

    if (req.body.url == null) {
        return { status: 400, error: "Please enter a URL so the crawler crawler can show you how cool it is."};
    }

    if (req.body.level == null) {
        return { status: 400, error: "A level is required to begin crawling. Please enter a level."};
    }
}


/**
 * Get Index
 */
router.get("/", (req, res) => {
  res.send("Welcome to the Web Crawler API");
});



/**
 * endpoint for DFS
 */
router.post("/dfsData", (req, res) => {

    let response = validateRequest(req);
    if( response != null ) {
        res.status(response.status).json( {Error: response.error}).end();
    } else {
        response = getCrawlerData(CrawlType.DFS, req);
        // get data from crawler
        //return res.status(201).send(dfsData); // Hard-coded mock data
        res.status(response.status).send(response.data);
    }
});

/**
 * endpoint for BFS
 */
router.post("/bfsData", (req, res) => {

    let response = validateRequest(req);
    if( response != null ) {
        res.status(response.status).json({ Error: response.error }).end();
    }

    // get data from crawler
	//return res.status(201).send(bfsData); // Hard-coded mock data
    response = getCrawlerData(CrawlType.BFS, req);
    res.status(response.status).json(response.data);
});


app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});