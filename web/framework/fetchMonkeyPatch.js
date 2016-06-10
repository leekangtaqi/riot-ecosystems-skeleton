function post(url, json){
    return fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
}

function get(url){
    return fetch(url, {method: 'get'})
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
}

function put(url, json){
    return fetch(url, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
}

function del(url){
    return fetch(url, {method: 'delete'})
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

function parseJSON(response) {
    try{
        return response.json()
    }catch(e){
        var error = new Error('parse json error');
        error.response = response;
        throw error;
    }
}

export {
    get,
    post,
    put,
    del
}