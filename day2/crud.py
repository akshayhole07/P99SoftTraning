from fastapi import FastAPI, Request
from psycopg2 import pool

app = FastAPI()

# ================= DB CONNECTION POOL =================
db_pool = pool.SimpleConnectionPool(
    1, 10,
    host="localhost",
    database="newdb",
    user="postgres",
    password="root",   # change if needed
    port=5432
)

def get_connection():
    return db_pool.getconn()

def release_connection(conn):
    db_pool.putconn(conn)


# ================= CREATE =================
@app.post("/items")
async def create_item(request: Request):
    data = await request.json()

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO items (name, price) VALUES (%s, %s) RETURNING id",
            (data.get("name"), data.get("price"))
        )

        item_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "id": item_id,
            "name": data.get("name"),
            "price": data.get("price")
        }

    finally:
        cursor.close()
        release_connection(conn)

# By the Scratch 
@app.get("/")
def return_message():
    return {"message": "Hello, World!"}


# ================= READ ALL =================
@app.get("/items")
def get_items():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM items")
        rows = cursor.fetchall()

        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "name": row[1],
                "price": row[2]
            })

        return result

    finally:
        cursor.close()
        release_connection(conn)


# ================= READ ONE =================
@app.get("/items/{item_id}")
def get_item(item_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM items WHERE id = %s", (item_id,))
        row = cursor.fetchone()

        if row:
            return {
                "id": row[0],
                "name": row[1],
                "price": row[2]
            }
        return {"error": "Item not found"}

    finally:
        cursor.close()
        release_connection(conn)


# ================= UPDATE =================
@app.put("/items/{item_id}")
async def update_item(item_id: int, request: Request):
    data = await request.json()   # ✅ FIXED

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "UPDATE items SET name = %s, price = %s WHERE id = %s",
            (data.get("name"), data.get("price"), item_id)
        )

        conn.commit()
        return {"message": "Item updated"}

    finally:
        cursor.close()
        release_connection(conn)


# ================= DELETE =================
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
        conn.commit()
        return {"message": "Item deleted"}

    finally:
        cursor.close()
        release_connection(conn)