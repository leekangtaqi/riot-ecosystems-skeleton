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
function getTodos(){
    return new Promise(function(resolve){
        resolve({
            type: 'getTodos',
            payload: ''
        })
    })
}
function visibilityTodos(type){
    return {
        type: 'visibilityTodos',
        payload: type
    }
}

export default {addTodo, toggleDoneTodo, getTodos, visibilityTodos}