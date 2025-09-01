import React, { useEffect, useState, useContext } from 'react';
import * as empApi from '../../api/employee.js';
import Table from '../Shared/Table.jsx';
import Input from '../Shared/Input.jsx';
import Button from '../Shared/Button.jsx';
import { ToastContext } from '../../contexts/ToastContext.jsx';
import { Pencil, Trash2 } from 'lucide-react';

export default function EmployeeManagement() {
  const { notify } = useContext(ToastContext);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    hourlyRate: 20,
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const data = await empApi.listEmployees();
      setList(data);
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ name: '', email: '', role: 'EMPLOYEE', hourlyRate: 20 });
    setEditingId(null);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await empApi.updateEmployee(editingId, form);
        notify('Employee updated', 'success');
      } else {
        await empApi.createEmployee(form);
        notify('Employee created', 'success');
      }
      resetForm();
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const edit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      hourlyRate: emp.hourlyRate,
    });
    setEditingId(emp._id); // use MongoDB _id
  };

  const del = async (id) => {
    if (!confirm('Delete employee?')) return;
    try {
      await empApi.deleteEmployee(id); // send _id to API
      notify('Employee deleted', 'success');
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
    { header: 'Hourly Rate', key: 'hourlyRate' },
    {
      header: 'Status',
      render: (r) =>
        r.isActive ? (
          <span className="badge approved">Active</span>
        ) : (
          <span className="badge rejected">Inactive</span>
        ),
    },
    {
      header: 'Actions',
      render: (r) => (
        <div className="row gap-sm">
          <Button size="icon" variant="ghost" onClick={() => edit(r)}>
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => del(r._id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <h3>Employee Management</h3>
      <div className="grid cols-3 gap-md">
        <form onSubmit={save} className="stack gap-sm">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label className="stack">
            <span className="muted">Role</span>
            <select
              className="select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>EMPLOYEE</option>
              <option>MANAGER</option>
              <option>HR_ADMIN</option>
            </select>
          </label>
          <Input
            label="Hourly Rate"
            type="number"
            value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: +e.target.value })}
          />
          <div className="row gap-sm">
            <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <Table columns={columns} data={list} getRowKey={(r) => r._id} />
      </div>
    </div>
  );
}
