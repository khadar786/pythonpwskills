#from redis.asyncio import Redis
from enum import Enum
import random
from typing import List, Literal, Optional, Union, Any
from datetime import datetime,time,timedelta
import re
from uuid import UUID
from fastapi.exceptions import RequestValidationError
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.encoders import jsonable_encoder
from fastapi.responses import HTMLResponse, JSONResponse,PlainTextResponse,ORJSONResponse
from flask import Flask,render_template,request,redirect,url_for,session
import os,glob,json
import pathlib
from fastapi import Body, FastAPI, HTTPException, Path, Query,Cookie,Form,File,Header,status,UploadFile,Depends,Response,Request
from fastapi.middleware.wsgi import WSGIMiddleware
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
#Ramesh sir
from pydantic import BaseModel, EmailStr,Field, HttpUrl
from starlette.exceptions import HTTPException as StarletteHTTPException
#from starlette.responses import HTMLResponse
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
import uvicorn
# from fastapi_redis_session.config import basicConfig
# basicConfig(
#     redisURL="redis://localhost:6379/1",
#     sessionIdName="sessionId",
#     sessionIdGenerator=lambda: str(random.randint(1000, 9999)),
#     expireTime=timedelta(days=1),
#     )
#from redsession import ServerSessionMiddleware
#from redsession.backend import RedisBackend

#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse)
"""try:
  redis = Redis(host="127.0.0.1",port="6379")
  app.add_middleware(
      ServerSessionMiddleware, backend=RedisBackend(redis), secret_key="secret"
  )
except Exception as e:
  print(e)"""


#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

"""
  Extra Models
"""
'''class UserIn(BaseModel):
  username: str
  password:str
  email: EmailStr
  full_name: str | None = None

class UserOut(BaseModel):
  username: str
  email: EmailStr
  full_name: str | None = None

class UserInDB(BaseModel):
  username: str
  hashed_password:str
  email: EmailStr
  full_name: str | None = None

def fake_password_hasher(raw_password:str):
  return "supersecret{raw_password}"

def fake_save_user(user_in:UserIn):
  hashed_password=fake_password_hasher(user_in.password)
  user_in_db=UserInDB(**user_in.model_dump(mode='json'),hashed_password=hashed_password)
  print("userin.dict",user_in.model_dump(mode='json'))
  print("User 'saved'.")
  return user_in_db

@app.post("/extra_user/",response_model=UserOut)
async def create_user(user_in:UserIn):
  user_saved=fake_save_user(user_in)
  return user_saved'''

class NUserBase(BaseModel):
  username: str
  email: EmailStr
  full_name: str | None = None
  
class NUserIn(NUserBase):
  password:str

class NUserOut(NUserBase):
  pass

class NUserInDB(NUserBase):
  hashed_password:str
  

def fake_password_hasher(raw_password:str):
  return "supersecret{raw_password}"

def fake_save_user(user_in:NUserIn):
  hashed_password=fake_password_hasher(user_in.password)
  user_in_db=NUserInDB(**user_in.model_dump(mode='json'),hashed_password=hashed_password)
  print("userin.dict",user_in.model_dump(mode='json'))
  print("User 'saved'.")
  return user_in_db

@app.post("/extra_user/",response_model=NUserOut)
async def create_user(user_in:NUserIn):
  user_saved=fake_save_user(user_in)
  return user_saved

class BaseItem(BaseModel):
    description: str
    type: str

class CarItem(BaseItem):
    type: str|None = "car"

class PlaneItem(BaseItem):
    type: str|None = "plane"
    size: int

vitems = {
    "item1": {"description": "All my friends drive a low rider", "type": "car"},
    "item2": {
        "description": "Music is my aeroplane, it's my aeroplane",
        "type": "plane",
        "size": 5,
    },
}

@app.get("/vitems/{item_id}",response_model=Union[PlaneItem, CarItem])
async def vread_items(item_id: Literal["item1", "item2"]):
  return vitems[item_id]

class ListItem(BaseModel):
    name: str
    description: str

list_items = [
    {"name": "Foo", "description": "There comes my hero"},
    {"name": "Red", "description": "It's my aeroplane"},
]

@app.get("/list_items/", response_model=list[ListItem])
async def read_items():
    return list_items

@app.get("/arbitrary",response_model=dict[str,float])
async def get_arbitrary():
    return {"foo":1,"bar":2}


#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)