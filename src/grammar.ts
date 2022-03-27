// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

const opExpr = (operator) => {
  return (d, l) => ({
    operator: operator,
    loc: l,
    left: d[0],
    right: d[2]
  });
}

const notOp = (d) => {
  return {
    operator: 'NOT',
    operand: d[1]
  };
}

const unquotedValue = (d, l, reject) => {
  let query = d.join('');

  if (query === 'true') {
    query = true;
  } else if (query === 'false') {
    query = false;
  } else if (query === 'null') {
    query = null;
  }

  return {
    quoted: false,
    loc: l,
    query,
  };
}

const range = ( minInclusive, maxInclusive) => {
  return (d, l) => {
    return {
      range: {
        loc: l,
        min: d[2],
        minInclusive,
        maxInclusive,
        max: d[6],
      }
    }
  };
}

// const field = (d, l) => {
//   return {
//     field: d[0],
//     fieldLoc: l,
//     fieldPath: d[0].split('.').filter(Boolean),
//     ...d[3]
//   }
// };

const parseDate = (d, l) => {
	const [day, month, year] = d.join("").split("/")
	const fullYear = year.length === 2 ? `20${year}` : year;
	return new Date(`${fullYear}-${month}-${Number(day) + 1}`)
};

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess":
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": (d) => d.join('')},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess":
        function(d) {
            return d.join("");
        }
        },
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess":
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess":
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess":
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess":
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess":
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess":
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "main", "symbols": ["expr"], "postprocess": id},
    {"name": "expr", "symbols": ["two_op_expr"], "postprocess": id},
    {"name": "two_op_expr$string$1", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "two_op_expr", "symbols": ["pre_two_op_expr", "two_op_expr$string$1", "post_one_op_expr"], "postprocess": opExpr('OR')},
    {"name": "two_op_expr$string$2", "symbols": [{"literal":"A"}, {"literal":"N"}, {"literal":"D"}], "postprocess": (d) => d.join('')},
    {"name": "two_op_expr", "symbols": ["pre_two_op_expr", "two_op_expr$string$2", "post_one_op_expr"], "postprocess": opExpr('AND')},
    {"name": "two_op_expr", "symbols": ["one_op_expr"], "postprocess": d => d[0]},
    {"name": "pre_two_op_expr", "symbols": ["two_op_expr", "__"], "postprocess": d => d[0]},
    {"name": "pre_two_op_expr", "symbols": [{"literal":"("}, "_", "two_op_expr", "_", {"literal":")"}, "__"], "postprocess": d => d[2]},
    {"name": "one_op_expr", "symbols": [{"literal":"("}, "_", "two_op_expr", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "one_op_expr$string$1", "symbols": [{"literal":"N"}, {"literal":"O"}, {"literal":"T"}], "postprocess": (d) => d.join('')},
    {"name": "one_op_expr", "symbols": ["one_op_expr$string$1", "post_boolean_primary"], "postprocess": notOp},
    {"name": "one_op_expr", "symbols": ["boolean_primary"], "postprocess": d => d[0]},
    {"name": "post_one_op_expr", "symbols": ["__", "one_op_expr"], "postprocess": d => d[1]},
    {"name": "post_one_op_expr", "symbols": ["__", {"literal":"("}, "_", "one_op_expr", "_", {"literal":")"}], "postprocess": d => d[3]},
    {"name": "boolean_primary", "symbols": ["side"], "postprocess": id},
    {"name": "post_boolean_primary", "symbols": [{"literal":"("}, "_", "boolean_primary", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "post_boolean_primary", "symbols": ["__", "boolean_primary"], "postprocess": d => d[1]},
    {"name": "age_field_value", "symbols": ["relational_operator", "_", "decimal"], "postprocess": (d, l) => ({quoted: false, query: d[2], loc: l, relationalOperator: d[0][0]})},
    {"name": "age_field_value", "symbols": ["decimal"], "postprocess": (d, l) => ({quoted: false, loc: l, query: d.join('')})},
    {"name": "age_field_value", "symbols": ["range"], "postprocess": id},
    {"name": "type_field_value$string$1", "symbols": [{"literal":"e"}, {"literal":"x"}, {"literal":"t"}, {"literal":"r"}, {"literal":"a"}, {"literal":"c"}, {"literal":"t"}, {"literal":" "}, {"literal":"s"}, {"literal":"p"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}, {"literal":"e"}, {"literal":"r"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "type_field_value", "symbols": [{"literal":"\""}, "type_field_value$string$1", {"literal":"\""}], "postprocess": d => d[1]},
    {"name": "type_field_value$string$2", "symbols": [{"literal":"g"}, {"literal":"e"}, {"literal":"n"}, {"literal":"e"}, {"literal":"r"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "type_field_value", "symbols": [{"literal":"\""}, "type_field_value$string$2", {"literal":"\""}], "postprocess": d => d[1]},
    {"name": "created_field_value", "symbols": ["date"], "postprocess": d => d[0]},
    {"name": "created_field_value", "symbols": ["date_range"], "postprocess": d => d[0]},
    {"name": "field$ebnf$1", "symbols": []},
    {"name": "field$ebnf$1", "symbols": ["field$ebnf$1", /[a-zA-Z\d_$.]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "field", "symbols": [/[_a-zA-Z$]/, "field$ebnf$1"], "postprocess": d => d[0] + d[1].join('')},
    {"name": "field", "symbols": ["sqstring"], "postprocess": id},
    {"name": "field", "symbols": ["dqstring"], "postprocess": id},
    {"name": "query", "symbols": ["relational_operator", "_", "decimal"], "postprocess": (d, l) => ({quoted: false, query: d[2], loc: l, relationalOperator: d[0][0]})},
    {"name": "query", "symbols": ["decimal"], "postprocess": (d, l) => ({quoted: false, loc: l, query: d.join('')})},
    {"name": "query", "symbols": ["regex"], "postprocess": (d, l) => ({quoted: false, loc: l, regex: true, query: d.join('')})},
    {"name": "query", "symbols": ["range"], "postprocess": id},
    {"name": "query", "symbols": ["unquoted_value"], "postprocess": unquotedValue},
    {"name": "query", "symbols": ["sqstring"], "postprocess": (d, l) => ({quoted: true, loc: l, query: d.join('')})},
    {"name": "query", "symbols": ["dqstring"], "postprocess": (d, l) => ({quoted: true, loc: l, query: d.join('')})},
    {"name": "range$string$1", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"["}, "_", "range_decimal", "_", "range$string$1", "_", "range_decimal", "_", {"literal":"]"}], "postprocess": range(true, true)},
    {"name": "range$string$2", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"{"}, "_", "range_decimal", "_", "range$string$2", "_", "range_decimal", "_", {"literal":"]"}], "postprocess": range(false, true)},
    {"name": "range$string$3", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"["}, "_", "range_decimal", "_", "range$string$3", "_", "range_decimal", "_", {"literal":"}"}], "postprocess": range(true, false)},
    {"name": "range$string$4", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"{"}, "_", "range_decimal", "_", "range$string$4", "_", "range_decimal", "_", {"literal":"}"}], "postprocess": range(false, false)},
    {"name": "range_decimal", "symbols": ["decimal"], "postprocess": (d, l) => ({ type: "decimal", value: d[0], loc: l })},
    {"name": "date_range$string$1", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "date_range", "symbols": [{"literal":"["}, "_", "range_date", "_", "date_range$string$1", "_", "range_date", "_", {"literal":"]"}], "postprocess": range(true, true)},
    {"name": "date_range$string$2", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "date_range", "symbols": [{"literal":"{"}, "_", "range_date", "_", "date_range$string$2", "_", "range_date", "_", {"literal":"]"}], "postprocess": range(false, true)},
    {"name": "date_range$string$3", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "date_range", "symbols": [{"literal":"["}, "_", "range_date", "_", "date_range$string$3", "_", "range_date", "_", {"literal":"}"}], "postprocess": range(true, false)},
    {"name": "date_range$string$4", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "date_range", "symbols": [{"literal":"{"}, "_", "range_date", "_", "date_range$string$4", "_", "range_date", "_", {"literal":"}"}], "postprocess": range(false, false)},
    {"name": "range_date", "symbols": ["date_range_date"], "postprocess": (d, l) => ({ type: "date",    value: d[0], loc: l })},
    {"name": "date$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "date$ebnf$1", "symbols": ["date$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "date$ebnf$2", "symbols": ["date$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "date$ebnf$3", "symbols": ["date$ebnf$3", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date", "symbols": ["date$ebnf$1", {"literal":"/"}, "date$ebnf$2", {"literal":"/"}, "date$ebnf$3"], "postprocess": parseDate},
    {"name": "date_range_date$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "date_range_date$ebnf$1", "symbols": ["date_range_date$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date_range_date$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "date_range_date$ebnf$2", "symbols": ["date_range_date$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date_range_date$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "date_range_date$ebnf$3", "symbols": ["date_range_date$ebnf$3", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "date_range_date", "symbols": ["date_range_date$ebnf$1", {"literal":"/"}, "date_range_date$ebnf$2", {"literal":"/"}, "date_range_date$ebnf$3"], "postprocess": parseDate},
    {"name": "relational_operator", "symbols": [{"literal":"="}]},
    {"name": "relational_operator", "symbols": [{"literal":">"}]},
    {"name": "relational_operator", "symbols": [{"literal":"<"}]},
    {"name": "relational_operator$string$1", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "relational_operator", "symbols": ["relational_operator$string$1"]},
    {"name": "relational_operator$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "relational_operator", "symbols": ["relational_operator$string$2"]},
    {"name": "regex", "symbols": ["regex_body", "regex_flags"], "postprocess": d => d.join('')},
    {"name": "regex_body$ebnf$1", "symbols": []},
    {"name": "regex_body$ebnf$1", "symbols": ["regex_body$ebnf$1", "regex_body_char"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "regex_body", "symbols": [{"literal":"/"}, "regex_body$ebnf$1", {"literal":"/"}], "postprocess": d => '/' + d[1].join('') + '/'},
    {"name": "regex_body_char", "symbols": [/[^\\]/], "postprocess": id},
    {"name": "regex_body_char", "symbols": [{"literal":"\\"}, /[^\\]/], "postprocess": d => '\\' + d[1]},
    {"name": "regex_flags", "symbols": []},
    {"name": "regex_flags$ebnf$1", "symbols": [/[gmiyusd]/]},
    {"name": "regex_flags$ebnf$1", "symbols": ["regex_flags$ebnf$1", /[gmiyusd]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "regex_flags", "symbols": ["regex_flags$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "unquoted_value$ebnf$1", "symbols": [/[a-zA-Z\-_*]/]},
    {"name": "unquoted_value$ebnf$1", "symbols": ["unquoted_value$ebnf$1", /[a-zA-Z\-_*]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unquoted_value", "symbols": ["unquoted_value$ebnf$1"], "postprocess": d => d[0].join('')},

    // test
    {"name": "side", "symbols": ["side$string$1", {"literal":":"}, "_", "type_field_value"], "postprocess": d => ({fieldName: d[0], fieldValue: d[3] })},
    {"name": "side", "symbols": ["side$string$2", {"literal":":"}, "_", "created_field_value"], "postprocess": d => ({fieldName: d[0], fieldValue: d[3] })},
    {"name": "side$string$1", "symbols": [{"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "side$string$2", "symbols": [{"literal":"c"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"d"}], "postprocess": (d) => d.join('')},
    {"name": "side$string$3", "symbols": [{"literal":"a"}, {"literal":"g"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "side", "symbols": ["side$string$3", {"literal":":"}, "_", "age_field_value"], "postprocess": d => ({fieldName: d[0], fieldValue: d[3] })}

  ],
  ParserStart: "main",
};

export default grammar;
