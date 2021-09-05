const pkg = require('./package');

module.exports = {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: pkg.title,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: 'rgba(0, 0, 0, 0.6)' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { hid: 'description', name: 'description', content: pkg.description },
            // { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
            { rel: 'manifest', href: '/site.webmanifest' },
        ],
    },

    loading: { color: '#ffa000', height: '4px' },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['@/assets/scss/main.scss'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['@/plugins/v-scroll-lock'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Nuxt collect anonymous data
    telemetry: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: ['@nuxtjs/svg', '@nuxtjs/device'],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        'nuxt-helmet',
        'nuxt-compress',
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
        ['@nuxtjs/component-cache', { maxAge: 1000 * 60 * 60 }],
        // https://go.nuxtjs.dev/content
        // '@nuxt/content',
        '@nuxtjs/auth',
        '@nuxtjs/proxy',
        '@nuxtjs/cloudinary',
        '@nuxtjs/style-resources',
        '@nuxtjs/sitemap', // Always last
    ],

    'nuxt-compress': {
        gzip: {
            threshold: 8192,
        },
        brotli: {
            threshold: 8192,
        },
    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        proxy: true,
    },

    proxy: {
        '/api/': {
            target: 'http://localhost:3000',
            pathRewrite: {
                '^/api/': '/',
            },
        },
    },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en',
        },
    },

    styleResources: {
        scss: ['./assets/scss/_mixins.scss'],
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUDNAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        useComponent: true,
    },

    // Content module configuration: https://go.nuxtjs.dev/config-content
    content: {},

    device: {
        refreshOnResize: true,
    },

    auth: {
        redirect: {
            login: '/',
            logout: '/',
            callback: '/',
            home: '/',
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
                    logout: { url: '/api/auth/logout', method: 'post' },
                    user: { url: '/api/auth/user', method: 'get', propertyName: 'user' },
                },
            },
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['v-body-scroll-lock'],
    },
};
