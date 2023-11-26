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


#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

"""
  Response Model
"""
'''
class ResponseItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  tags:list[str]=[]

@app.post('/response_create_items')
async def res_create_items(item:ResponseItem):
  return item
'''

'''class UserIn(BaseModel):
  username:str
  password:str
  email:EmailStr
  full_name:str|None=None'''
class UserBase(BaseModel):
  username:str
  password:str
  email:EmailStr
  
class UserIn(UserBase):
  full_name:str|None=None

class UserOut(UserBase):
  test:str

@app.post("/user/",response_model=UserOut)
async def create_user(user:UserIn):
  return user  

class ResponseItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float=10.5
  tags:list[str]=[]

items={
  "foo":{
    "name":"Foo",
    "price":50.2
  },
  "bar":{
    "name":"Bar",
    "description":"the bartenders",
    "price":62,
    "tax":20.2
  },
  "baz":{
    "name":"Baz",
    "description":None,
    "price":50.2,
    "tax":10.5,
    "tags":[]
  }
}
#@app.get('/response_items/{item_id}',response_model=ResponseItem,response_model_exclude_unset=True)
@app.get('/response_items/{item_id}',response_model=ResponseItem)
async def read_item(item_id:Literal["foo","bar","baz"]):
  return items[item_id]

@app.get('/response_items/{item_id}/name',response_model=ResponseItem,response_model_include={"name","description"})
async def read_item_name(item_id:Literal["foo","bar","baz"]):
  return items[item_id]

@app.get('/response_items/{item_id}/public',response_model=ResponseItem,response_model_exclude={"tax"})
async def read_items_public_data(item_id:Literal["foo","bar","baz"]):
  return items[item_id]


#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)