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
  Declare Request Example Data
"""
#Method 1
class DRItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  
  class Config:
    json_schema_extra={
      "example":{
        "name":"Foo",
        "description":"A very nice Item",
        "price":16.25,
        "tax":1.67
      }
    }

class DRItem2(BaseModel):
  name:str=Field(...,example="Foo")
  description:str|None=Field(...,example="A very nice Item")
  price:float=Field(...,example=16.25)
  tax:float|None=Field(...,example=1.67)

class DRItem3(BaseModel):
  name:str
  description:str|None=None
  price:float|None=None
  tax:float|None=None

#@app.put("/dritems/{item_id}")
# async def dr_update_items(item_id:int,item:DRItem3):
#   results={"item_id":item_id,"item":item}
#   return results

# async def dr_update_items(item_id:int,item:DRItem3=Body(...,
#                                                         example={
#                                                           "name":"Foo",
#                                                           "description":"A very nice Item",
#                                                           "price":16.25,
#                                                           "tax":1.67
#                                                         }
#                                                         )):
#   results={"item_id":item_id,"item":item}
#   return results
@app.put("/dritems/{item_id}")
async def dr_update_items(item_id:int,
                          item:DRItem3=Body(...,
                                            openapi_examples={
                                              "normal": {
                                                  "summary": "A normal example",
                                                  "description": "A __normal__ item works _correctly_",
                                                  "value": {
                                                      "name": "Foo",
                                                      "description": "A very nice Item",
                                                      "price": 16.25,
                                                      "tax": 1.67,
                                                  },
                                              },
                                              "converted": {
                                                  "summary": "An example with converted data",
                                                  "description": "FastAPI can convert price `strings` to actual `numbers` automatically",
                                                  "value": {"name": "Bar", "price": "16.25"},
                                              },
                                              "invalid": {
                                                  "summary": "Invalid data is rejected with an error",
                                                  "description": "Hello youtubers",
                                                  "value": {"name": "Baz", "price": "sixteen point two five"},
                                              },
                                            }
                                          ),
                          ):
  results={"item_id":item_id,"item":item}
  return results

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)