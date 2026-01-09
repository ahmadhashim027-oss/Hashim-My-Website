// Components/AdminComponents/ApparenticeList.js
"use client";

import React, { useState, useEffect } from "react";

export default function ApparenticeList() {
  const [apprentices, setApprentices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    adminNotes: ""
  });

  useEffect(() => {
    fetchApprentices();
  }, []);

  const fetchApprentices = async () => {
    try {
      const res = await fetch("/api/apprentice/signup");
      const data = await res.json();
      if (data.success) {
        setApprentices(data.apprentices);
      }
    } catch (error) {
      console.error("Error fetching apprentices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch("/api/admin/apprentice/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apprenticeId: id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Apprentice approved!");
        fetchApprentices(); // Refresh list
      }
    } catch (error) {
      console.error("Error approving apprentice:", error);
    }
  };

  const handleOpenAssignTask = (apprentice) => {
    setSelectedApprentice(apprentice);
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      adminNotes: ""
    });
    setShowAssignTaskModal(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apprenticeId: selectedApprentice._id,
          ...taskForm
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Task assigned successfully!");
        setShowAssignTaskModal(false);
        fetchApprentices(); // Refresh to show new task
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading apprentices...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Apprentice List</h2>
      </div>

      {apprentices.length === 0 ? (
        <p>No apprentices found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skill</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apprentices.map((apprentice) => (
                <tr key={apprentice._id}>
                  <td>{apprentice.fullName}</td>
                  <td>{apprentice.email}</td>
                  <td>{apprentice.skill || "Not selected"}</td>
                  <td>
                    {apprentice.approved ? (
                      <span className="badge bg-success">Approved</span>
                    ) : (
                      <span className="badge bg-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {apprentice.tasks?.length || 0} tasks
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      {!apprentice.approved && (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleApprove(apprentice._id)}
                        >
                          Approve
                        </button>
                      )}
                      {apprentice.approved && apprentice.skill && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleOpenAssignTask(apprentice)}
                        >
                          Assign Task
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTaskModal && selectedApprentice && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Assign Task to {selectedApprentice.fullName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAssignTaskModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAssignTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={taskForm.dueDate}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={taskForm.adminNotes}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, adminNotes: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-muted">
                    Skill: {selectedApprentice.skill}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAssignTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}