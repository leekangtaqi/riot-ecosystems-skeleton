import _ from '../framework/util';
import { compose, createStore, combineReducers, applyMiddleware} from 'redux';
import reducers from '../app/registerReducers';
import riotRouterRedux from '../framework/riot-router-redux';
import middlewares from '../app/middlewares';

const reducer = combineReducers({
    ...reducers
});

export const configureStore = (initialState = {}, HISTORY_MODE = 'browser') =>{
    const routeMw = riotRouterRedux.routerMiddlewareCreator(HISTORY_MODE);
    return compose(applyMiddleware(routeMw, ...(_.values(middlewares))))(createStore)(reducer, initialState);
};