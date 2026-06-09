let selectedEmployeeId = null;
const employeeForm = document.getElementById("employeeForm");
const resetFormBtn = document.getElementById("resetFormBtn");
const formStatus = document.getElementById("formStatus");
const employeeCount = document.getElementById("employeeCount");
const tableBadge = document.getElementById("tableBadge");
const searchSummary = document.getElementById("searchSummary");

function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function setFieldValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function formatDisplayName(employee) {
    const parts = [];
    if (employee.salutation) parts.push(employee.salutation);
    if (employee.first_name) parts.push(employee.first_name);
    if (employee.last_name) parts.push(employee.last_name);
    return parts.length ? parts.join(" ") : employee.name || "";
}

async function submitEmployee(event) {
    event.preventDefault();

    const payload = {
        salutation: getFieldValue("Sa_select"),
        first_name: getFieldValue("Fname"),
        last_name: getFieldValue("Lname"),
        email: getFieldValue("email"),
        mobile: getFieldValue("mobile"),
        dob: getFieldValue("dob"),
        gender: document.querySelector('input[name="gender"]:checked')?.value || ""
    };

    if (!payload.first_name || !payload.last_name || !payload.email || !payload.mobile) {
        formStatus.textContent = "Please fill in first name, last name, email, and mobile.";
        return;
    }

    const url = selectedEmployeeId ? `/employees/${selectedEmployeeId}` : "/add";
    const method = selectedEmployeeId ? "PUT" : "POST";
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        formStatus.textContent = "Unable to save employee.";
        return;
    }

    resetForm();
    await loadTable();
    formStatus.textContent = selectedEmployeeId ? "Employee updated." : "Employee saved.";
}

function resetForm() {
    selectedEmployeeId = null;
    employeeForm.reset();
    formStatus.textContent = "Awaiting input";
    const submitButton = document.querySelector('#employeeForm button[type="submit"]');
    if (submitButton) submitButton.textContent = "Save Employee";
}

async function loadTable() {
    const response = await fetch("/employees");
    const data = await response.json();
    const tbody = document.getElementById("tablemain");
    tbody.innerHTML = "";

    data.forEach(emp => {
        const displayName = formatDisplayName(emp);
        tbody.innerHTML += `
        <tr>
            <td>${emp.id}</td>
            <td class="name-cell"><strong>${displayName}</strong></td>
            <td>${emp.email}</td>
            <td>${emp.mobile}</td>
            <td>
                <div class="action-stack">
                    <button type="button" class="mini-btn" onclick="handleEdit(${emp.id})">Edit</button>
                    <button type="button" class="mini-btn delete" onclick="handleDelete(${emp.id})">Delete</button>
                </div>
            </td>
        </tr>
        `;
    });

    employeeCount.textContent = data.length;
    tableBadge.textContent = `${data.length} records`;
    searchSummary.textContent = data.length ? `${data.length} employees loaded.` : "No employees yet.";
}

window.handleEdit = async function (id) {
    const response = await fetch("/employees");
    const data = await response.json();
    const employee = data.find(emp => emp.id === id);
    if (!employee) {
        formStatus.textContent = "Employee not found.";
        return;
    }

    selectedEmployeeId = employee.id;
    setFieldValue("Sa_select", employee.salutation || "");
    setFieldValue("Fname", employee.first_name || "");
    setFieldValue("Lname", employee.last_name || "");
    setFieldValue("email", employee.email || "");
    setFieldValue("mobile", employee.mobile || "");
    setFieldValue("dob", employee.dob || "");

    if (employee.gender) {
        const genderInput = document.querySelector(`input[name="gender"][value="${employee.gender}"]`);
        if (genderInput) genderInput.checked = true;
    }

    const submitButton = document.querySelector('#employeeForm button[type="submit"]');
    if (submitButton) submitButton.textContent = "Update Employee";
    formStatus.textContent = `Editing employee #${id}`;
    window.location.hash = "#employeeForm";
};

window.handleDelete = async function (id) {
    if (!confirm("Delete this employee?")) {
        return;
    }

    const response = await fetch(`/employees/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        formStatus.textContent = "Delete failed.";
        return;
    }

    if (selectedEmployeeId === id) {
        resetForm();
    }

    await loadTable();
    formStatus.textContent = `Employee #${id} removed.`;
};

if (employeeForm) {
    employeeForm.addEventListener("submit", submitEmployee);
}

if (resetFormBtn) {
    resetFormBtn.addEventListener("click", resetForm);
}

document.addEventListener("DOMContentLoaded", loadTable);
