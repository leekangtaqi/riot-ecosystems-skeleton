function addTodo(text){
    return {
        type: 'addTodo',
        payload: text
    }
}
function getTodos(){
    
}
export default {addTodo, getTodos}