<<<<<<< HEAD
﻿async function sub(){
    console.log("Submit clicked");
    const name=document.getElementById("Fname").value;
    const lname=document.getElementById("Lname").value;
    const email=document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const dob = document.getElementById("dob").value;

    await fetch("/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            lname,
            email,
            mobile,
            dob
        })
    });
    loadTable();
}

async function loadTable(){
=======
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

function formatSalutation(s) {
    if (!s) return "";
    const key = String(s).trim().toLowerCase().replace(".", "");
    if (key === "mr") return "Mr.";
    if (key === "mrs") return "Mrs.";
    if (key === "ms") return "Ms.";
    const cap = s.charAt(0).toUpperCase() + s.slice(1);
    return cap.endsWith(".") ? cap : cap + ".";
}

function formatDisplayName(employee) {
    const parts = [];
    const sal = formatSalutation(employee.salutation || "");
    if (sal) parts.push(sal);
    if (employee.first_name) parts.push(employee.first_name);
    if (employee.last_name) parts.push(employee.last_name);
    return parts.length ? parts.join(" ") : employee.name || "";
}

function computeProgress() {
    const fields = [
        document.getElementById("Sa_select"),
        document.getElementById("Fname"),
        document.getElementById("Lname"),
        document.getElementById("email"),
        document.getElementById("mobile"),
        document.getElementById("dob"),
        document.querySelector('input[name="gender"]:checked')
    ];
    let filled = 0;
    fields.forEach(f => {
        if (!f) return;
        if (f.tagName === 'INPUT' || f.tagName === 'SELECT') {
            if (f.value && String(f.value).trim() !== '') filled += 1;
        } else {
            if (f) filled += 1;
        }
    });
    const percent = Math.round((filled / 7) * 100);
    return percent;
}

function updateProgressUI() {
    const p = computeProgress();
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    if (progressText) progressText.textContent = `${p}%`;
    if (progressBar) progressBar.style.width = `${p}%`;
    const progressTrack = document.querySelector('.form-progress');
    if (progressTrack) {
        if (p === 100) progressTrack.classList.add('is-complete');
        else progressTrack.classList.remove('is-complete');
    }
}

function wireProgressListeners() {
    const ids = ["Sa_select","Fname","Lname","email","mobile","dob"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateProgressUI);
    });
    const genderEls = document.querySelectorAll('input[name="gender"]');
    genderEls.forEach(g => g.addEventListener('change', updateProgressUI));
}

async function submitEmployee(event) {
    event && event.preventDefault && event.preventDefault();

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
        if (formStatus) formStatus.textContent = "Please fill required fields.";
        return;
    }

    const url = selectedEmployeeId ? `/employees/${selectedEmployeeId}` : "/add";
    const method = selectedEmployeeId ? "PUT" : "POST";
    const response = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        if (formStatus) formStatus.textContent = "Unable to save employee.";
        return;
    }

    resetForm();
    await loadTable();
    if (formStatus) formStatus.textContent = selectedEmployeeId ? "Employee updated." : "Employee saved.";
}

function resetForm() {
    selectedEmployeeId = null;
    if (employeeForm) employeeForm.reset();
    if (formStatus) formStatus.textContent = "Awaiting input";
    const submitButton = document.querySelector('#employeeForm button[type="submit"]');
    if (submitButton) submitButton.textContent = "Save Employee";
    updateProgressUI();
}

async function loadTable() {
>>>>>>> bdb856ac1c0db84810718a27108be12d98618bd5
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
<<<<<<< HEAD
            <button  onclick="delemp(${emp.id})" type="button" class="btn btn-primary">DELETE</button>
            <button type="button" class="btn btn-primary">EDIT</button>
=======
                <div class="action-stack">
                    <button type="button" class="mini-btn" onclick="handleEdit(${emp.id})">Edit</button>
                    <button type="button" class="mini-btn delete" onclick="handleDelete(${emp.id})">Delete</button>
                </div>
>>>>>>> bdb856ac1c0db84810718a27108be12d98618bd5
            </td>
        </tr>
        `;
    });

    if (employeeCount) employeeCount.textContent = data.length;
    if (tableBadge) tableBadge.textContent = `${data.length} records`;
    if (searchSummary) searchSummary.textContent = data.length ? `${data.length} employees loaded.` : "No employees yet.";
}
<<<<<<< HEAD
loadTable();

async function delemp(id){
    await fetch (`/delete/${id}`,{
        method : "DELETE"
    })
    loadTable();
}
=======

window.handleEdit = async function (id) {
    const response = await fetch("/employees");
    const data = await response.json();
    const employee = data.find(emp => emp.id === id);
    if (!employee) {
        if (formStatus) formStatus.textContent = "Employee not found.";
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
    if (formStatus) formStatus.textContent = `Editing employee #${id}`;
    updateProgressUI();
    window.location.hash = "#employeeForm";
};

window.handleDelete = async function (id) {
    if (!confirm("Delete this employee?")) return;
    const response = await fetch(`/employees/${id}`, {method: "DELETE"});
    if (!response.ok) {
        if (formStatus) formStatus.textContent = "Delete failed.";
        return;
    }
    if (selectedEmployeeId === id) resetForm();
    await loadTable();
    if (formStatus) formStatus.textContent = `Employee #${id} removed.`;
};

if (employeeForm) employeeForm.addEventListener("submit", submitEmployee);
if (resetFormBtn) resetFormBtn.addEventListener("click", resetForm);

document.addEventListener('DOMContentLoaded', () => {
    wireProgressListeners();
    updateProgressUI();
    loadTable();
});
>>>>>>> bdb856ac1c0db84810718a27108be12d98618bd5
