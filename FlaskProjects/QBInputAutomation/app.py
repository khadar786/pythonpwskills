from flask import Flask,render_template,request,redirect,url_for,session
import os,glob,json
import pathlib
from fastapi import Body, FastAPI,Request
from fastapi.middleware.wsgi import WSGIMiddleware
#Ramesh sir
from pydantic import BaseModel, EmailStr
import uvicorn
from enum import Enum 

#Init  FastAPI App
app=FastAPI()

#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

#Ramesh sir
class MyMessage(BaseModel):
  message:str|None = None
  email:EmailStr|None = None
  
#Fastapi section
#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

#Basic post method
@app.post("/post")
async def post(request:Request):
  return {'message':'hello from the post message'}

#Basic put method
@app.put("/put")
async def put():
  return {'message':'hello from the put message'}
  
#Path parameters
@app.get("/users")
async def list_users():
  return {"message":"list users route"}

@app.get("/users/me")
async def get_current_user():
  return {"Message":"this is the current user"} 

@app.get("/users/{user_id}")
async def get_user(user_id:str):
  return {"user_id":user_id}


#Ramesh sir  
@app.post("/postmethod")
async def postMethod(request:Request, message:MyMessage):
  return {"message":message.message, "email":message.email}

class FoodEnum(str,Enum):
      fruits="fruits"
      vegitables="vegitables"
      dairy="dairy"

@app.get("/foods/{food_name}")
async def get_food(food_name:FoodEnum):
  if food_name==FoodEnum.vegitables:
    return {"food_name":food_name,"message":"you are healthy"}
  
  if food_name==FoodEnum.fruits:
    return {"food_name":food_name,"message":"you are still healthy but like sweet things"}
  
  return {"food_name":food_name,"message":"i like chocolate milk"}
  
  
#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)