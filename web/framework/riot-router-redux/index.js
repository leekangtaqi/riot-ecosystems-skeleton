function routerMiddlewareCreator(historyMode){
    return store => next => action => {
        if(action.type === 'route'){
        }
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