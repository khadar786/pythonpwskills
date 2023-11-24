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
  Body Multiple Parameters
"""  
class NewItem(BaseModel): 
  name:str
  description:str|None=None
  price:float
  tax:float|None=None

class User(BaseModel):
  username:str
  full_name:str|None=None
  
  
@app.put("/newitems/{item_id}")
async def udate_item(
  *,
  item_id:int=Path(...,title="The ID of the itme to get",ge=0,le=150),
  q:str | None=None,
  item:NewItem|None=None,
  user:User,
  importance:int=Body(...)
):
  results={"item_id":item_id}
  
  if q:
    results.update({"q":q})
  
  if item:
    results.update({"item":item})
  
  if user:
    results.update({"user":user})
  
  if importance:
    results.update({"importance":importance})
    
  return results

@app.put("/newitems2/{item_id}")
async def udate_item(
  *,
  item_id:int=Path(...,title="The ID of the itme to get",ge=0,le=150),
  q:str | None=None,
  item:NewItem=Body(...,embed=True),
):
  results={"item_id":item_id}
  
  if q:
    results.update({"q":q})
  
  if item:
    results.update({"item":item})
    
  return results

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)