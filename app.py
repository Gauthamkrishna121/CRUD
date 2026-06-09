from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

def get_next_id(employees):
    if not employees:
        return 1
    return max(employee.get("id", 0) for employee in employees) + 1

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/add", methods=["POST"])
def add_employees():
    data = request.get_json()
    employees = load_data()

    employee = {
        "id": get_next_id(employees),
        "salutation": data.get("salutation", ""),
        "first_name": data.get("first_name", ""),
        "last_name": data.get("last_name", ""),
        "email": data.get("email", ""),
        "mobile": data.get("mobile", ""),
        "dob": data.get("dob", ""),
        "gender": data.get("gender", "")
    }

    employees.append(employee)
    save_data(employees)

    return jsonify(employee)

@app.route("/employees", methods=["GET"])
def get_employees():
    employees = load_data()
    return jsonify(employees)

@app.route("/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):
    data = request.get_json()
    employees = load_data()

    for employee in employees:
        if employee.get("id") == employee_id:
            employee["salutation"] = data.get("salutation", employee.get("salutation", ""))
            employee["first_name"] = data.get("first_name", employee.get("first_name", ""))
            employee["last_name"] = data.get("last_name", employee.get("last_name", ""))
            employee["email"] = data.get("email", employee.get("email", ""))
            employee["mobile"] = data.get("mobile", employee.get("mobile", ""))
            employee["dob"] = data.get("dob", employee.get("dob", ""))
            employee["gender"] = data.get("gender", employee.get("gender", ""))
            save_data(employees)
            return jsonify(employee)

    return jsonify({"error": "Employee not found"}), 404

@app.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    employees = load_data()
    filtered = [employee for employee in employees if employee.get("id") != employee_id]

    if len(filtered) == len(employees):
        return jsonify({"error": "Employee not found"}), 404

    save_data(filtered)
    return jsonify({"message": "Employee deleted"})

if __name__ == "__main__":
    app.run(debug=True)
