const express = require('express')
const axios = require('axios')
const multer = require('multer')
const fs = require('fs')
const https = require('https')
const FormData = require('form-data')

const app = express()
const upload = multer()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Check for certificate
if(!fs.existsSync('local.key') && !fs.existsSync('local.crt')) {
    const folder_name = __dirname
    let disk_name = folder_name[0]
    console.error(`\n"local.key" and "local.crt" are not found.`)
    console.log(`\nInstall OpenSSL and run commands:
---
${disk_name != 'C' ? disk_name + ':' : ''}
cd ${folder_name}
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout local.key -out local.crt
local.crt
---
to create them.`)
    return
}

app.all('/proxy', upload.any(), async (req, res) => {
    try {
        const targetUrl = req.query.url || req.body.url;
        const userAgent = req.query.userAgent || req.body.userAgent || `VKAndroidApp/8.38-16786 (Android 9; SDK 28; arm64-v8a; samsung SM-S901N; ru; 1280x720)`;
        
        if(!targetUrl) {
            return res.status(400).send('URL parameter is required');
        }

        console.log('Got request: ' + targetUrl)
        const headers = {
            'User-Agent': userAgent,
        };

        if(req.query.origin) {
            headers['Origin'] = req.query.origin || req.headers.origin || ''
        }

        let axiosConfig = {
            headers: headers,
            method: req.method,
        };

        let formData = null
        if(req.method === 'POST') {
            formData = new FormData();

            for(let key in req.body) {
                formData.append(key, req.body[key]);
            }

            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    formData.append(file.fieldname, file.buffer, file.originalname);
                });
            }

            axiosConfig.data = formData;
            axiosConfig.headers = {
                ...headers,
                ...formData.getHeaders()
            };
        }
        
        let host = null

        try {
            host = new URL(req.headers.referer)
        } catch(e) {
            host = new URL('http://localhost:3000/')
        }

        res.header('Access-Control-Allow-Origin', host.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Vk-Sign');
        res.header('Content-Type', 'application/json');

        if(req.headers['x-vk-sign']) {
            axiosConfig.headers = {
                ...axiosConfig.headers,
                'X-Vk-Sign': req.headers['x-vk-sign'],
            }
        }

        //console.log(axiosConfig.headers)
        
        let response = null
        if(req.method != 'POST') {
            response = await axios.get(targetUrl, axiosConfig);
        } else {
            response = await axios.post(targetUrl, formData, axiosConfig);
        }

        const data = response.data;
        const callback = req.query.callback || req.body.callback;

        if(callback) {
            res.jsonp(data);
        } else {
            res.json(data);
        }
    } catch(error) {
        console.log(error)
        if(error.response) {
            res.json(error.response.data);
        } else {
            res.status(500)
        }
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
            'User-Agent': userAgent,
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
    })
})

const httpOptions = {
    key: fs.readFileSync('local.key').toString(),
    cert: fs.readFileSync('local.crt').toString(),
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method'
}
const server = https.createServer(httpOptions, app).listen(port, () => {
    console.log(`Proxy server started at port ${port}`)
})
