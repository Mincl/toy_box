import numpy as np

def swap_rows(mat, frm, to):
    mat[[frm, to], :] = mat[[to, frm], :]

# parameter: target matrix
# return: L, U, P matrix
def LU_decomposition(A):
    n = len(A)
    L = np.zeros((n, n))
    U = A.copy()
    P = np.identity(n)
    for i in range(0, n):
        pivot = U[i, i]
        if pivot == 0:
            # find non zero pivot from same cols
            for j in range(i+1, n):
                if U[j, i] != 0:
                    swap_rows(U, i, j)
                    swap_rows(L, i, j)
                    swap_rows(P, i, j)
                    break
            pivot = U[i, i]
        for j in range(i+1, n):
            multiple = U[j, i] / pivot
            L[j, i] = multiple
            for k in range(0, n):
                U[j, k] -= multiple * U[i, k]
    for i in range(0, n):
        L[i, i] = 1
    return [L, U, P]

def forward_substitution(L, B):
    n = len(L)
    result = np.empty([n, 1])
    for i in range(0, n):
        s = 0
        for j in range(0, i):
            s += L[i, j] * result[j, 0]
        result[i, 0] = B[i] - s
    return result

def backward_substitution(U, C):
    n = len(U)
    result = np.empty([n, 1])
    for i in range(n-1, -1, -1):
        s = 0
        for j in range(n-1, i, -1):
            s += U[i, j] * result[j, 0]
        result[i, 0] = (C[i] - s) / U[i, i]
    return result

def LU_factorization(A, B):
    L, U, P = LU_decomposition(A)
    print(L)
    print(U)
    print(P)
    print("")
    middle = forward_substitution(L, P * B)
    print(middle)
    print("")
    return backward_substitution(U, middle)

def inverse_matrix(A):
    n = len(A)
    A2 = A.copy()
    B = np.identity(n)
    # forward substitution
    for i in range(0, n):
        pivot = A2[i, i]
        if pivot == 0:
            # find non zero pivot from same cols
            for j in range(i+1, n):
                if A2[j, i] != 0:
                    swap_rows(A2, i, j)
                    swap_rows(B, i, j)
                    break
            pivot = A2[i, i]
        for j in range(i+1, n):
            multiple = A2[j, i] / pivot
            for k in range(0, n):
                B[j, k] -= multiple * B[i, k]
                A2[j, k] -= multiple * A2[i, k]
    print(A2)
    # upward substitution
    for i in range(n-1, -1, -1):
        pivot = A2[i, i]
        for j in range(i-1, -1, -1):
            multiple = A2[j, i] / pivot
            A2[j, i] = multiple
            for k in range(0, n):
                B[j, k] -= multiple * B[i, k]
    print(B)
    # divide
    for i in range(0, n):
        if A2[i, i] != 1:
            for j in range(0, n):
                B[i, j] /= A2[i, i]
            A2[i, i] = 1
    return B


