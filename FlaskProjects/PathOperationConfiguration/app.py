from redis.asyncio import Redis
#from redis import Redis
from enum import Enum
from datetime import date, timedelta, datetime, time, tzinfo
import random
import secrets
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
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr,Field, HttpUrl
import uvicorn
from redsession import ServerSessionMiddleware
from redsession.backend import RedisBackend
#redis = Redis(host="127.0.0.1",port=6379)
SECRET_KEY = secrets.token_urlsafe(16)
#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse)
  
#Flask config
flask_app=Flask(__name__)

#Mount Flask on Faskapi
# app.mount('/qbadmin',WSGIMiddleware(flask_app))
# @app.middleware("http")
# async def add_process_time_header(request: Request, call_next):
#     import time as time
#     start_time = time.time()
#     response = await call_next(request)
#     process_time = time.time() - start_time
#     response.headers["X-Process-Time"] = str(process_time)
#     session = request.cookies.get('session')
#     if session:
#         response.set_cookie(key='session', value=request.cookies.get('session'), httponly=True)
#     return response

# app.add_middleware(ServerSessionMiddleware,
#                    backend=RedisBackend(redis),
#                    secret_key=SECRET_KEY
#                    )
origins = [
    "http://127.0.0.1:8000",  # update this
    "http://127.0.0.1:6379",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Fastapi section
#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

"""
  Path Operation Configuration
"""
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()

class Tags(Enum):
    items = "items"
    users = "users"

@app.post("/items/",
          response_model=Item,
          status_code=status.HTTP_201_CREATED,
          tags=[Tags.items],
          summary="Create an Item",
        #   description="Create an item with all the information:name; description; price; tax; and a set of unique tags",
           response_description="The created item"
          )
async def create_item(item:Item):
    """
    Create an Item
    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    - **tags**: a set of unique tag strings for this item
    """
    return item

@app.get("/items/",tags=[Tags.items])
async def read_items():
    return [{"name":"Foo","price":42}]

@app.get("/users/",tags=[Tags.users])
async def read_users():
    return [{"username":"Testing"}]

@app.get("/elements/",tags=[Tags.items],deprecated=True)
async def read_elements():
    return [{"item_id":"Foo"}]

#Flask section
# @flask_app.get("/")
# def login_page():
#     return render_template('pages/index.html')
  
if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0', debug=True,port=8000,log_level="debug")