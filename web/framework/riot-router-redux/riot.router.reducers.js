let initialRouteData = {
    $prev_state: '/',
    $prev_location: '/',
    $state: '/',
    $location: '/',
    data: {},
    stack: []
};
const route = (route= initialRouteData, action) => {
    switch (action.type) {
        case '$route':
            return Object.assign({}, route, {
                $prev_state: route.$state,
                $prev_location: route.$location,
                $state: action.payload.route.$state,
                $location: action.payload.route.$location,
                data: action.payload.route.ctx,
                stack: [...route.stack, route.$state]
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