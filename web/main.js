import _ from './framework/util';
import {} from './framework/jQueryLean';
import riot from 'riot';
import { applyMiddleware, createStore, combineReducers, compose} from 'redux';
import router from './framework/lean-router';
import riotRouterRedux from './framework/riot-router-redux';
import middlewares from './middlewares';
import reducers from './registerReducers';
import {} from 'riot-form';

const HISTORY_MODE = 'browser';
const reducer = combineReducers({
    ...reducers
});
const routeMw = riotRouterRedux.routerMiddlewareCreator(HISTORY_MODE);
const store = compose(applyMiddleware(routeMw, ...(_.values(middlewares))))(createStore)(reducer);

riot.mixin('router', router.router(HISTORY_MODE));
riot.mixin('form', form);

riotRouterRedux.syncHistoryWithStore(router.hub, store);

router.hub.on('history-pending', (prev, curr, ctx, next)=>{
    next && next();
});

require('./app.html');
riot.mount('*', {store}); //app is provider