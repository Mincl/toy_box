#include<stdio.h>
#include<stdlib.h>
#include<string.h>

typedef struct _Node
{
	char data;
	struct _Node* next;
} Node;

Node* l_add(Node* a, Node* b); // 5th problem
void l_reorder_by_data(Node** begin, char x); // 4th problem
void l_remove_by_data(Node** begin, char data); // 3rd problem
char l_get_last_kth_data(Node* begin, int k); // 2nd problem
void l_remove_duplicate(Node* begin); // 1st problem

void l_swap(Node** begin, Node* prev_left, Node* left, Node* prev_right, Node* right);
// return size
int l_push(Node** begin, char new_data);
void l_print(Node* begin);
void l_print_int(Node* begin);


int main()
{
	Node* begin = NULL;
	Node* a = NULL;
	Node* b = NULL;
	Node* result = NULL;
	int k;

	// using 1st, 2nd, 3rd problem
	//l_push(&begin, 'a');
	//l_push(&begin, 'b');
	//l_push(&begin, 'c');
	//l_push(&begin, 'd');
	//l_push(&begin, 'e');
	//l_push(&begin, 'f');
	//l_push(&begin, 'g');
	//l_print(begin);

	// 1st problem
	//l_remove_duplicate(begin);
	//l_print(begin);

	// 2nd problem
	//k = 4;
	//printf("last %dth data: %c\n", k, l_get_last_kth_data(begin, k));

	// 3rd problem
	//l_remove_by_data(&begin, 'a');
	//l_print(begin);


	// using 4th problem
	//l_push(&begin, 10);
	//l_push(&begin, 2);
	//l_push(&begin, 4);
	//l_push(&begin, 5);
	//l_push(&begin, 1);
	//l_push(&begin, 3);
	//l_push(&begin, 9);
	//l_push(&begin, 6);
	//l_push(&begin, 7);
	//l_push(&begin, 8);
	//l_print_int(begin);

	// 4th problem
	//l_reorder_by_data(&begin, 4);

	// using 5th problem
	l_push(&a, 4);
	l_push(&a, 2);
	l_push(&a, 5);
	l_push(&a, 1);
	l_print_int(a);
	l_push(&b, 3);
	l_push(&b, 8);
	l_push(&b, 4);
	l_print_int(b);

	result = l_add(a, b);

	l_print_int(result);
	return 0;
}

Node* l_add(Node* a, Node* b)
{
	Node* result = NULL;
	Node* it_a = a;
	Node* it_b = b;
	int sum, carry;

	carry = 0;
	while(it_a != NULL || it_b != NULL)
	{
		sum = 0;
		if(it_a != NULL)
		{
			sum += it_a->data;
			it_a = it_a->next;
		}
		if(it_b != NULL)
		{
			sum += it_b->data;
			it_b = it_b->next;
		}
		sum += carry;
		carry = sum / 10;
		l_push(&result, sum % 10);
	}
	if (carry > 0)
		l_push(&result, carry);

	return result;
}

void l_reorder_by_data(Node** begin, char x)
{
	Node* it_left = NULL;
	Node* prev_it_left = NULL;
	Node* it_right = NULL;
	Node* prev_it_right = NULL;
	Node* tmp = NULL;
	it_left = *begin;
	it_right = *begin;
	
	while(it_right != NULL)
	{
		while(it_right != NULL && it_right->data >= x)
		{
			prev_it_right = it_right;
			it_right = it_right->next;
		}

		if (it_right != NULL)
		{
			printf("swap (%d, %d)\n", it_left->data, it_right->data);
			l_swap(begin, prev_it_left, it_left, prev_it_right, it_right);
			l_print_int(*begin);
			prev_it_left = it_right;
			tmp = it_left;
			it_left = it_right->next;
			it_right = tmp;
		}
	}
}

void l_remove_by_data(Node** begin, char data)
{
	Node* it = NULL;
	Node* prev_it = NULL;
	it = *begin;
	while(it != NULL && it->data != data)
	{
		prev_it = it;
		it = it->next;
	}

	if(prev_it == NULL || it != NULL)
	{
		if(prev_it == NULL)
			*begin = (*begin)->next;
		else
			prev_it->next = it->next;
		it->next = NULL;
		free(it);
	}
}

char l_get_last_kth_data(Node* begin, int k)
{
	Node* it = NULL;
	Node* kth_it = NULL;
	int cnt = 0;
	it = begin;
	while(it != NULL)
	{
		if(cnt == k)
		{
			kth_it = begin;
		}
		it = it->next;
		if(kth_it != NULL)
			kth_it = kth_it->next;
		cnt++;
	}

	if(kth_it == NULL)
		return begin->data;
	return kth_it->data;
}

void l_remove_duplicate(Node* begin)
{
	Node* cur = NULL;
	Node* it = NULL;
	Node* prev_it = NULL;
	cur = begin;
	while(cur != NULL && cur->next != NULL)
	{
		prev_it = cur;
		it = cur->next;
		while(it != NULL)
		{
			// found duplicate data
			if(it->data == cur->data)
			{
				prev_it->next = it->next;
				it->next = NULL;
				free(it);
				it = prev_it;
			}
			prev_it = it;
			it = it->next;
		}
		cur = cur->next;
	}
}

void l_swap(Node** begin, Node* prev_left, Node* left, Node* prev_right, Node* right)
{
	Node* tmp = NULL;
	if(left == right)
		return;

	prev_right->next = left;
	if(prev_left == NULL)
		*begin = right;
	else
		prev_left->next = right;
	tmp = right->next;
	right->next = left->next;
	left->next = tmp;
}

int l_push(Node** begin, char new_data)
{
	Node* it = NULL;
	Node* new_node = NULL;
	int size = 0;

	// make new node
	new_node = (Node *)malloc(sizeof(Node));
	memset(new_node, 0, sizeof(Node));
	new_node->data = new_data;
	new_node->next = NULL;

	if(*begin == NULL)
	{
		*begin = new_node;
		size++;
	}
	else
	{
		it = *begin;
		size = 1;
		while (it->next != NULL)
		{
			it = it->next;
			size++;
		}
		it->next = new_node;
		size++;
	}

	return size;
}

void l_print(Node* begin)
{
	Node* it = NULL;
	it = begin;
	while (it != NULL)
	{
		printf("%c ", it->data);
		it = it->next;
	}
	printf("\n");
}

void l_print_int(Node* begin)
{
	Node* it = NULL;
	it = begin;
	while (it != NULL)
	{
		printf("%d ", it->data);
		it = it->next;
	}
	printf("\n");
}
