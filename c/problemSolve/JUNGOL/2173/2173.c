#include<stdio.h>
#include<string.h>

#define MAX_SIZE 51
#define MAX(a,b)(a > b?a:b)
#define MIN(a,b)(a > b?b:a)

typedef struct _Pair
{
    int max;
    int min;
} Pair;

int main()
{
    int n, m, shift_cnt;
    int necklace[MAX_SIZE] = {};
    int d[MAX_SIZE][MAX_SIZE] = {};
    Pair d_pair[MAX_SIZE][MAX_SIZE][MAX_SIZE] = {};
    int d_pair_cnt[MAX_SIZE][MAX_SIZE] = {};
    int neck_sum[MAX_SIZE] = {};
    int i, j, k, l;
    int tmp_max, tmp_min, tmp_d;
    int result;

    // input data
    scanf("%d %d", &n, &m);
    for(i = 0; i < m; i++)
        scanf("%d", &necklace[i]);

    shift_cnt = m; result = 1 << 30;
    while(shift_cnt--)
    {
        // print necklace
        /*
        for(i = 0; i < m ; i++)
            printf("%d ", necklace[i]);
        printf("\n");
        */

        // clear data
        memset(d, 0, sizeof(int) * MAX_SIZE * MAX_SIZE);
        memset(d_pair, 0, sizeof(Pair) * MAX_SIZE * MAX_SIZE * MAX_SIZE);
        memset(d_pair_cnt, 0, sizeof(int) * MAX_SIZE * MAX_SIZE);
        memset(neck_sum, 0, sizeof(int) * MAX_SIZE);

        // initialize tables
        neck_sum[0] = necklace[0];
        for(i = 1; i < m ; i++)
            neck_sum[i] = neck_sum[i-1] + necklace[i];
        for(j = 0; j < m ; j++)
        {
            d_pair[1][j][0].min = neck_sum[j];
            d_pair[1][j][0].max = neck_sum[j];
            d_pair_cnt[1][j]++;
        }

        // Dynamic Programming
        for(i = 2; i <= n; i++)
        {
            for(j = i-1; j < m; j++)
            {
                tmp_d = 1 << 30;
                for(k = 1; k <= j; k++)
                {
                    for(l = 0; l < d_pair_cnt[i-1][j-k]; l++)
                    {
                        tmp_max = MAX(d_pair[i-1][j-k][l].max, neck_sum[j]-neck_sum[j-k]);
                        tmp_min = MIN(d_pair[i-1][j-k][l].min, neck_sum[j]-neck_sum[j-k]);
                        if(tmp_d > tmp_max - tmp_min)
                            tmp_d = tmp_max - tmp_min;
                    }
                }
                d[i][j] = tmp_d;

                // add min/max list
                for(k = 1; k <= j; k++)
                {
                    for(l = 0; l < d_pair_cnt[i-1][j-k]; l++)
                    {
                        tmp_max = MAX(d_pair[i-1][j-k][l].max, neck_sum[j]-neck_sum[j-k]);
                        tmp_min = MIN(d_pair[i-1][j-k][l].min, neck_sum[j]-neck_sum[j-k]);
                        if(d[i][j] == tmp_max - tmp_min)
                        {
                            //printf("%d %d [%d]: %d - %d = %d\n", i, j, k, tmp_max, tmp_min, d[i][j]);
                            d_pair[i][j][d_pair_cnt[i][j]].max = tmp_max;
                            d_pair[i][j][d_pair_cnt[i][j]++].min = tmp_min;
                        }
                    }
                }
            }
        }
        //printf("%d shift result: %d\n", m-shift_cnt-1, d[n][m-1]);
        result = MIN(result, d[n][m-1]);

        // shift necklace
        tmp_d = necklace[0];
        for(i = 0; i < m-1; i++)
            necklace[i] = necklace[i+1];
        necklace[m-1] = tmp_d;
    }

    // print result
    printf("%d\n", result);
}
