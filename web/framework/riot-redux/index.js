var stateToOptsMap = {}; // key: state, val: (tag , fn)
export const connect = (mapStateToOpts, mapDispatchToOpts) => {
    return (tag)=>{
        if(!mapStateToOpts){
            throw new Error(`connect expected a mapStateToOpts function`);
        }
        let provider = recurFindProvider(tag);
        let opts = mapStateToOpts(provider.opts.store.getState(), tag.opts);
        Object.keys(opts).map(function(opt){
            !stateToOptsMap[opt] && (stateToOptsMap[opt] = []);
            stateToOptsMap[opt].push({tag, mapStateToOpts: mapStateToOpts.toString()});
            console.log(stateToOptsMap[opt])
        });
        tag.opts = {...tag.opts, ...opts};
        
        if(mapDispatchToOpts){
            let opts = mapDispatchToOpts(provider.opts.store.dispatch, tag.opts);
            tag.opts = {...tag.opts, ...opts};
        }
    }
};
export const init = store =>{
    var oldState = store.getState();
    return (provider) => {
        var off = store.subscribe(()=>{
            let currState = store.getState();
            let callback = null;
            Object.keys(currState).map(state =>{
                if(typeof currState[state] != 'object'){
                    if(oldState[state] != currState[state]){
                        callback= v =>{
                            Object.assign(v.tag.opts, {[state]: currState[state]});
                            v.tag.update()
                        };
                    }
                }else{
                    if(!oldState[state].equals(currState[state])) {
                        callback = v=> {
                            let opts = (new Function('return func = ' + v.mapStateToOpts))()(currState, v.tag.opts);
                            Object.assign(v.tag.opts, opts);
                            v.tag.update();
                        }
                    }
                }
                stateToOptsMap[state].forEach(callback);
            });
            oldState = currState;
        })
        off();
    }
};
const recurFindProvider = (tag) => {
    if(!tag.parent) return tag;
    return recurFindProvider(tag.parent);
};