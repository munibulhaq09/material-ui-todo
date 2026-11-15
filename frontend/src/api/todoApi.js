import api from "./api";

//all tasks
export const getTodo = () =>{
    return api.get("/todos");
};

//add new
export const addTodo = (todoData)=>{
    return api.post("/todos", todoData);
};

//update
export const updateTodo = (id, todoData)=>{
    return api.put("/todos/" + id, todoData);
};

//delete
export const deleteTodo = (id) => {
    return api.delete("/todos/" + id);
};