#0,1,1,2,3,5,8,13


def fib_f(n):
   # fib = []
   # print(type(fib))
    if (n ==1):
        fib = [0]
   # print(fib)
    if (n == 2):
        fib =  fib.append(1)
    else:
        fib =  fib.append(fib_f(n-1)[-1] + fib_f(n-2)[-1])

    return fib

print(fib_f(3))


#puneeth.harlapur@cigniti.com




@some_decorator
def fun_wrapper(func1):
    def modifier(func1):
        print(funct1 + "did some change")
        return funct1
    return mo

fun_wrapper(func1)

