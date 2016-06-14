function addTodo(text){
    console.log($.get)
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
function getTodos(callback){
    return new Promise(function(resolve){
        resolve({
            type: 'getTodos',
            payload: ''
        })
    }).then(function(res){
        callback && callback();
        return res
    })
}
function visibilityTodos(type){
    return {
        type: 'visibilityTodos',
        payload: type
    }
}

export default {addTodo, toggleDoneTodo, getTodos, visibilityTodos}