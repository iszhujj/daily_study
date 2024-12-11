const express = require('express');

const app = express();

const { scatter003 } = require('./router/scatter-003');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use('/scatter-003', scatter003);

app.use((req, res) => {
    res.status(404).send('--Not Found--');
});

app.listen(3001, () => {
    console.log('3001 is listening...');
});
