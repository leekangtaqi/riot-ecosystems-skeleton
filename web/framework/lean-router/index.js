"use strict";
import riot from 'riot';
import viewCreator from '../lean-view';

var hub = riot.observable();

hub.view = viewCreator(hub);

hub.busy = false;

hub.routes = {};

hub.defaultRoute = null;

hub.location = null;

hub.init = function(){
    hub._parseRoute();
    riot.route.base('/');
    riot.route(hub._doRoute());
    riot.route.start();
    nextTick(riot.route.exec, 0);
    function nextTick(fn){
        setTimeout(fn, 0);
    }
};

hub._parseRoute = () => {
    riot.route.parser(function(path){
        let req = {};
        let [uri, queryString] = path.split('?');
        let prefix = null;
        if(hub.location){
            prefix = compareUrl(hub.location, uri);
        }
        let uriParts = uri.split('/');

        req.params = {};
        req.paramList = [];
        if(uri.match(/_(\w+)/g)){
            req.paramList = uriParts.filter(p => p.match(/_(\w+)/g)).map(o => o.slice(1));
        }

        req.query = {};
        if(queryString){
            queryString.split('&').map(i=>req.query[i.split('=')[0]] = i.split('=')[1]);
        }

        req.hints = [];
        if(uriParts.length){
            req.hints = uriParts.map((i, index)=>{
                if(index === 0){
                    return i;
                }
                return combineUriParts(uriParts, index, i);
            });
        }
        if(prefix){
            req.hints = req.hints.filter(hint=>hint.length > prefix.length);
            if(!req.hints.length){
                return null;
            }
        }
        return req;
    });
    function compareUrl(u1, u2) {
        var r = [];
        var arr1 = u1.split('/');
        var arr2 = u2.split('/');
        for(var i = 0, len = arr1.length; i<len; i++){
            if(arr1[i] === arr2[i]){
                r.push(arr1[i]);
            }else{
                break;
            }
        }
        return r.join('/')
    }
    function combineUriParts(parts, i, combined){
        if(!parts.length || i<=0){
            return combined;
        }
        let uri = parts[i-1] + '/' + combined;
        return combineUriParts(parts, --i, uri);
    }
};

hub.registerRoute = function({path, name, resolve, redirectTo, ...rest}, container){
    hub.routes[path] = {
        resolve,
        redirectTo,
        tag: container.tags[name],
        ...rest
    };
    return this;
};

hub._doRoute = function(){
    return req => {
        if(!req){
            return;
        }
        var me = this;
        let isFounded = false;
        let isBreak = false;
        hub.busy = true;
        hub.trigger('busy-pending');
        function recursiveHints(hints, context){
            if(!hints.length || isBreak){
                hub.busy = false;
                hub.trigger('busy-resolve');
                return;
            }
            let path = hints[0];
            let request = {};
            let {route, params} = me._getMetaDataFromRouteMap(path);
            if(!route){
                return recursiveHints(hints.slice(1));
            }
            let tag = route.tag;
            isFounded = true;
            request.params = params;
            request.query = req.query;
            let ctx = {
                request
            };
            if(context){
                ctx = context;
            }
            if(!tag.hasOwnProperty('show') || tag.show){
                return recursiveHints(hints.slice(1), ctx);
            }
            hub.trigger('state-change', {path, ctx});
            if(route.redirectTo){
                isBreak = true;
                return riot.route(route.redirectTo);
            }
            if(route.resolve){
                return route.resolve.apply(tag, [done, ctx]);
            }
            done();
            function done(data){
                if(ctx && data){
                    !ctx.body && (ctx.body = {});
                    Object.assign(ctx.body, data);
                }
                requestAnimationFrame(()=>{
                    hub.trigger('history-pending',
                        hub.location,
                        path,
                        ctx,
                        hub._executeMiddlewares(tag, tag.$mws, pendingDone),
                    );
                });
                function pendingDone(){
                    requestAnimationFrame(()=>{
                        hub.trigger('history-resolve', hub._getMetaDataFromRouteMap(hub.location).route, route, ctx, ()=>{
                            hub.location = path;
                            recursiveHints(hints.slice(1), ctx);
                        })
                    })
                }
            }
        }
        recursiveHints(req.hints);
        if(!isFounded){
            try{
                let url = hub.defaultRoute.path;
                let paramsParts = url.match(/_[a-zA-Z0-9:]+/g);
                hub.busy = false;
                hub.trigger('busy-resolve');
                if(paramsParts && paramsParts.length){
                    paramsParts.map(part=>{
                        let key = part.slice(2);
                        let value = hub.defaultRoute.defaultRoute.params
                            && hub.defaultRoute.defaultRoute.params[key]
                            || "";
                        url = url.replace(new RegExp('_:' + key + '+'), '_' + value);
                    });
                }
                riot.route(url);
            }catch(e){
                hub.busy = false;
                hub.trigger('busy-resolve');
                console.warn(e);
                console.info('404')
            }
        }
    };
};

hub._executeMiddlewares = (component, mws, done) => {
    return function nextFn(){
        if(!mws || !mws.length){
            return done();
        }
        mws[0].call(component, () => hub._executeMiddlewares(component, mws.slice(1), done)());
    }
};

hub._getMetaDataFromRouteMap = function(routeKey){
    routeKey = '/' + routeKey;
    let keys = Object.keys(this.routes);
    for(let i=0, len=keys.length; i<len; i++){
        let k = keys[i];
        let route = this.routes[k];
        if(toPattern(k) === toPattern(routeKey)){
            let paramKeys = (extractParams(k) || []).map(i=>i.slice(2));
            let paramValues = (extractParams(routeKey) || []).map(i=>i.slice(1));
            return {
                route,
                params: composeObject(paramKeys, paramValues)
            };
        }
    }
    return {
        tag: null,
        params: null
    };
    function composeObject(ks, vs){
        var o = {};
        if(!Array.isArray(ks) || !Array.isArray(vs) || ks.length != vs.length){
            return o;
        }
        ks.forEach((k, index)=>{
            o[k] = vs[index]
        });
        return o;
    }
    function extractParams(path){
        return path.match(/_[a-zA-Z0-9:]+/g);
    }
    function toPattern(route){
        return route.replace(/_[a-zA-Z0-9:]+/g, "*");
    }
};

hub.init();

export default { hub: hub, router: (history)=>({
    defaultRoute: null,

    prefixPath: '',

    routesMap: null,

    _registerRoute: function({path, name, resolve, redirectTo}, container){
        let me = this;
        if(!me.routesMap){
            me.routesMap = {};
        }
        me.routesMap[path] = {
            name,
            resolve,
            tag: container.tags[name]};
        hub.registerRoute({path: me.prefixPath + path, name, resolve, redirectTo}, container);
        return this;
    },

    prefix: function(prefix){
        this.prefixPath = prefix;
        return this;
    },

    $use: function(fn){
        !this.$mws && (this.$mws = []);
        this.$mws.push(fn);
    },

    $routeConfig: function(routes){
        if(!this.prefixPath && this.parent && this.parent.routesMap){
            this.prefixPath = (this.parent.prefixPath || '') + getPrefix(this);
        }
        routes.forEach(route=>{
            if(route.defaultRoute){
                hub.defaultRoute = route;
            }
            hub.view.init(this.tags[route.name]);
            this._registerRoute(route, this);
        });
        function getPrefix(tag){
            let returnPath = '';
            Object.keys(tag.parent.routesMap).forEach(path=>{
                let route = tag.parent.routesMap[path];
                if(route.name === getTagName(tag)){
                    returnPath = path
                }
            });
            return returnPath;
        }
        function getTagName(tag){
            return tag.root.localName;
        }
    }
})};