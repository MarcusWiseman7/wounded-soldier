const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Nuxt, Builder } = require('nuxt');

const auth = require('./api/auth');
const beers = require('./api/beers');
const breweries = require('./api/breweries');
const reviews = require('./api/reviews');
const users = require('./api/users');
const utilities = require('./api/utilities');

const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

(async function() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config);

    const { host, port } = nuxt.options.server;

    await nuxt.ready();
    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    }

    // App middleware
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/auth', auth);
    app.use('/beers', beers);
    app.use('/breweries', breweries);
    app.use('/reviews', reviews);
    app.use('/users', users);
    app.use('/utilities', utilities);

    // Give nuxt middleware to express
    app.use(nuxt.render);

    // Listen the server
    app.listen(port, host, () => {
        console.log(`Server listening on PORT: ${port}`);
    });
})();
