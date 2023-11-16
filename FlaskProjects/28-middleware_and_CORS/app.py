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

origins=["http://localhost:8000","http://localhost:3000"]
app.add_middleware(MyMiddleware)
app.add_middleware(CORSMiddleware,allow_origins=origins)

@app.get("/blah")
async def blah():
    return {"hello": "world"}   
  
""" SECRET_KEY = "thequickbrownfoxjumpedoverthelazydog"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$tJD64mRe0bd/UNdAANZtvuOnWDKScbVtXA9lB6X7arZxJQbAyMbd2",
        "disabled": False,
    }
}

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username:str | None=None
    
class User(BaseModel):
    username:str | None=None
    email:str | None=None
    full_name:str | None=None
    disabled:bool=False

class UserInDB(User):
    hashed_password:str

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password,hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db,username:str):
    if username in db:
        user_dict=db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db,username:str,password:str):
    user=get_user(fake_db,username)
    
    if not user:
        return False
    
    if not verify_password(password,user.hashed_password):
        return False
    
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire=datetime.utcnow()+expires_delta
    else:
        expire=datetime.utcnow()+timedelta(minutes=15)
    
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token",response_model=Token)
async def login_for_access_token(form_data:OAuth2PasswordRequestForm=Depends()):
    user=authenticate_user(fake_users_db,form_data.username,form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate":"Bearer"}
        )
    access_token_expires=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token=create_access_token(
        data={"sub":user.username},expires_delta=access_token_expires
    )
    
    return {"access_token":access_token,"token_type":"bearer"}

async def get_current_user(token:str=Depends(oauth2_scheme)):
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=ALGORITHM)
        #print(payload)
        username:str=payload.get("sub")
        
        if username is None:
            raise credentials_exception
        token_data=TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user=get_user(fake_users_db,username=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user:User=Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(
            status_code=400,
            detail="Inactive User"
        )
    return current_user

@app.get("/users/me",response_model=User)
async def get_me(current_user:User=Depends(get_current_active_user)):
    return current_user

@app.get("/users/me/items")
async def read_own_items(current_user:User=Depends(get_current_active_user)):
    return [{"item_id":"Foo","owner":current_user.username}] """

#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)