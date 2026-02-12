import sqlite3

# Connect to database
conn = sqlite3.connect('sla_guard.db')
cursor = conn.cursor()

# Check tickets
cursor.execute('SELECT COUNT(*) FROM tickets')
total_tickets = cursor.fetchone()[0]
print(f'Total tickets in database: {total_tickets}')

if total_tickets > 0:
    print('\nSample tickets:')
    cursor.execute('SELECT id, title, status, priority, assignee_id, created_by_user_id FROM tickets LIMIT 10')
    for row in cursor.fetchall():
        print(f'  ID: {row[0]}, Title: {row[1]}, Status: {row[2]}, Priority: {row[3]}, Assignee: {row[4]}, Creator: {row[5]}')

# Check users
print('\nUsers in database:')
cursor.execute('SELECT id, email, role FROM users')
for row in cursor.fetchall():
    print(f'  ID: {row[0]}, Email: {row[1]}, Role: {row[2]}')

conn.close()
