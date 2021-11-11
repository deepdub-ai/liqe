import {
  convertWildcardToRegex,
} from './convertWildcardToRegex';
import {
  escapeRegexString,
} from './escapeRegexString';
import {
  parseRegex,
} from './parseRegex';
import type {
  HydratedAst,
  InternalHighlight,
  InternalTest,
  Range,
  RelationalOperator,
} from './types';

type RegExpCache = Record<string, RegExp>;

const createRegexTest = (regexCache: RegExpCache, regex: string) => {
  let rule: RegExp;

  if (regexCache[regex]) {
    rule = regexCache[regex];
  } else {
    rule = regexCache[regex] = parseRegex(regex);
  }

  return (subject: string): string | false => {
    return subject.match(rule)?.[0] ?? false;
  };
};

const testRange = (value: unknown, range: Range): boolean => {
  if (typeof value === 'number') {
    if (value < range.min) {
      return false;
    }

    if (value === range.min && !range.minInclusive) {
      return false;
    }

    if (value > range.max) {
      return false;
    }

    if (value === range.max && !range.maxInclusive) {
      return false;
    }

    return true;
  }

  // @todo handle non-numeric ranges -- https://github.com/gajus/liqe/issues/3

  return false;
};

const testRelationalRange = (query: number, value: number, relationalOperator: RelationalOperator): boolean => {
  switch (relationalOperator) {
    case '=': return value === query;
    case '>': return value > query;
    case '<': return value < query;
    case '>=': return value >= query;
    case '<=': return value <= query;
    default: throw new Error(`Unimplemented relational operator: ${relationalOperator}`);
  }
};

const createStringTest = (regexCache: RegExpCache, ast: HydratedAst) => {
  const query = ast.query;

  if (!query) {
    throw new Error('Unexpected state.');
  }

  if (ast.regex) {
    return createRegexTest(regexCache, query);
  } else if (query.includes('*') && ast.quoted === false) {
    return createRegexTest(regexCache, String(convertWildcardToRegex(query)) + (ast.quoted ? 'u' : 'ui'));
  } else {
    return createRegexTest(regexCache, '/(' + escapeRegexString(query) + ')/' + (ast.quoted ? 'u' : 'ui'));
  }
};

const createValueTest = (ast: HydratedAst): InternalTest => {
  const query = ast.query;

  if (ast.range) {
    return (value) => {
      return testRange(value, ast.range as Range);
    };
  } else if (ast.relationalOperator) {
    const relationalOperator = ast.relationalOperator;

    if (typeof query !== 'number') {
      throw new TypeError('Unexpected state.');
    }

    return (value) => {
      if (typeof value !== 'number') {
        return false;
      }

      return testRelationalRange(query, value, relationalOperator);
    };
  } else if (typeof query === 'boolean') {
    return (value) => {
      return value === query;
    };
  } else if (query === null) {
    return (value) => {
      return value === null;
    };
  } else {
    const testString = createStringTest({}, ast);

    return (value) => {
      return testString(String(value));
    };
  }
};

const testValue = (
  ast: HydratedAst,
  value: unknown,
  resultFast: boolean,
  path: readonly string[],
  highlights: InternalHighlight[],
) => {
  if (Array.isArray(value)) {
    let foundMatch = false;
    let index = 0;

    for (const item of value) {
      if (testValue(ast, item, resultFast, [...path, String(index++)], highlights)) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else if (typeof value === 'object' && value !== null) {
    let foundMatch = false;

    for (const key in value) {
      if (testValue(ast, value[key], resultFast, [...path, key], highlights)) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  }

  if (!ast.test) {
    throw new Error('Unexpected state.');
  }

  const result = ast.test(
    value,
  );

  if (result) {
    highlights.push({
      ...typeof result === 'string' && {keyword: result},
      path: path.join('.'),
    });

    return true;
  }

  return Boolean(
    result,
  );
};

const testField = <T extends Object>(
  row: T,
  ast: HydratedAst,
  resultFast: boolean,
  path: readonly string[],
  highlights: InternalHighlight[],
): boolean => {
  if (!ast.test) {
    ast.test = createValueTest(ast);
  }

  if (ast.field in row) {
    return testValue(
      ast,
      row[ast.field],
      resultFast,
      path,
      highlights,
    );
  } else if (ast.getValue && ast.fieldPath) {
    return testValue(
      ast,
      ast.getValue(row),
      resultFast,
      ast.fieldPath,
      highlights,
    );
  } else if (ast.fieldPath) {
    let value = row;

    for (const key of ast.fieldPath) {
      if (typeof value !== 'object' || value === null) {
        return false;
      } else if (key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return testValue(
      ast,
      value,
      resultFast,
      ast.fieldPath,
      highlights,
    );
  } else if (ast.field === '<implicit>') {
    let foundMatch = false;

    for (const field in row) {
      if (testValue(
        {
          ...ast,
          field,
        },
        row[field],
        resultFast,
        [
          ...path,
          field,
        ],
        highlights,
      )) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else {
    return false;
  }
};

export const internalFilter = <T extends Object>(
  ast: HydratedAst,
  rows: readonly T[],
  resultFast: boolean = true,
  path: readonly string[] = [],
  highlights: InternalHighlight[] = [],
): readonly T[] => {
  if (ast.field) {
    return rows.filter((row) => {
      return testField(
        row,
        ast,
        resultFast,
        ast.field === '<implicit>' ? path : [...path, ast.field],
        highlights,
      );
    });
  }

  if (ast.operator === 'NOT' && ast.operand) {
    const removeRows = internalFilter(
      ast.operand,
      rows,
      resultFast,
      path,
      [],
    );

    return rows.filter((row) => {
      return !removeRows.includes(row);
    });
  }

  if (!ast.left) {
    throw new Error('Unexpected state.');
  }

  const leftRows = internalFilter(
    ast.left,
    rows,
    resultFast,
    path,
    highlights,
  );

  if (!ast.right) {
    throw new Error('Unexpected state.');
  }

  if (ast.operator === 'OR') {
    const rightRows = internalFilter(
      ast.right,
      rows,
      resultFast,
      path,
      highlights,
    );

    return Array.from(
      new Set([
        ...leftRows,
        ...rightRows,
      ]),
    );
  } else if (ast.operator === 'AND') {
    return internalFilter(
      ast.right,
      leftRows,
      resultFast,
      path,
      highlights,
    );
  }

  throw new Error('Unexpected state.');
};
