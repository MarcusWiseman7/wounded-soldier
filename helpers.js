export default {
    methods: {
        canShow(o, q) {
            return !!(o && q && o.hasOwnProperty(q) && o[q]);
        },
        goBackOrIndex() {
            if (window.history.length > 2) this.$router.go(-1);
            else this.$router.push('/');
        },
        prettyDate(d) {
            const date = new Date(d);
            return date.toLocaleDateString();
        },
    },
};
