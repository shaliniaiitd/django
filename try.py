#Fibonacci [0,1,2,3,5]

def fib(n):
    ans = [0]
    if n == 1:
        return ans
    ans.append(1)
    if n == 2:
        #ans.append(1)
        return ans
    for j in range(2,n):
        ans.append(fib(j-1)[-1] + fib(j)[-1])

    return ans

for i in range (1,6):

    print(fib(i))



def check(inp):
    expected_start = ['(', '{', '[']
    expected_end = [')', '}', ']']


    inp = list(inp)
    done = []; status = 'False'
    for x in inp:
        if x in expected_end:
            return False
        elif x in expected_start:
            ind = expected_start.index(x)
            print (ind)

            if expected_end[ind] in inp:
                print(inp)
                inp.remove(x)
                inp.remove(expected_end[ind])
                print(inp)
                status = 'True'
            else :
               return False
    return status

print(check( "(] {}"))



