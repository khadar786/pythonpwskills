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
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from flask import Flask,render_template,request,redirect,url_for,session
import os,glob,json
import pathlib
from fastapi import Body, FastAPI, HTTPException, Path, Query,Cookie,Form,File,Header,status,UploadFile,Depends,Response,Request
from fastapi.middleware.wsgi import WSGIMiddleware
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
from fastapi.middleware.cors import CORSMiddleware
#Ramesh sir
from pydantic import BaseModel, EmailStr,Field, HttpUrl
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from passlib.context import CryptContext
from jose import jwt, JWTError
#from starlette.responses import HTMLResponse
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
import uvicorn
import time

#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse)

#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

## 28: Middleware and CORS
class MyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self,request:Request,call_next):
        start_time=time.time()
        response=await call_next(request)
        process_time=time.time()-start_time
        response.headers['X-Process-Time']=str(process_time)
        return response

origins=["http://localhost:8000",
         "http://localhost:3000",
         "http://127.0.0.1:5173"]
app.add_middleware(MyMiddleware)
app.add_middleware(CORSMiddleware,allow_origins=origins)

@app.get("/blah")
async def blah():
    return {"hello": "world"}   
  
#npm init svelte fast-api-frontend
#Select -None

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)