import _ from './framework/util';
import riot from 'riot';
// import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { applyMiddleware, createStore, combineReducers, compose} from 'redux';
import router from './framework/lean-router';
// import { Router, Route, browserHistory} from 'react-router';

// import {routes} from './routes';
import middlewares from './middlewares';
import reducers from './registerReducers';

const reducer = combineReducers({
    // routing: routerReducer,
    ...reducers
});
// const routeMw = routerMiddleware(browserHistory);

// const store = compose(applyMiddleware(routeMw, ...(_.values(middlewares))))(createStore)(reducer);
const store = compose(applyMiddleware(...(_.values(middlewares))))(createStore)(reducer);

riot.route.base('/');
riot.mixin('router', router);

// const history = syncHistoryWithStore(browserHistory, store);

require('./app.html');
riot.mount('*', {store}); //app is provider