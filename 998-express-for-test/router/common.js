const express = require('express');
const commonRouter = express.Router();

// get 请求处理
commonRouter.get('/test-get', (req, res) => {
    const data = req.query;
    console.log('common/test-get received: ', data);
    res.status(200).json({
        result:'success',
        received: JSON.stringify(data).slice(0, 30) + '...'
    });
})

// post 请求处理
commonRouter.post('/test-post', (req, res) => {
    const data = req.body;
    console.log('common/test-post received: ', data);
    res.status(200).json({
            result: 'success', 
            received: JSON.stringify(data).slice(0, 30) + '...'
        });
});

commonRouter.post('/test-form', (req, res) => {
    const data = req.body;
    res.status(200).json(data) 
});

exports.commonRouter = commonRouter;
