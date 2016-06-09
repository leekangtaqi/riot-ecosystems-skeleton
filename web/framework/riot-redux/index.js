var stateToOptsMap = {}; // key: state, val: (tag , fn)
export const connect = (mapStateToOpts, mapDispatchToOpts) => {
    return (tag)=>{
        let provider = recurFindProvider(tag);
        if(mapStateToOpts){
            let opts = mapStateToOpts(provider.opts.store.getState(), tag.opts);
            Object.keys(opts).map(function(opt){
                !stateToOptsMap[opt] && (stateToOptsMap[opt] = []);
                stateToOptsMap[opt].push({tag, mapStateToOpts: mapStateToOpts.toString()});
            });
            tag.opts = {...tag.opts, ...opts};
        }
        if(mapDispatchToOpts){
            let opts = mapDispatchToOpts(provider.opts.store.dispatch, tag.opts);
            tag.opts = {...tag.opts, ...opts};
        }
    }
};
export const init = store =>{
    var oldState = store.getState();
    return (provider) => {
        store.subscribe(()=>{
            let currState = store.getState();
            let callback = null;
            Object.keys(currState).map(state =>{
                if(oldState[state] !== currState[state] && stateToOptsMap[state]) {
                    callback = v=> {
                        let opts = (new Function('return func = ' + v.mapStateToOpts))()(currState, v.tag.opts);
                        Object.assign(v.tag.opts, opts);
                        v.tag.update();
                    };
                    stateToOptsMap[state].forEach(callback);
                }
            });
            oldState = currState;
        })
    }
};
const recurFindProvider = (tag) => {
    if(!tag.parent) return tag;
    return recurFindProvider(tag.parent);
};