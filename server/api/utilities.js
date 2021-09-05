const express = require('express');

const router = express.Router();

router.post('/setCookie', async (req, res) => {
    try {
        const name = req.body.name;
        const value = req.body.value;
        const expires = req.body.expires;
        console.log('name :>> ', name);
        console.log('value :>> ', value);
        console.log('expires :>> ', expires);

        res.status(200).cookie(name, value, { expires, httpOnly: true });
    } catch (err) {
        res.status(400).send({ statusCode: -1, catchError: err });
    }
});

module.exports = router;
