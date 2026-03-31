const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchTasks({ status = "", q = "" } = {}) {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (q) params.append("q", q);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  return handleResponse(response);
}

export async function createTask(payload) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export async function updateTask(taskId, payload) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}