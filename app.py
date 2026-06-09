from flask import Flask,render_template,request,jsonify
import json 
import os 
app = Flask(__name__)
DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE,"r")as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE,"w") as file:
        json.dump(data,file,indent=4)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/add", methods=["POST"])
def add_employees():

    data = request.get_json()

    employees = load_data()

    employee = {
        "id": len(employees) + 1,
        "name": data["name"],
        "email": data["email"],
        "mobile":data["mobile"]
    }

    employees.append(employee)

    save_data(employees)

    return jsonify(employee)
    
@app.route("/employees",methods=["GET"])
def get_employees():
    employees =load_data()
    print(employees)
    return jsonify(employees)



if __name__=="__main__":
    app.run(debug=True)