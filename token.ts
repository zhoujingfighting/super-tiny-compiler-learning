const str = '.model modelName modelType param1 =val1\n.subckt name type $frfr';
interface CustomizedToken {
    line: number;
    startColumn: number;
    endColumn: number;
    type: string;
    value: string;
}
interface TokenConfig {
    modelDefinition: string;
    parameterDefinition: string;
    subcktDefinition: string;
    deviceDefinition: string;
    netlistEndDefinition: string,
    subcktEndDefinition: string
}

/**
 * TODO: add ads definition here
 */
const ng_config = require('./ngspice.json') as TokenConfig;
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
    let errorMessage: string[] = [];// TODO: 自定义一些error massage
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
            columnNumber = 0;
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
        else if (/[a-z\.0-9]/i.test(char) && char !== undefined) {//FIXME:这里后面需要再详细定义具体的
            let _endColumnNumber = columnNumber;
            let value = '';
            while (/[a-z\.\=0-9]/i.test(char) && char !== undefined) { //FIXME:这里后面需要再详细定义具体的
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
            if (new RegExp(ng_config.modelDefinition, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "modelDefinition"
                });
            }
            //subckt definition
            else if (new RegExp(ng_config.subcktDefinition, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "subcktDefinition"
                });
            }
            //parameter definition
            else if (new RegExp(ng_config.parameterDefinition, 'i').test(value)) {
                tokens.push({
                    ...basicToken,
                    type: "parameterDefinition"
                })
            }//这里可以添加任何你想要的token
            else {
                tokens.push({
                    ...basicToken,
                    type: 'stringLiteral'
                })
            }
            columnNumber = _endColumnNumber;
        }
        else if (char === '$' || char === ';' || char === '*') { //处理注释的逻辑
            let _endColumnNumber = columnNumber;
            let value = '';
            while (!/(\r\n|\n)/i.test(char) && char !== undefined) { // FIXME:这里后面需要更加详细的定义
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
        else { //这里需要匹配那些没有匹配到的token字符串。并且给它暴露出来
            current++;
            columnNumber++;
        }
    }
    return tokens;
}

console.log(token(str))
