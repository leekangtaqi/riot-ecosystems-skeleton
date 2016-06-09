import Immutable from 'immutable';

function todos(todos = Immutable.List([Immutable.Map({name: '111'})]), action){
    switch (action.type){
        case 'addTodo':
            return todos.push(Immutable.Map({name: action.payload}));
        default:
            return todos;
    }
}

export default {todos}