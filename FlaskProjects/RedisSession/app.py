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
#from flask import Flask,render_template,request,redirect,url_for,session
import os,glob,json
import pathlib
from fastapi import Body, FastAPI, HTTPException, Path, Query,Cookie,Form,File,Header,status,UploadFile,Depends,Response,Request
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr,Field, HttpUrl
import uvicorn
from redsession import ServerSessionMiddleware
from redsession.backend import RedisBackend
redis = Redis(host="127.0.0.1",port=6379)
SECRET_KEY = secrets.token_urlsafe(16)
#Init  FastAPI App
app=FastAPI(default_response_class=ORJSONResponse)
  
#Flask config
#flask_app=Flask(__name__)
#Mount Flask on Faskapi
#app.mount('/qbadmin',WSGIMiddleware(flask_app))
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    import time as time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    session = request.cookies.get('session')
    if session:
        response.set_cookie(key='session', value=request.cookies.get('session'), httponly=True)
    return response

app.add_middleware(ServerSessionMiddleware,
                   backend=RedisBackend(redis),
                   secret_key=SECRET_KEY
                   )
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
 
"""
  Session Management
"""
@app.get("/get_session")
async def get_session(request: Request):
    # try:
    #   #print(request.session)
    #   return {"session":request}
    # except Exception as e:
    #   print(e)
    print(request.session)
    return {"session":request.session}
  
@app.post("/set_session")
async def set_session(request: Request):
    request.session.update({"user_id": 1})
    return {"session": request.session}


@app.put("/update_session")
async def update_session(request: Request):
    request.session.clear()
    request.session.update({"user_id": 2})
    return {"session": request.session}


@app.delete("/delete_session")
async def delete_session(request: Request):
    request.session.clear()
    return {"session": request.session}


#Flask section
# @flask_app.get("/")
# def login_page():
#     return render_template('pages/index.html')



  
if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0', debug=True,port=8000,log_level="debug")