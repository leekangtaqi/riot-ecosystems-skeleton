function routerMiddlewareCreator(historyMode){
    return store => next => action => {
        next(action);
    }
}
function syncHistoryWithStore(hub, store){
    hub.on('state-change', route=>{
        store.dispatch({
            type: 'route',
            payload: {
                route: route
            }
        })
    })
}
export default {routerMiddlewareCreator, syncHistoryWithStore}