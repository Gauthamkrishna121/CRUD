async function sub(){
    console.log("Submit clicked");
    const name=document.getElementById("Fname").value;
    const email=document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;

    await fetch("/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            email,
            mobile
        })
    });
    loadTable();
}

async function loadTable(){
    const response =await fetch("/employees");
    const data = await response.json();
    const tbody = document.getElementById("tablemain");
    tbody.innerHTML="";
    data.forEach(emp => {
        tbody.innerHTML += `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.mobile}</td>
            <td>
            <button  onclick="delemp(${emp.id})" type="button" class="btn btn-primary">DELETE</button>
            <button type="button" class="btn btn-primary">EDIT</button>
            </td>
        </tr>
        `;
    });
}
loadTable();
async function delemp(id){
    await fetch (`/delete/${id}`,{
        method : "DELETE"
    })
    loadTable();
}