const mask = (mask=true, action) => {
    switch (action.type){
        case 'maskShow':
            mask = true;
            return mask;
        case 'maskHidden':
            mask = false;
            return mask;
        default:
            return mask;
    }
};
export default {mask}