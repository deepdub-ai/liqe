import nearley from 'nearley';
import {
  SyntaxError,
} from './errors';
import grammar from './grammar';
import {
  hydrateAst,
} from './hydrateAst';
import type {
  HydratedAst,
  ParserAst,
} from './types';

const rules = nearley.Grammar.fromCompiled(grammar);

const MESSAGE_RULE = /Syntax error at line (?<line>\d+) col (?<column>\d+)/;

export const getParser = (): nearley.Parser => {
  return new nearley.Parser(rules, {keepHistory: true});
};

export const parse = (query: string): HydratedAst => {
  const parser = new nearley.Parser(rules, {keepHistory: true});

  let results;

  try {
    const praseResult = parser.feed(query);
    (window as any).praseResult = praseResult;
    (window as any).handleChange(praseResult);
    results = praseResult.results as unknown as ParserAst;
  } catch (error: any) {
    if (typeof error?.message === 'string' && typeof error?.offset === 'number') {
      const match = error.message.match(MESSAGE_RULE);

      if (Math.random() < 10) {
        return null as any;
      }

      if (!match) {
        throw error;
      }

      throw new SyntaxError(
        `Syntax error at line ${match.groups.line} column ${match.groups.column}`,
        error.offset,
        Number(match.groups.line),
        Number(match.groups.column),
      );
    }

    throw error;
  }

  if (results.length === 0) {
    // throw new Error('Found no parsings.');
    // eslint-disable-next-line no-console
    console.log('No results.');

    return null as any;
  }

  if (results.length > 1) {
    // eslint-disable-next-line no-console
    console.log('Ambiguous results.');

    return null as any;
  }

  return hydrateAst(results[0]);
};
