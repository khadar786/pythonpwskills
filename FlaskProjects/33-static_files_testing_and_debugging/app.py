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
from fastapi.staticfiles import StaticFiles
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
#Ramesh sir
from pydantic import BaseModel, EmailStr,Field, HttpUrl
from starlette.exceptions import HTTPException as StarletteHTTPException
#from starlette.responses import HTMLResponse
#from fastapi_redis_session import deleteSession, getSession, getSessionId, getSessionStorage, setSession, SessionStorage
import uvicorn
import time

## Part 33: Static Files, Testing, and Debugging
#Init  FastAPI App
app=FastAPI()

app.mount("/static",StaticFiles(directory="static"),name="static")
fake_secret_token="coneofsilence"
fake_db=dict(
    foo=dict(
        id="foo",
        title="Foo",
        description="There goes my hero",
    ),
    bar=dict(
        id="bar",
        title="Bar",
        description="The bartenders",
    )
)

class Item(BaseModel):
    id:str
    title:str
    description:str | None=None

#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

@app.get("/items/{item_id}")
async def read_main(item_id:str,x_token:str=Header(...)):
    if x_token!=fake_secret_token:
        raise HTTPException(status_code=400,
                            detail="Invalid X-Token header"
                            )
    
    if item_id not in fake_db:
        raise HTTPException(status_code=404,
                            detail="Item not found"
                            )
    return fake_db[item_id]

@app.post("/items/",response_model=Item)
async def create_item(item:Item,x_token:str=Header(...)):
    if x_token!=fake_secret_token:
        raise HTTPException(status_code=400,
                            detail="Invalid X-Token header"
                            )
    if item.id in fake_db:
        raise HTTPException(status_code=400,
                            detail="Item already existed!"
                            )
    fake_db[item.id]=item
    
    return item

    
if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)