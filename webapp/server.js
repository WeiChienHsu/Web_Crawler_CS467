const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const request = require('request');

const cors = require('cors'); // Fix the frontend no-CORS issues

const dfsData       = require('./mockData/mockDFS');
const bfsData       = require('./mockData/mockBFS')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();


const PORT = process.env.PORT || 8080;

const crawlerURL = "https://us-central1-webcrawler-256621.cloudfunctions.net";


/**
 * Enum for crawl type.
 * @readonly
 * @enum {{name: string}}
 */
const CrawlType = Object.freeze({
    BFS:   { name: "bfs", endpoint: "/bfs"},
    DFS:  { name: "dfs", endpoint: "/dfs"}
});

/**
 * @type validation
 */
function isValidUrl(str)
{
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;


    if (regexp.test(str))
    {
        return true;
    }
    return false;

}


/**
 * Function to call crawler for data to pass back to visualizer
 * @param type
 * @param url
 * @returns {{status: number, data: *}}
 */
function getCrawlerData(crawlerType, url) {

    let response = { status: 201, data: null };

    // Mock for now until we get data from crawler
    /*
    if(crawlerType === CrawlType.BFS) {
        response.data = bfsData;
    } else {
        response.data = dfsData;
    } */

    /* connect to crawler, try a few times with limit */

    /* send request for data */

    return  request(url, { json: true }, (err, res, body) => {
        response.status = response.statusCode;

        if (err) {
            response.Error = err;
        } else {
            response.data = body;
        }
        return response;
    });

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

    if (!isValidUrl(req.body.url)) {
        return { status: 400, error: "Url invalid."};
    }

    if (req.body.depth == null) {
        return { status: 400, error: "A depth is required to begin crawling. Please enter a depth."};

    }

    if(req.body.keyword != null ) {
        //check only one word and
        if(req.body.keyword.length <= 2)
        return { status: 400, error: "Keyword not valid. Keyword is optional, but if sent then it must be at least 3 characters long." }
    }
}


/**
 * Get Index
 */
router.get("/", (req, res) => {
  res.send("Welcome to the Web Crawler REST API");
});



/**
 * endpoint for DFS
 */
router.post("/dfsData", (req, res) => {

    let response = validateRequest(req);
    if( response != null ) {
        res.status(response.status).json( { Error: response.error }).end();
    } else {

        let url = crawlerURL + CrawlType.DFS.endpoint;

        request.post(url, { json: req.body }, (error, result, body) => {

            if (error) {
                res.status(result.statusCode).send(error);
            } else {
                res.status(result.statusCode).send(body);
            }
        });
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
    res.status(201).send(bfsData); // Hard-coded mock data

    /*
    getCrawlerData(CrawlType.BFS, req).then( (response) => {
        res.status(response.status).json(response.data);
    }); */
});


app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});