/* app.js */
const API_URL = '/employees/';

let employees = [];

// Fetch initial data
async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        employees = await response.json();
        renderTable();
        updateStats();
    } catch (error) {
        showToast('Error loading employees', 'error');
        console.error('Error fetching:', error);
    }
}

// Render the employee table
function renderTable() {
    const searchFilter = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('employeeList');
    tbody.innerHTML = '';

    const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchFilter) ||
        (emp.department && emp.department.toLowerCase().includes(searchFilter))
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No employees found in the roster.</td></tr>`;
        return;
    }

    filtered.forEach(emp => {
        const tr = document.createElement('tr');
        const formattedSalary = emp.salary ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(emp.salary) : 'N/A';
        const deptBadge = emp.department ? `<span class="badge">${emp.department}</span>` : '<span class="text-secondary">-</span>';

        tr.innerHTML = `
            <td>#${emp.id}</td>
            <td style="font-weight: 500">${emp.name}</td>
            <td>${deptBadge}</td>
            <td>${formattedSalary}</td>
            <td class="actions-cell">
                <button class="btn-edit-icon" onclick="editEmployee(${emp.id})" title="Edit Employee">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-danger-icon" onclick="deleteEmployee(${emp.id})" title="Delete Employee">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Dashboard Statistics
function updateStats() {
    document.getElementById('totalCount').textContent = employees.length;

    // Average Salary
    const salariedEmps = employees.filter(e => e.salary);
    const totalSalary = salariedEmps.reduce((acc, curr) => acc + curr.salary, 0);
    const avg = salariedEmps.length > 0 ? totalSalary / salariedEmps.length : 0;
    document.getElementById('avgSalary').textContent = avg > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(avg) : '$0';

    // Unique Departments
    const depts = new Set(employees.filter(e => e.department).map(e => e.department));
    document.getElementById('deptCount').textContent = depts.size;
}

// Search filtering (triggered by onkeyup in HTML)
function filterTable() {
    renderTable();
}

// Handle Form Submit (Create & Update)
async function handleEmployeeSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('employeeId').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value || null;
    let salary = document.getElementById('salary').value;
    salary = salary ? parseInt(salary) : null;

    const payload = { name, department, salary };
    const isUpdate = !!id;

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
        const url = isUpdate ? `${API_URL}${id}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save data. Please try again.');

        closeModal('addEmployeeModal');
        showToast(`Employee gently ${isUpdate ? 'updated' : 'added'}!`, 'success');
        fetchEmployees();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Delete Employee
async function deleteEmployee(id) {
    if (!confirm('Are you certain you want to remove this employee from the roster?')) return;

    try {
        const response = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete employee.');

        showToast('Employee successfully removed.', 'success');
        fetchEmployees();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Setup Modal for Edit
function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('employeeId').value = emp.id;
    document.getElementById('name').value = emp.name;
    document.getElementById('department').value = emp.department || '';
    document.getElementById('salary').value = emp.salary || '';

    document.getElementById('modalTitle').textContent = 'Modify Employee';
    document.getElementById('submitBtn').textContent = 'Update Changes';

    openModal('addEmployeeModal');
}

// Modal controls
function openModal(modalId) {
    if (modalId === 'addEmployeeModal' && !document.getElementById('employeeId').value) {
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeId').value = '';
        document.getElementById('modalTitle').textContent = 'Add New Employee';
        document.getElementById('submitBtn').textContent = 'Save Employee';
    }
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    setTimeout(() => {
        if (modalId === 'addEmployeeModal') {
            document.getElementById('employeeForm').reset();
            document.getElementById('employeeId').value = '';
        }
    }, 300);
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Fetch initial data on load
document.addEventListener('DOMContentLoaded', fetchEmployees);
