const express = require('express')
const jsonpRouter = express.Router()

jsonpRouter.get('/test', (req, res) => {
    const { callback } = req.query;
    const date = new Date();
    const data = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    res.setHeader('Content-Type', 'text/javascript');
    res.send(`${callback}(${JSON.stringify(data)})`);
})

exports.jsonpRouter = jsonpRouter;