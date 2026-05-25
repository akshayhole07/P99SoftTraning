from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()


@app.get("/getinfo")
def getInfo():
    return {"message": "This is a GET request"}

@app.post("/add")
def addTwoNumbers(num1: int, num2: int):
    result = num1 + num2
    return {"result": result}


@app.get("/square/{num}")
def returnSquare(num: int):
    result = num * num
    return {"result": result}

 
class User(BaseModel):
    name: str
    email: str

list = []
@app.post("/users")
def create_user(user: User):
    list.append(user)
    return {
        "message": "User created",
        "data": user
    }

@app.get("/users")
def get_users():
    return {"data": list}
