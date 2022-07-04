#include <iostream>
#include <vector>
#include "../lib/token.h"
using namespace std;

vector<CustomizedToken> *tokenLizer(const char *input)
{

    int lineNumber = 1;
    int columnNumber = 1;
    int current;
    std::string value;
    vector<CustomizedToken> *tokenArray = new vector<CustomizedToken>();
    vector<std::string> errorMessage;
    for (current = 0; input[current]; current++)
    {
        char current_char = input[current];
        switch (current_char)
        {
        case ' ':
        case '\t':
        {
            if (value.length() > 0)
            {
                CustomizedToken ttt = {
                    lineNumber,
                    columnNumber,
                    columnNumber + (int)value.length(),
                    (char *)'+',
                    (char *)"continuousSymbol"};
                tokenArray->push_back(ttt);
                std::cout << value << endl;
                value = "";
            }
        }
        case '\n':
        {
            lineNumber++;
            columnNumber = 1;
            continue;
        }
        case '+': // TODO:换行符每一种网表语言都不一样
        {
            CustomizedToken ttt = {
                lineNumber,
                columnNumber,
                columnNumber + 1,
                (char *)'+',
                (char *)"continuousSymbol"};
            tokenArray->push_back(ttt);
            columnNumber++;
            continue;
        }
        default:
        {
            value.push_back(input[current]);
        }
        };
    };
    // for (auto a : *tokenArray)
    // {
    //     std::cout << a.endColumn << " : " << a.startColumn << endl;
    // }
    return tokenArray; //其他地方引用完得删除引用
};