var stateToOptsMap = {}; // key: state, val: (tag , fn)

export const connect = (mapStateToOpts, mapDispatchToOpts) => {
    return tag => {
        let provider = recurFindProvider(tag);
        if(mapStateToOpts){
            let opts = mapStateToOpts(provider.opts.store.getState(), tag.opts);
            Object.keys(opts).map(opt => {
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

export const provide = store =>{
    var oldState = store.getState();
    return provider => {
        store.subscribe(()=>{
            let currState = store.getState();
            let callback = null;
            Object.keys(currState).map(s => {
                if((oldState[s] !== currState[s]) && stateToOptsMap[s]) {
                    callback = v => {
                        let opts = (new Function('return func = ' + v.mapStateToOpts))()(currState, v.tag.opts);
                        let mutableOpts = Object.keys(opts)
                            .filter(opt => v.tag.opts[opt] !== opts[opt]);
                        if(mutableOpts && mutableOpts.length){
                            Object.assign(v.tag.opts, opts);
                            v.tag.update();
                        }
                    };
                    stateToOptsMap[s].forEach(callback);
                }
            });
            oldState = currState;
        })
    }
};

const recurFindProvider = tag => {
    if(!tag.parent) return tag;
    return recurFindProvider(tag.parent);
};