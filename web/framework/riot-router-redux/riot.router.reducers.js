const route = (route= {path: '/', prev: '/', stack: []}, action) => {
    switch (action.type) {
        case '$route':
            return Object.assign({}, route, {
                prev: route.path,
                path: action.payload.route.path,
                data: action.payload.route.ctx
            });
        case '$routeBusy':
            return Object.assign({}, route, {busy: true});
        case '$routeUnBusy':
            return Object.assign({}, route, {busy: false});
        default:
            return route;
    }
};
export default {route}