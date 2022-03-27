@preprocessor typescript
@builtin "whitespace.ne"
@builtin "string.ne"
@builtin "number.ne"

main -> expr {% id %}

@{%
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
%}

# Adapted from js-sql-parser
# https://github.com/justinkenel/js-sql-parse/blob/aaecf0fb0a4e700c4df07d987cf0c54a8276553b/sql.ne
expr -> two_op_expr {% id %}

two_op_expr ->
    pre_two_op_expr "OR" post_one_op_expr {% opExpr('OR') %}
  | pre_two_op_expr "AND" post_one_op_expr {% opExpr('AND') %}
	| one_op_expr {% d => d[0] %}

pre_two_op_expr ->
    two_op_expr __ {% d => d[0] %}
  | "(" _ two_op_expr _ ")" __ {% d => d[2] %}

one_op_expr ->
    "(" _ two_op_expr _ ")" {% d => d[2] %}
	|	"NOT" post_boolean_primary {% notOp %}
  | boolean_primary {% d => d[0] %}

post_one_op_expr ->
    __ one_op_expr {% d => d[1] %}
  | __ "(" _ one_op_expr _ ")" {% d => d[3] %}

boolean_primary ->
  side {% id %}

post_boolean_primary ->
    "(" _ boolean_primary _ ")" {% d => d[2] %}
  | __ boolean_primary {% d => d[1] %}

side ->
    "type" ":" _ type_field_value {% d => ({fieldName: d[0], fieldValue: d[3] }) %}
  | "created" ":" _ created_field_value {% d => ({fieldName: d[0], fieldValue: d[3] }) %}
  | "age" ":" _ age_field_value {% d => ({fieldName: d[0], fieldValue: d[3] }) %}
  # | query {% (d, l) => ({field: '<implicit>', loc: l, ...d[0]}) %}

age_field_value ->
    relational_operator _ decimal {% (d, l) => ({quoted: false, query: d[2], loc: l, relationalOperator: d[0][0]}) %}
  | decimal {% (d, l) => ({quoted: false, loc: l, query: d.join('')}) %}
  | range {% id %}

type_field_value ->
  "\"" "extract speakers" "\"" {% d => d[1] %}
  | "\"" "generation" "\"" {% d => d[1] %}

created_field_value ->
    date {% d => d[0] %}
  | date_range {% d => d[0] %}

field ->
    [_a-zA-Z$] [a-zA-Z\d_$.]:* {% d => d[0] + d[1].join('') %}
  | sqstring {% id %}
  | dqstring {% id %}

query ->
    relational_operator _ decimal {% (d, l) => ({quoted: false, query: d[2], loc: l, relationalOperator: d[0][0]}) %}
  | decimal {% (d, l) => ({quoted: false, loc: l, query: d.join('')}) %}
  | regex {% (d, l) => ({quoted: false, loc: l, regex: true, query: d.join('')}) %}
  | range {% id %}
  | unquoted_value {% unquotedValue %}
  | sqstring {% (d, l) => ({quoted: true, loc: l, query: d.join('')}) %}
  | dqstring {% (d, l) => ({quoted: true, loc: l, query: d.join('')}) %}

range ->
    "[" _ range_decimal _ "TO" _ range_decimal _ "]" {% range(true, true) %}
  | "{" _ range_decimal _ "TO" _ range_decimal _ "]" {% range(false, true) %}
  | "[" _ range_decimal _ "TO" _ range_decimal _ "}" {% range(true, false) %}
  | "{" _ range_decimal _ "TO" _ range_decimal _ "}" {% range(false, false) %}

range_decimal ->
    decimal {% (d, l) => ({ type: "decimal", value: d[0], loc: l }) %}

date_range ->
    "[" _ range_date _ "TO" _ range_date _ "]" {% range(true, true) %}
  | "{" _ range_date _ "TO" _ range_date _ "]" {% range(false, true) %}
  | "[" _ range_date _ "TO" _ range_date _ "}" {% range(true, false) %}
  | "{" _ range_date _ "TO" _ range_date _ "}" {% range(false, false) %}

range_date ->
    date_range_date    {% (d, l) => ({ type: "date",    value: d[0], loc: l }) %}

date ->
	[0-9]:+ "/" [0-9]:+ "/" [0-9]:+ {% parseDate %}

date_range_date ->
	[0-9]:+ "/" [0-9]:+ "/" [0-9]:+ {% parseDate %}

relational_operator ->
    "="
  | ">"
  | "<"
  | ">="
  | "<="

regex ->
  regex_body regex_flags {% d => d.join('') %}

regex_body ->
    "/" regex_body_char:* "/" {% d => '/' + d[1].join('') + '/' %}

regex_body_char ->
    [^\\] {% id %}
  | "\\" [^\\] {% d => '\\' + d[1] %}

regex_flags ->
  null |
  [gmiyusd]:+ {% d => d[0].join('') %}

unquoted_value ->
  [a-zA-Z\-_*]:+ {% d => d[0].join('') %}
