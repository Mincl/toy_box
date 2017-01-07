#include<stdio.h>

void reverse(char *str);

int main() {
	char str[] = "abcdef";
	printf("%s\n", str);
	reverse(str);
	printf("%s\n", str);
	return 0;
}

void reverse(char *str) {
	char *incr_idx, *decr_idx;
	char tmp;
	incr_idx = str;
	for(decr_idx = str; *(decr_idx+1) != '\0'; decr_idx++);
	for(; incr_idx < decr_idx; incr_idx++, decr_idx--) {
		tmp = (*incr_idx);
		(*incr_idx) = (*decr_idx);
		(*decr_idx) = tmp;
	}
}
