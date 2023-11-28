import os
from dotenv import load_dotenv,dotenv_values
import pymongo
import sys
# load_dotenv()
# DB_URL=os.getenv('DB_URL')
# print(DB_URL)
envConfig=dotenv_values(".env")
DB_URL=envConfig['DB_URL']
try:
  client=pymongo.MongoClient(DB_URL)
except Exception as e:
  print(e)

#Database
db=client['pwskills']

#Collection
users_coll=db["users"]

# userData1={
#   "fname":"khadar",
#   "lname":"basha",
#   "email":"khadar@gmail.com",
#   "mobileno":"123456790",
#   "status":1
# } 

# userData1={
#   "fname":"surya",
#   "lname":"teja",
#   "email":"surya@gmail.com",
#   "mobileno":"123456790",
#   "status":1
# }

# users_coll.insert_one(userData1)

# userMultipleData=[
#   {
#     "fname":"karthik 123",
#     "lname":"k",
#     "email":"karthik@gmail.com",
#     "mobileno":"123456700",
#     "status":1
#   },
#   {
#     "fname":"venu 1234",
#     "lname":"r",
#     "email":"venu@gmail.com",
#     "mobileno":"123456701",
#     "status":1
#   },
#   {
#     "fname":"gopal 12345",
#     "lname":"hgt",
#     "email":"gopal@gmail.com",
#     "mobileno":"123456702",
#     "status":1
#   },
#   {
#     "fname":"babu 654",
#     "lname":"hgt",
#     "email":"babu@gmail.com",
#     "mobileno":"123456703",
#     "status":1
#   }
# ]

# users_coll.insert_many(userMultipleData)
# print(users_coll)

#find
# for user in users_coll.find():
#   #print(user['email'])
#   print(user["fname"]," ",user["lname"])

#find_one
# user_one=users_coll.find_one()
# print(user_one)

#query
# q={"email":"babu@gmail.com"}
# for user in users_coll.find(q):
#   print(user)

# q={"email":{"$gt":"k"}}
# for user in users_coll.find(q):
#   print(user)

#Regular expressions can only be used to query strings.
#{"$regex": "^S"}
# myquery={"email":{"$regex": "^kha"}}
# for user in users_coll.find(myquery):
#   print(user)

# for user in users_coll.find().sort("fname"):
#   print(user)

#Sort Descending
# users=users_coll.find().sort("fname", -1)
# for user in users:
#   print(user)

#Update Collection One
# update_q={"$set":{"status":0}}
# where_cond={"email":"babu654@gmail.com"}
# users_coll.update_one(where_cond,update_q)

#Update Many
# where_in={"email":{"$in":["gopal12345@gmail.com","venu1234@gmail.com"]}}
# update_q={"$set":{"status":0}}
# users_coll.update_many(where_in,update_q)
# for user in users_coll.find():
#   print(user)
  
#delete_one
# where_cond={"email":"babu654@gmail.com"}
#delq=users_coll.delete_one(where_cond)
#print(delq.deleted_count, " documents deleted.")
# for user in users_coll.find():
#   print(user)

#delete_many
# where_cond={"status":0}
#delM=users_coll.delete_many(where_cond)
#print(delM.deleted_count, " documents deleted.")
# for user in users_coll.find():
#   print(user)


#Limit
# users=users_coll.find().skip(2).limit(2)
# for user in users:
#   print(user)

#Drop Collection
#users_coll.drop()
