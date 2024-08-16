const express = require('express')
const axios = require('axios')
const url = require('url')

const app = express()
const port = 3000

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/proxy', async (req, res) => {
    try {
        const targetUrl = req.query.url
        const userAgent = req.query.userAgent ?? `VKAndroidApp/8.38-16786 (Android 9; SDK 28; arm64-v8a; samsung SM-S901N; ru; 1280x720)`
        
        if(!targetUrl) {
            return res.status(400).send('URL parameter is required')
        }

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': userAgent
            }
        })

        const data = response.data
        const callback = req.query.callback

        if(callback) {
            res.jsonp(data)
        } else {
            res.json(data)
        }
    } catch(error) {
        res.jsonp(error)
    }
})

app.get('/event-source', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const targetUrl = decodeURIComponent(req.query.url)
    const userAgent = req.query.userAgent ?? `VKAndroidApp/8.38-16786 (Android 9; SDK 28; arm64-v8a; samsung SM-S901N; ru; 1280x720)`;

    if(!targetUrl) {
        return res.status(400).send('URL parameter is required')
    }

    const response = await axios.get(targetUrl, {
        headers: {
            'User-Agent': userAgent
        },
        responseType: 'stream' 
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.data.on('data', (chunk) => {
        //res.write(`data: ${chunk.toString()}\n\n`);
        res.write(chunk.toString());
    });

    response.data.on('end', () => {
        res.write("event: end\ndata: end of data\n\n");
        res.end();
    });

    response.data.on('error', (err) => {
        res.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
        res.end();
    });

})

app.listen(port, () => {
    console.log(`Proxy server started at port ${port}`)
})
