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
try:
  redis = Redis(host="127.0.0.1",port="6379")
  app.add_middleware(
      ServerSessionMiddleware, backend=RedisBackend(redis), secret_key="secret"
  )
except Exception as e:
  print(e)


#Flask config
flask_app=Flask(__name__)
#Mount Flask on Faskapi
app.mount('/qbadmin',WSGIMiddleware(flask_app))

#Ramesh sir
class MyMessage(BaseModel):
  message:str|None = None
  email:EmailStr|None = None


#Fastapi section
#Basic get method
@app.get("/")
async def getMethod():
    return {'text':"Fastapi section"}

#Basic post method
@app.post("/post")
async def post(request:Request):
  return {'message':'hello from the post message'}

#Basic put method
@app.put("/put")
async def put():
  return {'message':'hello from the put message'}
  
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


#Ramesh sir  
@app.post("/postmethod")
async def postMethod(request:Request, message:MyMessage):
  return {"message":message.message, "email":message.email}

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

fake_items_db=[{"item_name":"Foo"},{"item_name":"Bar"},{"item_name":"Baz"}]
#Query parameters
@app.get("/items")
async def list_items(skip:int=0,limit:int=10):
    return fake_items_db[skip:skip+limit]
  
@app.get("/items/{item_id}")
async def get_item(item_id:str,q:Optional[str]=None,short:bool=None):
      # if q:
      #   return {"item_id":item_id,"q":q}
      # return {"item_id":item_id}
      item={"item_id":item_id}
      if q:
          item.update({"q":q})
      
      if not short:
        item.update({"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar"})
      
      return item

@app.get("/users/{user_id}/items/{item_id}")
async def get_user_item(user_id:int,item_id:str,q:str|None=None,short:bool=False):
      item={"item_id":item_id,"owner_id":user_id}
      
      if q:
        item.update({"q":q})
      
      if not short:
        item.update({"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar"})
      
      return item
  
#Request Body
class Item(BaseModel):      
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
         
# @app.post("/items")
# async def create_item(item:Item):
#   return item
@app.post("/items")
async def create_item(item:Item):
  item_dict=item.model_dump(mode='json')
  
  if item.tax:
    price_with_tax=item.price+item.tax
    item_dict.update({"price_with_tax":price_with_tax})
    
  return item_dict  
  
@app.put("/items/{item_id}")
async def create_item_with_put(item_id,item:Item,q:str|None=None):
  result={"item_id":item_id,**item.model_dump(mode='json')}
  if q:
    result.update({
      "q":q
    })

  return result

#Query Parameters and String Validation
@app.get("/qitems")
async def read_items(q:str|None=Query(None,max_length=10)):
  results={"items":[{"item_id":"Foo"},{"item_id":"Bar"}]}
  if q:
    results.update({
      "q":q
    })
    
  return results

@app.get("/qitems1")
#min and max length validation
#async def read_items(q:str|None=Query(None,min_length=3,max_length=10,,regex="^fixedquery$")):
#default value
#async def read_items(q:str=Query("fixedquery",min_length=3,max_length=10)):
#... is requried validation
#async def read_items(q:str=Query(...,min_length=3,max_length=10))
#pass multiple perameters
#async def read_items(q:list[str]=Query(["foo","bar"])):
#title,description,alias name
async def read_items(q:str
                     |None=Query(
                       None,
                       min_length=3,
                       max_length=10,
                       title="Sample query text",
                       description="Sample query text",
                       alias="item-query"
                       )
                     ):
  results={"items":[{"item_id":"Foo"},{"item_id":"Bar"}]}
  if q:
    results.update({
      "q":q
    })
    
  return results

@app.get("/items_hidden")
def hidden_query_route(hidden_query:str|None=Query(None,include_in_schema=False)):
  if hidden_query:
    return {"hidden_query":hidden_query}
  

#Path Parameters and Numeric Validation
# @app.get("/items_validation/{item_id}")
# async def read_items_validation(
#   *,
#   item_id:int=Path(...,title="The ID of the item to get",ge=10,le=100),
#   q:str='hello'
# ):
  
@app.get("/items_validation/{item_id}")
async def read_items_validation(
  item_id:int=Path(...,title="The ID of the item to get",gt=10,lt=100),
  q:str='hello',
  size:float=Query(...,gt=0,lt=7.75)
):
  results={"item_id":item_id}
  if q:
    results.update({"q":q,"size":size})
    
  return results

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

"""
  Body Field
"""
class BItem(BaseModel):
  name:str
  description:str|None=Field(...,title="The description of the item",max_length=100)
  price:float=Field(...,gt=0,description="The price must be greater than zero.")
  tax:float|None=None

@app.put("/bodyitems/{item_id}")
async def update_item(
  item_id:int,
  item:BItem=Body(...,embed=True)
):
  result={"item_id":item_id,"item":item}
  return result

"""
  Body - Nested Models
"""
class Image(BaseModel):
  name:str
  url:HttpUrl
  
class NSMItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  #tags:list[int]=[]
  tags:set[str]=[]
  #image:Image | None=None
  image:list[Image] | None=None

class Offer(BaseModel):
  name:str
  description:str|None=None
  price:float
  items:list[NSMItem]

@app.put("/nsmitems/{item_id}")
async def nsmupdate_item(item_id:int,item:NSMItem):
  results={"item_id":item_id,"item":item}
  return results 

@app.post("/offers")
async def create_offer(offer:Offer=Body(...,embed=True)):
  return offer

@app.post("/images/multiple")
async def create_multiple_images(images:list[Image]):
  return images

@app.post("/blah")
async def create_some_blahs(blahs:dict[int,float]):
  return blahs

"""
  Declare Request Example Data
"""
#Method 1
class DRItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  
  class Config:
    json_schema_extra={
      "example":{
        "name":"Foo",
        "description":"A very nice Item",
        "price":16.25,
        "tax":1.67
      }
    }

class DRItem2(BaseModel):
  name:str=Field(...,example="Foo")
  description:str|None=Field(...,example="A very nice Item")
  price:float=Field(...,example=16.25)
  tax:float|None=Field(...,example=1.67)

class DRItem3(BaseModel):
  name:str
  description:str|None=None
  price:float|None=None
  tax:float|None=None

#@app.put("/dritems/{item_id}")
# async def dr_update_items(item_id:int,item:DRItem3):
#   results={"item_id":item_id,"item":item}
#   return results

# async def dr_update_items(item_id:int,item:DRItem3=Body(...,
#                                                         example={
#                                                           "name":"Foo",
#                                                           "description":"A very nice Item",
#                                                           "price":16.25,
#                                                           "tax":1.67
#                                                         }
#                                                         )):
#   results={"item_id":item_id,"item":item}
#   return results
@app.put("/dritems/{item_id}")
async def dr_update_items(item_id:int,
                          item:DRItem3=Body(...,
                                            openapi_examples={
                                              "normal": {
                                                  "summary": "A normal example",
                                                  "description": "A __normal__ item works _correctly_",
                                                  "value": {
                                                      "name": "Foo",
                                                      "description": "A very nice Item",
                                                      "price": 16.25,
                                                      "tax": 1.67,
                                                  },
                                              },
                                              "converted": {
                                                  "summary": "An example with converted data",
                                                  "description": "FastAPI can convert price `strings` to actual `numbers` automatically",
                                                  "value": {"name": "Bar", "price": "16.25"},
                                              },
                                              "invalid": {
                                                  "summary": "Invalid data is rejected with an error",
                                                  "description": "Hello youtubers",
                                                  "value": {"name": "Baz", "price": "sixteen point two five"},
                                              },
                                            }
                                          ),
                          ):
  results={"item_id":item_id,"item":item}
  return results

"""
  Extra Data Types
"""
#288340a0-0f0b-49ed-b48d-8a9f6e1a2274
@app.put("/edt_items/{item_id}")
async def read_items(
  item_id:UUID,
  start_date:datetime | None=Body(None),
  end_date:datetime | None=Body(None),
  repeat_at:time | None=Body(None),
  process_after:timedelta | None=Body(None)
):
 start_process=start_date+process_after
 duration=end_date-start_process
 return {
   "item_id":item_id,
   "start_date":start_date,
   "end_date":end_date,
   "repeat_at":repeat_at,
   "process_after":process_after,
   "start_process":start_process,
   "duration":duration
 }
 
"""
  Cookie and Header Parameters
"""
@app.get("/cookie_items")
async def cookie_read_items(
  cookie_id:str|None=Cookie(None),
  accept_encoding:str|None=Header(None),
  sec_ch_ua:str|None=Header(None),
  user_agent:str|None=Header(None),
  x_token: list[str]|None = Header(None),
  #x_token: list[str] = Query([]),
  ):
  return {
          "cookie_id":cookie_id,
          "Accept-Encoding":accept_encoding,
          "sec_ch_ua":sec_ch_ua,
          "User-Agent":user_agent,
          "X-token values":x_token
         }

"""
  Response Model
"""
'''
class ResponseItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  tags:list[str]=[]

@app.post('/response_create_items')
async def res_create_items(item:ResponseItem):
  return item
'''

'''class UserIn(BaseModel):
  username:str
  password:str
  email:EmailStr
  full_name:str|None=None'''
class UserBase(BaseModel):
  username:str
  password:str
  email:EmailStr
  
class UserIn(UserBase):
  full_name:str|None=None

class UserOut(UserBase):
  test:str

@app.post("/user/",response_model=UserOut)
async def create_user(user:UserIn):
  return user  

class ResponseItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float=10.5
  tags:list[str]=[]

items={
  "foo":{
    "name":"Foo",
    "price":50.2
  },
  "bar":{
    "name":"Bar",
    "description":"the bartenders",
    "price":62,
    "tax":20.2
  },
  "baz":{
    "name":"Baz",
    "description":None,
    "price":50.2,
    "tax":10.5,
    "tags":[]
  }
}
#@app.get('/response_items/{item_id}',response_model=ResponseItem,response_model_exclude_unset=True)
@app.get('/response_items/{item_id}',response_model=ResponseItem)
async def read_item(item_id:Literal["foo","bar","baz"]):
  return items[item_id]

@app.get('/response_items/{item_id}/name',response_model=ResponseItem,response_model_include={"name","description"})
async def read_item_name(item_id:Literal["foo","bar","baz"]):
  return items[item_id]

@app.get('/response_items/{item_id}/public',response_model=ResponseItem,response_model_exclude={"tax"})
async def read_items_public_data(item_id:Literal["foo","bar","baz"]):
  return items[item_id]


"""
  Extra Models
"""
'''class UserIn(BaseModel):
  username: str
  password:str
  email: EmailStr
  full_name: str | None = None

class UserOut(BaseModel):
  username: str
  email: EmailStr
  full_name: str | None = None

class UserInDB(BaseModel):
  username: str
  hashed_password:str
  email: EmailStr
  full_name: str | None = None

def fake_password_hasher(raw_password:str):
  return "supersecret{raw_password}"

def fake_save_user(user_in:UserIn):
  hashed_password=fake_password_hasher(user_in.password)
  user_in_db=UserInDB(**user_in.model_dump(mode='json'),hashed_password=hashed_password)
  print("userin.dict",user_in.model_dump(mode='json'))
  print("User 'saved'.")
  return user_in_db

@app.post("/extra_user/",response_model=UserOut)
async def create_user(user_in:UserIn):
  user_saved=fake_save_user(user_in)
  return user_saved'''

class NUserBase(BaseModel):
  username: str
  email: EmailStr
  full_name: str | None = None
  
class NUserIn(NUserBase):
  password:str

class NUserOut(NUserBase):
  pass

class NUserInDB(NUserBase):
  hashed_password:str
  

def fake_password_hasher(raw_password:str):
  return "supersecret{raw_password}"

def fake_save_user(user_in:NUserIn):
  hashed_password=fake_password_hasher(user_in.password)
  user_in_db=NUserInDB(**user_in.model_dump(mode='json'),hashed_password=hashed_password)
  print("userin.dict",user_in.model_dump(mode='json'))
  print("User 'saved'.")
  return user_in_db

@app.post("/extra_user/",response_model=NUserOut)
async def create_user(user_in:NUserIn):
  user_saved=fake_save_user(user_in)
  return user_saved

class BaseItem(BaseModel):
    description: str
    type: str

class CarItem(BaseItem):
    type: str|None = "car"

class PlaneItem(BaseItem):
    type: str|None = "plane"
    size: int

vitems = {
    "item1": {"description": "All my friends drive a low rider", "type": "car"},
    "item2": {
        "description": "Music is my aeroplane, it's my aeroplane",
        "type": "plane",
        "size": 5,
    },
}

@app.get("/vitems/{item_id}",response_model=Union[PlaneItem, CarItem])
async def vread_items(item_id: Literal["item1", "item2"]):
  return vitems[item_id]

class ListItem(BaseModel):
    name: str
    description: str

list_items = [
    {"name": "Foo", "description": "There comes my hero"},
    {"name": "Red", "description": "It's my aeroplane"},
]

@app.get("/list_items/", response_model=list[ListItem])
async def read_items():
    return list_items

@app.get("/arbitrary",response_model=dict[str,float])
async def get_arbitrary():
    return {"foo":1,"bar":2}


"""
Response Status Codes
"""
@app.post("/res_items/",status_code=status.HTTP_201_CREATED)
async def create_res_item(name:str):
  return {"name":name}

@app.delete("/res_delitems/{pk}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(pk:str): 
  print('pk',pk)
  return

@app.get("/res_items/",status_code=status.HTTP_302_FOUND)
async def read_items_redirect():
  return {"hello":"world"} 

"""
Form Fields
"""
@app.post("/login/")
async def login(username:str=Form(...),
                password:str=Form(...)
                ):
  print(password)
  return {"username":username}

class User(BaseModel):
  username:str
  password:str

@app.post("/login-json/")
async def login_json(username:str=Body(...),
                     password:str=Body(...)
                     ):
  return username

"""
Request Files
"""

"""@app.post("/files/")
async def create_file(file:bytes|None=File(None,description="A file read as bytes")):
  if not file:
    return {"message":"No file sent"}
  
  return {"file":file}

@app.post('/uploadfile/')
async def create_file(file:UploadFile|None=File(...,description="A file read as UploadFile")):
  if not file:
    return {"message":"No upload file sent"}
  contents=await file.read()
  return {"file":file.filename}"""

@app.post("/files/")
async def create_file(files:list[bytes]=File(...,description="A file read as bytes")):
  return {"file_sizes":[len(file) for file in files]}

@app.post('/uploadfiles/')
async def create_file(files:list[UploadFile]=File(...,description="A file read as UploadFile")):
  return {"filename":[file.filename for file in files]}

@app.get("/fastapi_html")
async def main():
  content="""
  <!DOCTYPE html>
<html>
<body>
<form action="/files/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
<form action="/uploadfiles/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
</html>
  """
  return HTMLResponse(content=content)

"""
Request Forms and Files
"""
@app.post("/request_forms_files")
async def requestFormFiles(
                          file:bytes=File(...),
                          fileb:UploadFile=File(...),
                          token:str=Form(...),
                          hello:str=Body(...)
                          ):
  return {
    "file_size":len(file),
    "fileb_content_type":fileb.content_type,
    "token":token,
    "hello":hello
  }

"""
Handling Errors
"""
items={"foo":{"name":"Item for wrestlers"}}

@app.get("/handling_items/{item_id}")
async def handling_err_read_item(item_id:str):
  if item_id not in items:
    raise HTTPException(status_code=404,
                        detail="Item not found",
                        headers={"X-Error":"There goes my error"}
                        )
  return {"item":items[item_id]}

class UnicornException(Exception):
  def __init__(self,name:str):
    self.name=name
  
@app.exception_handler(UnicornException)
async def unicorn_exception_handler(request:Request,exc:UnicornException):
  return JSONResponse(
    status_code=404,
    content={"message":f"Oops! {exc.name} did something.There goes a rainbow..."}
  )

@app.get("/unicorns/{name}")
async def read_unicorns(name:str):
  if name=='yolo':
    raise UnicornException(name=name)
  
  return {"unicorn_name":name}

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request,exc):
#   return PlainTextResponse(str(exc),status_code=400)

# @app.exception_handler(StarletteHTTPException)
# async def http_exception_handler(request,exc):
#   return PlainTextResponse(str(exc),status_code=exc.status_code)

# @app.get("/validation_items/{item_id}")
# async def read_validation_items(item_id:int):
#   if item_id==3:
#     raise HTTPException(status_code=418,detail="Hope! I don't like 3.")
#   return {"item_id":item_id}

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request=Request,exc=RequestValidationError):
#   return JSONResponse(
#     status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#     content=jsonable_encoder({"detail":exc.errors(),"body":exc.body})
#   )

# class Item(BaseModel):
#     title: str
#     size: int

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request,exc):
  print(f"OMG! An HTTp error!: {repr(exc)}")
  return await http_exception_handler(request,exc)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request=Request,exc=RequestValidationError):
  print(f"OMG! The client sent invalid data : {exc}")
  return await request_validation_exception_handler(request,exc)

@app.get("/blah_items/{item_id}")
async def read_items(item_id:int):
  if item_id==3:
    raise HTTPException(status_code=418,detail="Nope! I don't like 3.")
  return {"item_id":item_id}
  
@app.post("/handling_err_items/")
async def create_item(item:Item):
  return {"item":item}

"""
  Path Operation Configuration
"""
class PathOptItem(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()

class Tags(Enum):
    items = "items"
    users = "users"
    
@app.post("/pathopt_items/",
          response_model=PathOptItem,
          status_code=status.HTTP_201_CREATED,
          #tags=Tags[Tags.items],
          #summary="Create an Item-type item",
          # description="Create an item with all the information: "
          # "name; description; price; tax; and a set of "
          # "unique tags",
          #response_description="The created item",
          )
async def create_item(item: PathOptItem):
  return item

@app.get("/pathopt_items/")
async def read_items():
    return [{"name": "Foo", "price": 42}]


@app.get("/users/")
async def read_users():
    return [{"username": "PhoebeBuffay"}]


"""
  Session Management
"""
@app.get("/get_session")
async def get_session(request: Request):
     try:
       result=await request.session
       return {"session": result}
     except Exception as e:
       print(e)
     
  
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
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)