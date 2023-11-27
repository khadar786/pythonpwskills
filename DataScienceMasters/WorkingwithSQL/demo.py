import mysql.connector
mydb=mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="pwskillsdb1"
)

mycursor=mydb.cursor()
#mycursor.execute("show tables")
#myresult=mycursor.fetchall()

#for i in myresult:
#    print(i)

#Inserting
 #q1="""INSERT INTO users(fname,lname,email,mobileno,status) VALUES(%s,%s,%s,%s,%s)"""
"""values=[
 ('Peter', 'Lows','peter@gmail.com','7878745454',1),
 ('Amy', 'Apple','amy@gmail.com','7878745412',1),
 ('Hannah', 'Mountain','hannah@gmail.com','7878745413',1),
 ('Michael', 'Valley','michael@gmail.com','7878745414',1),
 ('Sandy', 'Ocean','sandy@gmail.com','7878745415',1),
 ('Betty', 'Green','betty@gmail.com','7878745416',1),
 ('Richard', 'Sky','richard@gmail.com','7878745417',1),
 ('Susan', 'One','susan@gmail.com','7878745418',1),
 ('Vicky', 'Yellow','vicky@gmail.com','7878745419',1),
 ('Ben', 'Park Lane','ben@gmail.com','7878745420',1),
 ('William', 'Central','william@gmail.com','7878745421',1),
 ('Chuck', 'Main Road','chuck@gmail.com','7878745422',1),
 ('Viola', 'Sideway','viola@gmail.com','7878745423',1)
]

mycursor.executemany(q1,values)
mydb.commit()
print(mycursor.rowcount," records was inserted") """

#Selecting
q2="SELECT * FROM users"
mycursor.execute(q2)
result=mycursor.fetchall()
for user in result:
    print(user[0])