#include <vector>
#include <json/json.h>
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
    //def
    def_model = 1,
    def_subckt = 2,
    def_paramter = 3,
    def_netlist_end = 4,
    def_subckt_end = 5,
    def_title = 6,
    def_quote = 7,
    def_left_paren = 8,
    def_right_paren = 9,
};

enum Simulators {
    NGSPICE,
    addressof
    //others
};

std::vector<CustomizedToken> *tokenLizer(const char *input);
char *getToken(TokenTypes tokenTypes, Simulators simulator);