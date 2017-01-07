#include<stdio.h>
#define M 2
#define N 3

void to_zero(int arr[][N], int x, int y);
void search_zero(int arr[][N]);
void print(int arr[][N]);

int main() {
	int arr[M][N] = {{1, 2, 3}, {4, 0, 6}};
	print(arr);
	search_zero(arr);
	printf("\n");
	print(arr);
	return 0;
}

void search_zero(int arr[][N]) {
	int i,j;
	for(i = 0; i < M; i++)
		for(j = 0;j<N; j++)
			if(arr[i][j] == 0)
				to_zero(arr, i, j);
}

void to_zero(int arr[][N], int x, int y) {
	int i;
	for(i = 0; i < M; i++)
		arr[i][y] = 0;
	for(i = 0;i < N ; i++)
		arr[x][i] = 0;
}

void print(int arr[][N]) {
	int i,j;
	for(i = 0 ; i < M ; i++) {
		for(j = 0 ; j < N ; j++)
			printf("%4d ", arr[i][j]);
		printf("\n");
	}
}
