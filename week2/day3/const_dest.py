class MyClass:
    def __init__(self, value):
        self.value = value
        print("Constructor called, value initialized to:", self.value)

    def __del__(self):
        print(f"Destructor called,{self.value} object is being destroyed")

    def __str__(self):
        return f"MyClass with value: {self.value}"  
    
    def __add__(self, other):
        if isinstance(other, MyClass):
            return MyClass(self.value + other.value)
    

obj = MyClass(10)
print(obj)
r1 = MyClass(20)
result = obj + r1
print(result.value)
del obj
del r1

