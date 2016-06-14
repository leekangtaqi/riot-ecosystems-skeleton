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
            type: '$route',
            payload: {
                route: route
            }
        })
    });
    hub.on('busy-pending', ()=>{
        store.dispatch({
            type: 'maskShow'
        });
        store.dispatch({
            type: '$routeBusy'
        })
    });
    hub.on('busy-resolve', ()=>{
        store.dispatch({
            type: 'maskHidden'
        });
        store.dispatch({
            type: '$routeUnBusy'
        })
    })
}
export default {routerMiddlewareCreator, syncHistoryWithStore}