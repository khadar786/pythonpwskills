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

from sqlalchemy.orm import Session
import crud
import models
import schemas
from database import SessionLocal,engine

models.Base.metadata.create_all(bind=engine)

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
# Dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/",response_model=schemas.User,status_code=201)
def create_user(user:schemas.UserCreate,db:Session=Depends(get_db)):
    #print(db)
    db_user=crud.get_user_by_email(db,email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/",response_model=list[schemas.User])
def read_users(skip:int=0,limit:int=100,db:Session=Depends(get_db)):
    users=crud.get_users(db,skip=skip,limit=limit)
    return users

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)