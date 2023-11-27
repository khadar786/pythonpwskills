import pymongo
import sys

try:
  client=pymongo.MongoClient("mongodb+srv://sayyadmongo:qyokHH98VOeFKdzf@cluster0.uaiff.mongodb.net/?retryWrites=true&w=majority")
except Exception as e:
  print(e)

#Database
db=client['pwskills']

#Collection
users_coll=db["users"]

""" userData1={
  "fname":"khadar",
  "lname":"basha",
  "email":"khadar@gmail.com",
  "mobileno":"123456790",
  "status":1
} """

userData1={
  "fname":"surya",
  "lname":"teja",
  "email":"surya@gmail.com",
  "mobileno":"123456790",
  "status":1
}

users_coll.insert_one(userData1)
