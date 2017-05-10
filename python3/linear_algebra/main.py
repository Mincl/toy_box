import numpy as np
from LU_factorization import *

f = open("input.txt", "r")

A_str = f.readline()
C_str = f.readline()

f.close()

A = np.matrix(A_str)
B = np.matrix(C_str)
print(A)
print(B)
print("")

R = LU_factorization(A, B)
print(R)
print("")

inverse_A = inverse_matrix(A)
print(inverse_A)

print(A * inverse_A)
