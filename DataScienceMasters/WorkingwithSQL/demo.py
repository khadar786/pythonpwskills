import mysql.connector
mydb=mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="pwskillsdb1"
)

mycursor=mydb.cursor(dictionary=True)
#mycursor.execute("show tables")
#myresult=mycursor.fetchall()

#for i in myresult:
#    print(i)

#Inserting
# q1="""INSERT INTO users(fname,lname,email,mobileno,status) VALUES(%s,%s,%s,%s,%s)"""
# values=[
#  ('Peter', 'Lows','peter@gmail.com','7878745454',1),
#  ('Amy', 'Apple','amy@gmail.com','7878745412',1),
#  ('Hannah', 'Mountain','hannah@gmail.com','7878745413',1),
#  ('Michael', 'Valley','michael@gmail.com','7878745414',1),
#  ('Sandy', 'Ocean','sandy@gmail.com','7878745415',1),
#  ('Betty', 'Green','betty@gmail.com','7878745416',1),
#  ('Richard', 'Sky','richard@gmail.com','7878745417',1),
#  ('Susan', 'One','susan@gmail.com','7878745418',1),
#  ('Vicky', 'Yellow','vicky@gmail.com','7878745419',1),
#  ('Ben', 'Park Lane','ben@gmail.com','7878745420',1),
#  ('William', 'Central','william@gmail.com','7878745421',1),
#  ('Chuck', 'Main Road','chuck@gmail.com','7878745422',1),
#  ('Viola', 'Sideway','viola@gmail.com','7878745423',1)
# ]

# mycursor.executemany(q1,values)
# mydb.commit()
# print(mycursor.rowcount," records was inserted")

#Selecting
# q2="SELECT * FROM users"
# mycursor.execute(q2)
# result=mycursor.fetchall()
# for user in result:
#     #print(user.get('email'))
#     print(user['fname']," ",user['lname'])

#Updating
# q3="UPDATE users SET address='Lowstreet 4' WHERE userid=1"
# mycursor.execute(q3)
# mydb.commit()
# print(mycursor.rowcount, "record(s) affected")

#Delete
# sql="DELETE FROM users WHERE userid=13"
# mycursor.execute(sql)
# mydb.commit()
# print(mycursor.rowcount, "record(s) deleted")

#Where
# sql="SELECT * FROM users WHERE status=0"
# mycursor.execute(sql)
# result=mycursor.fetchall()
# for user in result:
#     #print(user.get('email'))
#     print(user['fname']," ",user['lname'])

#Order By
# sql="SELECT * FROM users ORDER BY fname"
# mycursor.execute(sql)
# result=mycursor.fetchall()
# for user in result:
#     #print(user.get('email'))
#     print(user['fname']," ",user['lname'])
    
#Limit
# sql="SELECT * FROM users LIMIT 0,5"
# mycursor.execute(sql)
# result=mycursor.fetchall()
# for user in result:
#     #print(user.get('email'))
#     print(user['fname']," ",user['lname'])

#Join
sql="SELECT * FROM users"
mycursor.execute(sql)
result=mycursor.fetchall()
print(type(result))
for key in range(len(result)):
    user=result[key]
    course_sql="""SELECT cs.course_id,cs.course_name
             FROM user_subscriptions us
             LEFT JOIN courses cs ON us.course_id=cs.course_id
             WHERE us.user_id=%s"""%user['userid']
    mycursor.execute(course_sql)
    course_result=mycursor.fetchall()
    result[key]['courses']=course_result if len(course_result)>0 else []

print(result)
    
    
