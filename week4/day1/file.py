import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_RIobv8lu4yOg@ep-red-frost-aolfxwsd.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Fetch articles
    query = "SELECT * FROM articles LIMIT 10;"
    cursor.execute(query)

    rows = cursor.fetchall()

    print("Articles:\n")
    for row in rows:
        print(row)

    cursor.close()
    conn.close()

except Exception as e:
    print(f"An error occurred: {e}")