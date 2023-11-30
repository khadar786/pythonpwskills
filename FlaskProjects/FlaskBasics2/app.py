from flask import Flask,request,render_template,jsonify

app=Flask(__name__)


@app.route("/")
def home_page():
  return render_template('index.html')

@app.route("/math",methods=['POST'])
def math_ops():
  if(request.method=="POST"):
    ops=request.form['operation']
    num1=int(request.form['num1'])
    num2=int(request.form['num2'])
    
    if ops=="add":
      r=num1+num2
      result="The sum of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="subtract":
      r=num1-num2
      result="The subtraction of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="multiply":
      r=num1*num2
      result="The multiplication of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="divide":
      r=num1//num2
      result="The division of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    else:
      r=""
      result="No result"
      
    return render_template("results.html",result=result)
    
@app.route("/postman_math",methods=['POST'])
def postman_math_ops():
  if(request.method=="POST"):
    ops=request.json['operation']
    num1=int(request.json['num1'])
    num2=int(request.json['num2'])
    result=""
    
    if ops=="add":
      r=num1+num2
      result="The sum of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="subtract":
      r=num1-num2
      result="The subtraction of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="multiply":
      r=num1*num2
      result="The multiplication of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    elif ops=="divide":
      r=num1//num2
      result="The division of {num1} and {num2} is {r}".format(num1=num1,num2=num2,r=r)
    else:
      r=""
      result="No result"
      
    return jsonify(result) 


if __name__=="__main__":
  app.run(host="0.0.0.0")
  #uvicorn.run(app,host='0.0.0.0',port=8000)
  #uvicorn app:app --reload
  #gunicorn app:app --reload