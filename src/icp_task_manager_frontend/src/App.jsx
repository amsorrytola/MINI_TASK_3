import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { icp_task_manager_backend } from "../../declarations/icp_task_manager_backend";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  console.log("Canister ID:", process.env.CANISTER_ID_ICP_TASK_MANAGER_BACKEND);
  console.log("Actor:", icp_task_manager_backend);

  const fetchTasks = async () => {
    const result = await icp_task_manager_backend.get_tasks();
    setTasks(result);
  };

  const handleCreate = async () => {
    await icp_task_manager_backend.create_task(form.title, form.description);
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await icp_task_manager_backend.delete_task(id);
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await icp_task_manager_backend.update_task(
      task.id,
      task.title,
      task.description,
      !task.completed
    );
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1>ICP Task Manager</h1>
      <div>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button onClick={handleCreate}>Add Task</button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <b>{t.title}</b>: {t.description} [{t.completed ? "✅" : "❌"}]
            <button onClick={() => handleToggle(t)}>Toggle</button>
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
