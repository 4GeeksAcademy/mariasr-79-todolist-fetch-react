import React, { useEffect, useState } from "react";
import imagen from "./../../img/coffee-1137689_640.jpg";
import "./../../styles/home.css";


//create your first component
const Home = () => {
	const [task, setTask] = useState("");
	const [tasks, setTasks] = useState([]);
	const [user, setUser] = useState({ todos: [] });
	const [editTaskId, setEditTaskId] = useState(null);
	const [editTaskLabel, setEditTaskLabel] = useState("");


	const createUser = async () => {
		try {
			const resp = await fetch("https://playground.4geeks.com/todo/users/mariasr-79", { method: "POST" });
			if (resp.ok) {
				alert("usuario creado correctamente");
				getUser();
			} else {
				alert("error al crear el usuario");
			}
		} catch (error) {
			console.error("Error en createUser:", error);
			alert("Hubo un problema al crear el usuario");
		}
	}

	const getUser = async () => {
		try {
			const resp = await fetch("https://playground.4geeks.com/todo/users/mariasr-79");
			if (resp.ok) {
				const userData = await resp.json();
				setUser(userData);
			} else {
				createUser();
			}
		} catch (error) {
			console.error("Error en getUser:", error);
			alert("Hubo un problema al obtener el usuario");
		}
	};

	useEffect(() => {
		getUser();
	}, [])

	const createTask = async (task) => {
		try {
			const resp = await fetch("https://playground.4geeks.com/todo/todos/mariasr-79", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({ "label": task, "is_done": false })
			});

			if (resp.ok) {
				const respJson = await resp.json();
				const updatedTasks = [...user.todos, respJson];
				setUser({ ...user, todos: updatedTasks });
			} else {
				alert("Error al crear tarea");
			}
		} catch (error) {
			console.error("Error en createTask:", error);
			alert("Hubo un problema al crear la tarea");
		}
	}

	const validateTask = (task) => {
		if (!task || !task.trim()) {
			alert("El valor de la tarea no puede ser vacío");
			return;
		}
		createTask(task);
		setTask("");
	}

	const deleteTask = async (task) => {
		const id = task.id;
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE" });
			if (resp.ok) {
				const updatedTasks = user.todos.filter(item => item.id !== task.id);
				setUser({ ...user, todos: updatedTasks });
			} else {
				alert("Error al eliminar tarea");
			}
		} catch (error) {
			console.error("Error en deleteTask:", error);
			alert("Hubo un problema al eliminar la tarea");
		}
	}
	const updateTask = async (taskId) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
				method: "PUT",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					label: editTaskLabel,
					is_done: user.todos.find(task => task.id === taskId).is_done // Mantener el estado actual de la tarea
				})
			});

			if (resp.ok) {
				const updatedTask = await resp.json();
				const updatedTasks = user.todos.map(task =>
					task.id === taskId ? updatedTask : task
				);
				setUser({ ...user, todos: updatedTasks });
				setEditTaskId(null);
			} else {
				alert("Error al actualizar tarea");
			}
		} catch (error) {
			console.error("Error en updateTask:", error);
			alert("Hubo un problema al actualizar la tarea");
		}
	}


	return (
		<>
			<div className="header">
				<h1 className="text-center mt-5">Lista de Tareas</h1>
				<img src={imagen} className="task-image" alt="Coffee" />
			</div>
			<div className="container">
				<div className="todolist">
					<input
						className="task-input"
						placeholder="Add task"
						onChange={(event) => setTask(event.target.value)}
						onKeyDown={(event) => event.key === "Enter" && validateTask(task)}
						type="text"
						value={task} />

					{user && user.todos.map((item) => (
						<li key={item.id} className="task-item">
							{editTaskId === item.id ? (
								<div className="edit-form">
									<input
										value={editTaskLabel}
										onChange={(e) => setEditTaskLabel(e.target.value)}
										className="edit-input" />
									<button onClick={() => updateTask(item.id)} className="save-button">Save</button>
									<button onClick={() => setEditTaskId(null)} className="cancel-button">Cancel</button>
								</div>
							) : (
								<div>
									{item.label}
									<button onClick={() => { setEditTaskId(item.id); setEditTaskLabel(item.label); }} className="edit-button">Edit</button>
									<span onClick={() => deleteTask(item)} className="delete-button"> <i className="fas fa-trash-alt"></i></span>
								</div>
							)}
						</li>
					))}
				</div><p className="text-center">
					{user && user.todos.length ?
						<span>Tienes {user.todos.length} tareas pendientes</span> :
						<span> No hay tareas pendientes</span>}

				</p>

			</div>
		</>


	);
}


export default Home;
