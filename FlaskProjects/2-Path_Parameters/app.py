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
from redsession import ServerSessionMiddleware
from redsession.backend import RedisBackend

#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse)


#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))
  
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