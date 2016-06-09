import _ from './framework/util';
import riot from 'riot';
import { applyMiddleware, createStore, combineReducers, compose} from 'redux';
import router from './framework/lean-router';
import riotRouterRedux from './framework/riot-router-redux';
// import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
// import { Router, Route, browserHistory} from 'react-router';
import middlewares from './middlewares';
import reducers from './registerReducers';

const reducer = combineReducers({
    ...reducers
});
const HISTORY_MODE = 'browser';
const routeMw = riotRouterRedux.routerMiddlewareCreator(HISTORY_MODE);
const store = compose(applyMiddleware(routeMw, ...(_.values(middlewares))))(createStore)(reducer);

riot.route.base('/');
riot.mixin('router', router.router(HISTORY_MODE));
riotRouterRedux.syncHistoryWithStore(router.hub, store);

require('./app.html');
riot.mount('*', {store}); //app is provider