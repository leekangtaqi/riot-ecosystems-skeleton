var id = 0;

function todos(todos = [], action){
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