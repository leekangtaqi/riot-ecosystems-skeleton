function addTodo(text){
    return {
        type: 'addTodo',
        payload: text
    }
}
function toggleDoneTodo(id){
    return {
        type: 'toggleDoneTodo',
        payload: id
    }
}
function visibilityTodos(type){
    return {
        type: 'visibilityTodos',
        payload: type
    }
}

export default {addTodo, toggleDoneTodo, visibilityTodos}