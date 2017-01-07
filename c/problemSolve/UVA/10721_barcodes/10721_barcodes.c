#include<stdio.h>
#include<string.h>

#define MAX_TABLE_SIZE 51

#define MIN(a,b) (a > b ? b : a)

int main() {

	int n, k, m;
	int i, j, l;	// iterator count
	long long dynamic_table[MAX_TABLE_SIZE][MAX_TABLE_SIZE];
	long long data_sum;

	while(scanf("%d %d %d", &n, &k, &m) == 3)
	{
		// initialize
		memset(dynamic_table, 0, sizeof(dynamic_table));

		// if can't make barcode, then print ZERO
		if(k > n)
		{
			printf("0\n");
			return 0;
		}

		// n,1 = 1
		for(i = 1 ; i <= MIN(n, m) ; i++)
			dynamic_table[i][1] = 1;

		// d[i][j] = sum(d[i-k][j-1]) [1 <= k <= min(m, n-1)]
		for(i = 2 ; i <= n ; i++)
		{
			for(j = 2 ; j <= i ; j++)
			{
				data_sum = 0;
				for(l = 1 ; l <= MIN(m, i-1) ; l++)
					data_sum += dynamic_table[i-l][j-1];
				dynamic_table[i][j] = data_sum;
			}
		}

		printf("%lld\n", dynamic_table[n][k]);

	}

	return 0;
}
