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
#Ramesh sir
from pydantic import BaseModel, EmailStr,Field, HttpUrl
from starlette.exceptions import HTTPException as StarletteHTTPException
#from starlette.responses import HTMLResponse
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
import uvicorn
import time

## Part 32: Metadata and Docs URLs
description="""
ChimichangApp API helps you do awesome stuff. 🚀
## Items

You can **read items**.

## Users

You will be able to:

* **Create users** (_not implemented_).
* **Read users** (_not implemented_).
"""

tags_metadata = [
    dict(
        name="users",
        description="Operations with users. The **login** logic is also here.",
    ),
    dict(
        name="items",
        description="Manage items. So _fancy_ they have their own docs.",
        externalDocs=dict(
            description="Items external docs", 
            url="https://www.jvp.design"
        ),
    ),
]

#Init  FastAPI App
app=FastAPI(
    title="ChimichangApp",
    description=description,
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact=dict(
        name="Deadpoolio the Amazing",
        url="http://x-force.example.com/contact",
        email="dp@x-force.example.com",
    ),
    license_info=dict(
         name="Apache 2.0", 
         url="https://www.apache.org/licenses/LICENSE-2.0.html"
    ),
    openapi_tags=tags_metadata,
    openapi_url="/api/v1/openapi.json",
    docs_url="/documentation",
    redoc_url=None,
)

#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

@app.get("/users", tags=["users"])
async def get_users():
    return [dict(name="Harry"), dict(name="Ron")]

@app.get("/items",tags=["items"])
async def read_items():
    return [dict(name="wand"), dict(name="flying broom")] 


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)