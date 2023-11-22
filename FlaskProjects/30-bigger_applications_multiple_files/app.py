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
from sub_app.dependencies import get_token_header,get_query_token
#from sub_app.routers.users import router as user_router
#from sub_app.routers.items import router as items_router
from sub_app.routers import users_router
from sub_app.routers import items_router

#30 Bigger Applications - Multiple Files
app=FastAPI(dependencies=[Depends(get_query_token)])
app.include_router(users_router)
app.include_router(items_router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)