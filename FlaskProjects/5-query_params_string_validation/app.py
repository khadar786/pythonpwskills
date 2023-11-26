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

#Fastapi section
#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

#Query Parameters and String Validation
@app.get("/qitems")
async def read_items(q:str|None=Query(None,max_length=10)):
  results={"items":[{"item_id":"Foo"},{"item_id":"Bar"}]}
  if q:
    results.update({
      "q":q
    })
    
  return results

@app.get("/qitems1")
#min and max length validation
#async def read_items(q:str|None=Query(None,min_length=3,max_length=10,,regex="^fixedquery$")):
#default value
#async def read_items(q:str=Query("fixedquery",min_length=3,max_length=10)):
#... is requried validation
#async def read_items(q:str=Query(...,min_length=3,max_length=10))
#pass multiple perameters
#async def read_items(q:list[str]=Query(["foo","bar"])):
#title,description,alias name
async def read_items(q:str
                     |None=Query(
                       None,
                       min_length=3,
                       max_length=10,
                       title="Sample query text",
                       description="Sample query text",
                       alias="item-query"
                       )
                     ):
  results={"items":[{"item_id":"Foo"},{"item_id":"Bar"}]}
  if q:
    results.update({
      "q":q
    })
    
  return results

@app.get("/items_hidden")
def hidden_query_route(hidden_query:str|None=Query(None,include_in_schema=False)):
  if hidden_query:
    return {"hidden_query":hidden_query}

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)