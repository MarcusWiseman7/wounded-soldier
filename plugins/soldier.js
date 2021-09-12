export default async ({ app, store }, inject) => {
    inject('goBackOrIndex', (transition = true) => {
        if (transition) store.commit('toggle', 'routeBack');

        if (window.history.length > 2) app.router.go(-1);
        else app.router.push('/');

        if (transition) {
            setTimeout(() => {
                store.commit('toggle', 'routeBack');
            }, 50);
        }
    });
};
