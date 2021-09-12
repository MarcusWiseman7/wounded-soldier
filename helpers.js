export default {
    methods: {
        canShow(o, q) {
            return !!(o && q && o.hasOwnProperty(q) && o[q]);
        },
        prettyDate(d) {
            const date = new Date(d);
            return date.toLocaleDateString();
        },
    },
};
