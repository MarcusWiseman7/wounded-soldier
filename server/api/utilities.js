const express = require('express');

const { mongoose } = require('../db/mongoose');
// const { userSelect, beerSelect, tempBeerSelect, reviewSelect, brewerySelect } = require('../utils/vars');
const { Beer } = require('../models/beer');
const { Brewery } = require('../models/brewery');
// const { Review } = require('../models/review');
// const { User } = require('../models/user');

const router = express.Router();

router.post('/cookie', async (req, res) => {
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

router.patch('/normalizeNamesInDB', async (req, res) => {
    try {
        const beers = await Beer.find();
        const breweries = await Brewery.find();

        await beers.forEach(async beer => {
            beer.altName = beer.beerName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            await beer.save(err => {
                if (err)
                    return res.status(400).send({ statusCode: -1, dbSaveError: err, message: 'Error saving beer' });
            });
        });

        await breweries.forEach(async brewery => {
            brewery.altName = brewery.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            await brewery.save(err => {
                if (err)
                    return res.status(400).send({ statusCode: -1, dbSaveError: err, message: 'Error saving brewery' });
            });
        });

        res.status(200).send({ statusCode: 1 });
    } catch (err) {
        return res.status(400).send({ statusCode: -1, catchError: err });
    }
});

router.patch('/updateDB', async (req, res) => {
    try {
        const breweries = await Brewery.find();
        const beers = await Beer.find();

        breweries.forEach(async brewery => {
            if (brewery.logo) {
                const l = brewery.logo;
                brewery.logoURL = l;
                brewery.logoPublicId = l.slice(l.indexOf('/breweries/'));
                brewery.logo = '';

                await brewery.save(err => {
                    if (err)
                        return res
                            .status(400)
                            .send({ statusCode: -1, dbSaveError: err, message: 'Error saving brewery' });
                });
            }
        });

        beers.forEach(async beer => {
            if (beer.logo) {
                const l = beer.logo;
                beer.logoURL = l;
                beer.logoPublicId = l.slice(l.indexOf('/beers/'));
                beer.logo = '';

                await beer.save(err => {
                    if (err)
                        return res
                            .status(400)
                            .send({ statusCode: -1, dbSaveError: err, message: 'Error saving brewery' });
                });
            }
        });

        res.status(200).send({ statusCode: 1 });
    } catch (err) {
        return res.status(400).send({ statusCode: -1, catchError: err });
    }
});

module.exports = router;
