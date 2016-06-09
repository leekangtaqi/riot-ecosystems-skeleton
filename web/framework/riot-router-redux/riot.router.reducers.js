const route = (route= {path: '/', prev: '/', stack: []}, action) => {
    if(action.type === 'route'){
        return {
            prev: route.path,
            path: action.payload.route.path,
            data: action.payload.route.ctx
        }
    }
    return route;
};
export default {route}