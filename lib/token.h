#include <vector>

typedef struct TestToken
{
    int line;
    int startColumn;
    int endColumn;
    char *type;
    char *value;
} CustomizedToken;

enum TokenTypes
{
    MODEL,
    SUBCKT,
    PARAMETR,
    DEVICE,
    NETLIST_END,
    SUBCKT_END,
    TITLE,
    QUOTE,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
};

enum Simulators {
    NGSPICE,
    addressof
    //others
};

std::vector<CustomizedToken> *tokenLizer(const char *input);
char *getToken(TokenTypes tokenTypes, Simulators simulator);