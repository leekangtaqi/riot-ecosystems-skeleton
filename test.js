var o1 = {name: '111', auth: {token:'11'}, arr: [1, 2]}
var o2 = Object.assign({}, ...o1, {name: '222'});
console.log(o2)
