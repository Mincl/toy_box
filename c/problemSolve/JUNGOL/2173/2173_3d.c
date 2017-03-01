#include<stdio.h>
#include<string.h>

#define MAX_SIZE 51
#define MAX(a,b)(a > b?a:b)
#define MIN(a,b)(a > b?b:a)

int main()
{
    int n, m, shift_cnt;
    int necklace[MAX_SIZE] = {};
    int d[MAX_SIZE][MAX_SIZE][MAX_SIZE] = {};
    int d_min[MAX_SIZE][MAX_SIZE][MAX_SIZE] = {};
    int d_max[MAX_SIZE][MAX_SIZE][MAX_SIZE] = {};
    int neck_sum[MAX_SIZE] = {};
    int i, j, k, l, p;
    int tmp_max, tmp_min, tmp_d, tmp_l, tmp_p;
    int result;

    // input data
    scanf("%d %d", &n, &m);
    for(i = 0; i < m; i++)
        scanf("%d", &necklace[i]);

    shift_cnt = m; result = 1 << 30;
    while(shift_cnt--)
    {
        // clear data
        memset(d, 0, sizeof(int) * n * m * m);
        memset(d_min, 0, sizeof(int) * n * m * m);
        memset(d_max, 0, sizeof(int) * n * m * m);
        memset(neck_sum, 0, sizeof(int) * m);

        // initialize tables
        neck_sum[0] = necklace[0];
        d_min[1][0][0] = necklace[0];
        d_max[1][0][0] = necklace[0];
        for(i = 1; i < m ; i++)
        {
            neck_sum[i] = neck_sum[i-1] + necklace[i];
            d_min[1][0][i] = neck_sum[i];
            d_max[1][0][i] = neck_sum[i];
        }
        for(i = 1; i < m; i++)
            for(j = i; j < m ; j++)
            {
                d_min[1][i][j] = neck_sum[j] - neck_sum[i-1];
                d_max[1][i][j] = neck_sum[j] - neck_sum[i-1];
            }

        // Dynamic Programming
        for(k = 2; k <= n; k++)
        {
            for(i = 0; i < m; i++)
            {
                for(j = i+1; j < m; j++)
                {
                    tmp_d = 1 << 30;
                    for(l = 1; l < k; l++)
                    {
                        for(p = 1; p <= j-i; p++)
                        {
                            if(tmp_d > MAX(d_max[k-l][i][j-p], d_max[l][j-p+1][j]) - \
                                    MIN(d_min[k-l][i][j-p], d_min[l][j-p+1][j]))
                            {
                                tmp_max = MAX(d_max[k-l][i][j-p], d_max[l][j-p+1][j]);
                                tmp_min = MIN(d_min[k-l][i][j-p], d_min[l][j-p+1][j]);
                                tmp_d = tmp_max - tmp_min;
                                tmp_l = l; tmp_p = p;
                            }
                        }
                    }
                    d[k][i][j] = tmp_d;
                    d_min[k][i][j] = tmp_min;
                    d_max[k][i][j] = tmp_max;
                    printf("%d %d~%d (%d %d~%d + %d %d~%d): %d - %d = %d {%d %d}\n", k, i, j, \
                            k-tmp_l, i, j-tmp_p, tmp_l, j-tmp_p+1, j, \
                            tmp_max, tmp_min, tmp_d, d_max[l][j-p+1][j], d_min[l][j-p+1][j]);
                }
            }
        }
        printf("%d shift result: %d\n", m-shift_cnt-1, d[n][0][m-1]);
        result = MIN(result, d[n][0][m-1]);

        // shift necklace
        tmp_d = necklace[0];
        for(i = 0; i < m-1; i++)
            necklace[i] = necklace[i+1];
        necklace[m-1] = tmp_d;
    }

    // print result
    printf("\n%d\n", result);
}
