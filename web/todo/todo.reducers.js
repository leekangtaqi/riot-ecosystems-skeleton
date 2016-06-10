var id = 1;

function todos(todos = [{id: 0, name: 'init', isDone: false}], action){
    switch (action.type){
        case 'addTodo':
            return [...todos, {name: action.payload, isDone: false, id: id++}];
        case 'toggleDoneTodo':
            return todos.map(todo=>{
                if(todo.id === action.payload){
                    todo.isDone = !todo.isDone;
                    return todo;
                }
                return todo
            });
        case 'getTodos':
            return todos;
        default:
            return todos;
    }
}

function visibility(visibility = 'all', action){
    if(action.type === 'visibilityTodos'){
        visibility = action.payload;
        return visibility;
    }
    return visibility;
}

export default {todos, visibility}