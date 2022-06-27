const { tokenizer, parser } = require('./the-super-tiny-compiler.js')

const tokens = tokenizer('(add 2 (subtract 4 2))')

parser(tokens)