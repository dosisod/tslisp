import tokensToAst from "./ast";
import { astToJS } from "./codegen";
import tokenize from "./tokenize";

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = '> ';


const read = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question(prompt, (code: string) => {
      resolve(code);
    });
  });
};


console.log('Use ^D to or (process.exit 0) to quit\n');

(async() => {
  while (true) {
    const code = await read();

    const tokens = tokenize(code);
    const tree = tokensToAst(tokens);
    const transpiled = astToJS(tree);

    console.log(`// ${transpiled}`);

    new Function(transpiled)();
  }

  rl.close();
})();
