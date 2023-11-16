from redis.asyncio import Redis
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

async def verify_token(x_token:str=Header(...)):
    if x_token!="fake-super-secret-token":
        raise HTTPException(status_code=400,detail="X-Token header invalid")
    return "hello"

async def verify_key(x_key:str=Header(...)):
    if x_key!="fake-super-secret-key":
        raise HTTPException(status_code=400,detail="X-key header invalid")
    return x_key

#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse,dependencies=[Depends(verify_token),Depends(verify_key)])

#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

## 25: Dependencies in path operation decorators, global dependencies
""" async def verify_token(x_token:str=Header(...)):
    if x_token!="fake-super-secret-token":
        raise HTTPException(status_code=400,detail="X-Token header invalid")
    return "hello"

async def verify_key(x_key:str=Header(...)):
    if x_key!="fake-super-secret-key":
        raise HTTPException(status_code=400,detail="X-key header invalid")
    return x_key
    
@app.get("/items",dependencies=[Depends(verify_token),Depends(verify_key)])
#async def read_items(blah:str=Depends(verify_token)):
async def read_items():
    return [{"item":"Foo"},{"item":"bar"}] 


@app.get("/users",dependencies=[Depends(verify_token),Depends(verify_key)])
async def read_users():
    return [{"username":"khadar"},{"username":"basha"}] """ 

@app.get("/items")
#async def read_items(blah:str=Depends(verify_token)):
async def read_items():
    return [{"item":"Foo"},{"item":"bar"}] 


@app.get("/users")
async def read_users():
    return [{"username":"khadar"},{"username":"basha"}]

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)