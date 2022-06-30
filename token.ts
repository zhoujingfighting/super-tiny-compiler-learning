
const str = `.model Q2N2222  (NPN Is="14.34f" Xti=3
+ Itf=.6 Vtf=1.7 Xtf=3 Rb=10)
v1 net-_r2-pad1_ gnd  dc 10
q1 net-_c3-pad2_ net-_c1-pad2_ net-_c2-pad2_ Q2N2222
&454`;
import { TokenErrorReporter } from './token-error-reporting';
console.log(TokenErrorReporter);
export interface CustomizedToken {
    line: number;
    startColumn: number;
    endColumn: number;
    type: string;
    value: string;
}

/**
 * TODO: add ads definition here
 */
const ng_config = require('./ngspice.json');
console.log(ng_config);

/**
 * Token只负责消化单词，然后放在合适的token属性中
 * @param input 
 * @returns token array
 */
const token = (input: string) => {
    let lineNumber: number = 1; //行号
    let columnNumber: number = 1;//列号
    let current = 0; //相当于扫描字符串的指针
    let tokens: CustomizedToken[] = [];
    let tokenErrors: string[] = [];
    while (current < input.length) {
        let char = input[current];
        if (char === ' ' || char === '\t') {
            columnNumber++;
            current++
            continue;
        }
        else if (char === '\n' || char === '\r\n') {
            lineNumber++;
            current++
            columnNumber = 1;
            continue;
        }
        else if (char === '=') {
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: ++columnNumber,
                value: '=',
                type: "equalSymbol"
            });
            current++
            continue;
        }
        // FIXME: special treat for ngspice continuous line
        else if (char === '+') {
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: ++columnNumber,
                value: '+',
                type: "continuousSymbol"
            });
            current++
            continue;
        }
        else if (new RegExp(ng_config.tokens.leftParenthesis).test(char)) {
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: ++columnNumber,
                value: char,
                type: "leftParenthesis"
            });
            current++
            continue;
        }
        else if (new RegExp(ng_config.tokens.rightParenthesis).test(char)) {
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: ++columnNumber,
                value: char,
                type: "rightParenthesis"
            });
            current++
            continue;
        }
        else if (new RegExp(ng_config.tokens.quote).test(char)) {
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: ++columnNumber,
                value: char,
                type: "quote"
            });
            current++
            continue;
        }
        //这里处理的都是dot commands && string literal, dot command的处理
        else if (/\./.test(char) && char !== undefined) {
            let _endColumnNumber = columnNumber;
            let value = '.';
            char = input[++current];
            while (/[a-z0-9]/i.test(char) && char !== undefined) {
                value += char;
                char = input[++current];
                _endColumnNumber++;
            }
            const basicToken: CustomizedToken = {
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: _endColumnNumber,
                value: value,
                type: ""
            }
            //model definition
            if (new RegExp(ng_config.tokens.model, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "modelDefinition"
                });
            }
            //subckt definition
            else if (new RegExp(ng_config.tokens.subckt, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "subcktDefinition"
                });
            }
            //parameter definition
            else if (new RegExp(ng_config.tokens.parameter, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "parameterDefinition"
                })
            }//这里可以添加任何你想要的token

            //title definition
            else if (new RegExp(ng_config.tokens.title, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "titleDefinition"
                })
            }

            //netlistEnd definition
            else if (new RegExp(ng_config.tokens.netlistEnd, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "netlistEndDefinition"
                })
            }
            //subcktEnd definition
            else if (new RegExp(ng_config.tokens.subcktEnd, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "subcktEndDefinition"
                })
            }

            //.324f etc number definition
            else if (/\.\d+\w?/.test(value)) { //这个写的不太好，需要进一步的细分字符类型
                tokens.push({
                    ...basicToken,
                    type: "stringLiteral"
                })
            }

            //TODO: Add other token definition here
            else {
                tokens.push({
                    ...basicToken,
                    type: 'dotCommand'
                })
            }
            columnNumber = _endColumnNumber;
        }

        else if (char === '$' || char === ';' || char === '*') {
            let _endColumnNumber = columnNumber;
            let value = '';
            while (!/(\r\n|\n)/i.test(char) && char !== undefined) {
                value += char;
                char = input[++current];
                _endColumnNumber++;
            }
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: _endColumnNumber,
                value: value.substring(1).trim(),
                type: 'comment'//注释
            })
            columnNumber = _endColumnNumber;
        }

        else if (/[\w\d\_\-]/.test(char) && char !== undefined) {
            let _endColumnNumber = columnNumber;
            let value = '';
            while (/[\w\d\_\-\.]/.test(char) && char !== undefined) {
                value += char;
                char = input[++current];
                _endColumnNumber++;
            }
            tokens.push({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: _endColumnNumber,
                value: value,
                type: 'stringLiteral'
            })
            columnNumber = _endColumnNumber;
        }
        else {
            let _endColumnNumber = columnNumber;
            let value = '';
            while (!/\s/.test(char) && char !== undefined) {
                value += char;
                char = input[++current];
                _endColumnNumber++;
            }
            //这里还可以进行进一步的细分：这个属于什么类型的token
            /**
             * 1 ： 没有被定义的
             * 2 ： 其他非法字符集
             */
            tokenErrors.push(TokenErrorReporter.unknownWords({
                line: lineNumber,
                startColumn: columnNumber,
                endColumn: _endColumnNumber,
                value: value,
                type: 'unknownWords'
            }))
            columnNumber = _endColumnNumber;
        }
    }
    tokenErrors.forEach(item => console.error(item));
    return tokens;
}

console.log(token(str))
