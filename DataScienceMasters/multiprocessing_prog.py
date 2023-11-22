import multiprocessing

def test():
    print("this is my multiprocessing prog")

if __name__=="__main__":
    m=multiprocessing.Process(target=test)
    print("this my main prod")
    m.start()
    m.join()


def square(n):
    return n*2

if __name__=="__main__":
    with multiprocessing.Pool(processes=5) as pool:
        out=pool.map(square,[3,4,5,6,6,7,87,8,8])
        print(out)

#########################
import multiprocessing

def producer(q):
    for i in ["sudh" , "kumar" , "pwskills" , "krish" ,"naik"] : 
        q.put(i)
    
def consume(q) : 
    while True :
        item = q.get()
        if item is None :
            break 
        print(item)
        
if __name__ == '__main__':
    queue = multiprocessing.Queue()
    m1 = multiprocessing.Process(target=producer , args= (queue,))
    m2 = multiprocessing.Process(target=consume ,args=(queue,) )
    m1.start()
    m2.start()
    queue.put("xyz")
    m1.join()
    m2.join()