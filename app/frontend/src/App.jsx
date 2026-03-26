import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask } from "./api";

const STATUS_OPTIONS = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" }
];

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "todo"
};

function formatStatus(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalCount = tasks.length;
  const doneCount = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks]
  );

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchTasks({ status: statusFilter, q: search.trim() });
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [statusFilter, search]);

  async function handleCreateTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status
      });

      setForm(EMPTY_FORM);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      setError("");
      await deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  }

  async function handleStatusChange(taskId, nextStatus) {
    try {
      setError("");
      await updateTask(taskId, { status: nextStatus });
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">TaskFlow</p>
          <h1>Simple team task tracker</h1>
          <p className="subtitle">
            Start with a clean app first. We'll dockerize and deploy it next.
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">Visible Tasks</span>
            <strong>{totalCount}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Done</span>
            <strong>{doneCount}</strong>
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Create task</h2>

          <form className="task-form" onSubmit={handleCreateTask}>
            <label>
              <span>Title</span>
              <input
                type="text"
                value={form.title}
                placeholder="Ex: Set up backend API"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Description</span>
              <textarea
                rows="4"
                value={form.description}
                placeholder="Add a short note..."
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Add Task"}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Tasks</h2>
            <button className="ghost-btn" onClick={loadTasks}>
              Refresh
            </button>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              No tasks found. Create your first task.
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article key={task.id} className="task-item">
                  <div className="task-main">
                    <div className="task-top">
                      <h3>{task.title}</h3>
                      <span className={`badge badge-${task.status}`}>
                        {formatStatus(task.status)}
                      </span>
                    </div>

                    <p className="task-description">
                      {task.description || "No description provided."}
                    </p>

                    <small className="timestamp">
                      Task #{task.id}
                    </small>
                  </div>

                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;