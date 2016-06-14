import {} from '../framework/jQueryLean';
import riot from 'riot';
import { provide } from '../framework/riot-redux';
import router from '../framework/lean-router';
import riotRouterRedux from '../framework/riot-router-redux';
import {} from 'riot-form';
import { configureStore } from '../configuration/store';

const HISTORY_MODE = 'browser';

const store = configureStore({}, HISTORY_MODE);

riot.mixin('router', router.router(HISTORY_MODE));
riot.mixin('form', form);

riotRouterRedux.syncHistoryWithStore(router.hub, store);

router.hub.on('history-pending', (prev, $state, $location, ctx, next)=>{
    next && next();
});

require('./app.html');
let entry = riot.mount('*', {store}); //app is provider
provide(store)(entry);