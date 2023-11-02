from flask import Flask,render_template,request,redirect,url_for,session
import os,glob,json
import pathlib
from fastapi import Body, FastAPI, Path, Query,Request
from fastapi.middleware.wsgi import WSGIMiddleware
#Ramesh sir
from pydantic import BaseModel, EmailStr,Field
import uvicorn
from enum import Enum
from typing import Optional

#Init  FastAPI App
app=FastAPI()

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
class NSMItem(BaseModel):
  name:str
  description:str|None=None
  price:float
  tax:float|None=None
  tags:list=[]

#@app.put("/nsmitems/{item_id}")


#Flask section
@flask_app.get("/")
def login_page():
    return render_template('pages/index.html')


if __name__=='__main__':
  uvicorn.run(app,host='0.0.0.0',port=8000)