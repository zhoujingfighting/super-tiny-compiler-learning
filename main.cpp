#include <iostream>
#include "token.h"
#include <string.h>
#include <stdio.h>
#include <vector>
using namespace std;

int main()
{
    int lineNumber = 1;
    int columnNumber = 1;
    int current = 0;
    std::string value;
    const char *input = ".model Q2N2222  (NPN Is=\"14.34f\" Xti=3\nerer";
    vector<CustomizedToken> tokenArray;
    vector<std::string> errorMessage;
    for (; input[current]; current++)
    {
        char current_char = input[current];
        switch (current_char)
        {
        case ' ':
        case '\t':
            if (value.length() > 0)
            {
                switch (value.substr()) //这里需要做一个字符值映射
                {
                case '.model':
                    std::cout << 1 <<endl;
                    break;
                
                default:
                    break;
                }
                ++columnNumber;
                value.clear();
                continue;
            }
        case '\n':
            lineNumber++;
            columnNumber = 1;
            continue;
        case '+': // TODO:换行符每一种网表语言都不一样
            tokenArray.push_back({lineNumber,
                                  columnNumber,
                                  ++columnNumber,
                                  (char *)'+',
                                  (char *)"continuousSymbol"});
            continue;
        default:
            value.push_back(current_char);
            break;
        }
    }

    return 23;
}