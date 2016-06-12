const rendererCreator = (router) => {
    let renderer = {
        enter: (tag, from, callback)=> {
            if(!tag){
                return;
            }
            tag.trigger('enter', from);
            tag.show = true;
            tag.hidden = false;
            tag.update();
        },

        leave: (tag, to, callback)=> {
            if(!tag){
                return;
            }
            tag.trigger('leave', to);
            if(tag.hasOwnProperty('show')){
                tag.show = false;
                tag.hidden = true;
                tag.update();
            }
        },

        init: (tag)=> {
            tag.hidden = true;
            tag.show = false;
        }
    };
    router.on('history-resolve', (source, target, ctx, next)=>{
        let sourceTag = source && source.tag || null;
        let targetTag = target && target.tag || null;
        renderer.enter(targetTag, sourceTag);
        Object.keys(targetTag.parent.tags)
            .map(k=>targetTag.parent.tags[k])
            .filter(t=>t!=targetTag)
            .forEach(t=>{
                if(t.show){
                    renderer.leave(t, targetTag)
                }
            });
        next();
    });
    return　renderer;
};

export default rendererCreator;

