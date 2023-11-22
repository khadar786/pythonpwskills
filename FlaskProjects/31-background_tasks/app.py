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
from fastapi import Body, FastAPI, HTTPException, Path, Query,Cookie,Form,File,Header,status,UploadFile,Depends,Response,Request,BackgroundTasks
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
app=FastAPI()

## 31: Background Tasks
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

""" def write_notification(email:str,message=""):
    with open(filename="log.txt",mode="w") as email_file:
        content=f"notification for {email}: {message}"
        time.sleep(5)
        email_file.write(content)

@app.post("/send-notification/{email}")
async def send_notification(email:str,background_tasks:BackgroundTasks):
    background_tasks.add_task(write_notification,email,message="some notification")
    return {"message":"Notification sent in the background"} """


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=3000)