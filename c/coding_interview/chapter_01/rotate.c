#include<stdio.h>
#define N 3

void rotate_90_degree_to_right(int image[][N]);
void print_image(int image[][N]);

int main() {
	int image[N][N] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
	print_image(image);
	rotate_90_degree_to_right(image);
	print_image(image);
	return 0;
}

void rotate_90_degree_to_right(int image[][N]) {
	int rotated_image[N][N];
	int i,j;
	for(i = 0; i < N; i++) {
		for(j = 0 ; j < N ; j++) {
			rotated_image[j][N-i-1] = image[i][j];
		}
	}
	for(i = 0; i < N ; i++)
		for(j = 0 ; j < N ; j++)
			image[i][j] = rotated_image[i][j];
}

void print_image(int image[][N]) {
	int i,j;
	for(i = 0; i < N; i++) {
		for(j = 0; j < N; j++)
			printf("%4d ", image[i][j]);
		printf("\n");
	}
}
