import tokensToAst from "./ast";
import { astToJS } from "./codegen";
import tokenize from "./tokenize";

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = '> ';

/**
 * @returns user input asynchronously
 */
const read = (): Promise<string> => new Promise((resolve, reject) => {
  rl.question(prompt, (code: string) => {
    resolve(code);
  });
});

/**
 * Run one iteration of the REPL (read, eval, print, loop).
 *
 * @returns noting
 */
const iter = async(): Promise<void> => {
  const code = await read();

  // dont do anything if the line is just whitespace
  if (code.match(/^\s*$/)) return;

  const tokens = tokenize(code);
  const tree = tokensToAst(tokens);
  const transpiled = astToJS(tree);

  // print compiled TypeScript for debugging/demonstration purposes
  console.log(`// ${transpiled}`);

  // evaluate transpiled code, add return to show evaluated expression
  console.log(new Function(`return ${transpiled}`)());

  // add newline
  console.log('')
};

/**
 * Main loop
 */
const main = async(): Promise<never> => {
  console.log('Use ^D to or (exit) to quit\n');

  while (true) {
    try {
      await iter();
    }
    catch (e) {
      console.log(e);
    }
  }

  rl.close();
};

main();