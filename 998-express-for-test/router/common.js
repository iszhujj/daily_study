const express = require('express');
const commonRouter = express.Router();

// post 请求处理
commonRouter.post('/test-post', (req, res) => {
    const data = req.body;
    console.log('common/test-post received: ', data);
    res.status(200).json({
            result: 'success', 
            received: JSON.stringify(data).slice(0, 30) + '...'
        });
});

exports.commonRouter = commonRouter;
