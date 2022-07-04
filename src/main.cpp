#include <iostream>
#include "../lib/token.h"
#include <string.h>
#include <stdio.h>
#include <vector>
using namespace std;

int main()
{
    vector<CustomizedToken> *test = tokenLizer(".model name type par1=val1");
    delete test;
    return 23;
}