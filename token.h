typedef struct TestToken 
{
    int line;
    int startColumn;
    int endColumn;
    char *type;
    char *value;
} CustomizedToken;

int tokenLizer(const char *input);