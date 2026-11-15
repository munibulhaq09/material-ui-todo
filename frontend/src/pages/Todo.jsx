import { useEffect, useState } from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import {
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo
} from "../api/todoApi";

function Todo({ user, onLogout }) {

    const [todos, setTodos] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);

    const [error, setError] = useState("");

    // Fetch todos from backend
    const loadTodos = async () => {
        try {
            const response = await getTodo();

            setTodos(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.todos || []
            );

        } catch (err) {
            console.error("Get todos error:", err);
            setError("Unable to load todos.");
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    // Add or update todo
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required");
            return;
        }

        try {

            const todoData = {
                title: title.trim(),
                description: description.trim()
            };

            if (editId) {
                await updateTodo(editId, todoData);
            } else {
                await addTodo(todoData);
            }

            setTitle("");
            setDescription("");
            setEditId(null);

            loadTodos();

        } catch (err) {
            console.error("Save todo error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to save todo."
            );
        }
    };

    // Edit todo
    const handleEdit = (todo) => {
        setTitle(todo.title);
        setDescription(todo.description);
        setEditId(todo._id);
    };

    // Delete todo
    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            loadTodos();
        } catch (err) {
            console.error("Delete todo error:", err);
            setError("Unable to delete todo.");
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setEditId(null);
        setError("");
    };

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" sx={{ bgcolor: "#222" }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, fontWeight: "bold" }}
                    >
                        TodoApp
                    </Typography>

                    <Typography sx={{ mr: 2 }}>
                        {user?.name}
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg">

                <Typography
                    variant="h4"
                    textAlign="center"
                    fontWeight="bold"
                    sx={{ mt: 5, mb: 4 }}
                >
                    ToDo List
                </Typography>

                {/* Todo Form */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, mb: 4 }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            sx={{ flex: 1, minWidth: 200 }}
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            sx={{ flex: 2, minWidth: 200 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ minWidth: 110 }}
                        >
                            {editId ? "Update" : "Add Task"}
                        </Button>

                        {editId && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        )}

                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                </Paper>

                {/* Todo Table */}
                <TableContainer component={Paper}>

                    <Table>

                        <TableHead sx={{ bgcolor: "#e0e0e0" }}>
                            <TableRow>
                                <TableCell><strong>S.No</strong></TableCell>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell align="center">
                                    <strong>Action</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {todos.map((todo, index) => (

                                <TableRow key={todo._id}>

                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                        {todo.title}
                                    </TableCell>

                                    <TableCell>
                                        {todo.description}
                                    </TableCell>

                                    <TableCell align="center">

                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            sx={{ mr: 1 }}
                                            onClick={() =>
                                                handleEdit(todo)
                                            }
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            onClick={() =>
                                                handleDelete(todo._id)
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))}

                            {todos.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                    >
                                        No tasks found.
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Container>
        </>
    );
}

export default Todo;
