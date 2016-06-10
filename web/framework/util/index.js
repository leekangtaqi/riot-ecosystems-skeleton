export const values = (o) => {
    return Object.keys(o).map(k=>o[k])
}
export const mixin = (...args) => {
    return Object.assign(...args)
}
export default {values, mixin}