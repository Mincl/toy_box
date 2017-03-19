import numpy as np

f = open("input.txt", "r")

A_str = f.readline()
C_str = f.readline()

f.close()

A = np.matrix(A_str)
B = np.matrix(C_str)

def make_LU(A):
    n = len(A)
    L = np.identity(n)
    U = A
    for i in range(0, n):
        for j in range(i+1, n):
            multiple = U[j, i] / U[i, i]
            L[j, i] = multiple
            for k in range(0, n):
                U[j, k] -= multiple * U[i, k]
    return [L, U]

L, U = make_LU(A)

print(L*U)
print(L)
print(U)
print(B)

# A = n * n
# B = b * 1
def find_value_by_topdown(L, B):
    n = len(L)
    result = np.empty([n, 1])
    for i in range(0, n):
        s = 0
        for j in range(0, i):
            s += L[i, j] * result[j, 0]
        result[i, 0] = B[i] - s
    return result

def find_value_by_bottomup(U, C):
    n = len(A)
    result = np.empty([n, 1])
    for i in range(n-1, -1, -1):
        s = 0
        for j in range(n-1, i, -1):
            s += U[i, j] * result[j, 0]
        result[i, 0] = (C[i] - s) / U[i, i]
    return result


C = find_value_by_topdown(L, B)
print(C)

R = find_value_by_bottomup(U, C)
print(R)
