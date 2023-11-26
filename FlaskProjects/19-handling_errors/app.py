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
Handling Errors
"""
items={"foo":{"name":"Item for wrestlers"}}

@app.get("/handling_items/{item_id}")
async def handling_err_read_item(item_id:str):
  if item_id not in items:
    raise HTTPException(status_code=404,
                        detail="Item not found",
                        headers={"X-Error":"There goes my error"}
                        )
  return {"item":items[item_id]}

class UnicornException(Exception):
  def __init__(self,name:str):
    self.name=name
  
@app.exception_handler(UnicornException)
async def unicorn_exception_handler(request:Request,exc:UnicornException):
  return JSONResponse(
    status_code=404,
    content={"message":f"Oops! {exc.name} did something.There goes a rainbow..."}
  )

@app.get("/unicorns/{name}")
async def read_unicorns(name:str):
  if name=='yolo':
    raise UnicornException(name=name)
  
  return {"unicorn_name":name}

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request,exc):
#   return PlainTextResponse(str(exc),status_code=400)

# @app.exception_handler(StarletteHTTPException)
# async def http_exception_handler(request,exc):
#   return PlainTextResponse(str(exc),status_code=exc.status_code)

# @app.get("/validation_items/{item_id}")
# async def read_validation_items(item_id:int):
#   if item_id==3:
#     raise HTTPException(status_code=418,detail="Hope! I don't like 3.")
#   return {"item_id":item_id}

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request=Request,exc=RequestValidationError):
#   return JSONResponse(
#     status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#     content=jsonable_encoder({"detail":exc.errors(),"body":exc.body})
#   )

# class Item(BaseModel):
#     title: str
#     size: int

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request,exc):
  print(f"OMG! An HTTp error!: {repr(exc)}")
  return await http_exception_handler(request,exc)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request=Request,exc=RequestValidationError):
  print(f"OMG! The client sent invalid data : {exc}")
  return await request_validation_exception_handler(request,exc)

@app.get("/blah_items/{item_id}")
async def read_items(item_id:int):
  if item_id==3:
    raise HTTPException(status_code=418,detail="Nope! I don't like 3.")
  return {"item_id":item_id}
  
@app.post("/handling_err_items/")
async def create_item(item:Item):
  return {"item":item}

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)