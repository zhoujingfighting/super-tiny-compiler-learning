import { CustomizedToken } from './token';
export namespace TokenErrorReporter {

    export function unknownWords(token: CustomizedToken): string {
        return `Unknown token type in line ${token.line}, from column ${token.startColumn} to column ${token.endColumn}, value is '${token.value}'`;
    }

    export function wrongWords(token: CustomizedToken): string {
        return `Wrong token type in line ${token.line}, from column ${token.startColumn} to column ${token.endColumn}, value is '${token.value}'`;
    }

}