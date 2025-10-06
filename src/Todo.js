import React, { useState, useEffect } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000/todos";

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (title.trim() && description.trim()) {
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully ✅");
            setTitle("");
            setDescription("");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Unable to create todo item");
          }
        })
        .catch(() => setError("Unable to connect to server"));
    } else {
      setError("Title and description are required");
    }
  };

  const getItems = () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => setTodos(res))
      .catch(() => setError("Unable to fetch todos"));
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    setMessage("");

    if (editTitle.trim() && editDescription.trim()) {
      fetch(`${apiUrl}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updated = todos.map((item) =>
              item._id === editId
                ? { ...item, title: editTitle, description: editDescription }
                : item
            );
            setTodos(updated);
            setMessage("Item updated successfully ✅");
            setEditId(-1);
            setEditTitle("");
            setEditDescription("");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Unable to update todo item");
          }
        })
        .catch(() => setError("Unable to connect to server"));
    } else {
      setError("Title and description are required");
    }
  };

  const handleEditCancel = () => setEditId(-1);
  const handledelete = (id) => {
    if (window.confirm('Are you sure want to delete?')) {
      fetch(apiUrl + "/todos/" + id, {
        method:"DELETE"
      })
        .then(() => {
          const updatetodos = todos.filter((item) => item._id !== id)
          setTodos(updatetodos)
      })
    }
  }

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN Stack</h1>
      </div>

      <div className="row p-3">
        <h3>Add item</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="form-group d-flex gap-2">
          <input
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Title"
          />
          <input
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            type="text"
            placeholder="Description"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      <div className="row mt-3 ms-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId === item._id ? (
                  <>
                    <input
                      className="form-control mb-1"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      placeholder="Title"
                    />
                    <input
                      className="form-control"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId === item._id ? (
                  <>
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handledelete(item._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul></div>
        
      </div>
    </>
  );
}
