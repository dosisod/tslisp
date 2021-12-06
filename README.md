# TSLisp

A small LISP-like dialect written in TypeScript.

# Installation / Usage

```
$ git clone https://github.com/dosisod/tslisp
$ npm install
$ npm run repl
```

# Syntax

```lisp
; an empy list, as well as null/false
()

; list of numbers
(list 1 3.14 -1234)

; list of built-in constants
(list true false)

; define a constant
(defconstant pi 3.1415)

; define a function called square, that takes 1 argument, and squares it
(defun square (x) (* x x))

; call TypeScript function console.log with argument "hello world"
(console.log "hello world")
```

## TypeScript Operators in TSLisp

| TSLisp      | TypeScript |
|-------------|------------|
| `(= 1 2)`   | `1 === 2`  |
| `(!= 1 2)`   | `1 !== 2`  |
| `(+ 1 2)`   | `1 + 2`  |
| `(- 1 2)`   | `1 - 2`  |
| `(* 1 2)`   | `1 * 2`  |
| `(/ 1 2)`   | `1 / 2`  |
| `(not x)` | `!x`  |
| `(neg 1)`   | `-1`  |
| `(or 1 2)`  | `1 \|\| 2`  |
| `(and 1 2)` | `1 && 2`  |
| `(xor 1 2)`   | `1 ^ 2`  |
| `(mod 1 2)` | `1 % 2` |
| `(< 1 2)` | `1 < 2` |
| `(<= 1 2)` | `1 <= 2` |
| `(> 1 2)` | `1 > 2` |
| `(>= 1 2)` | `1 >= 2` |
| `(exp n p)` | `n ** p` |
| `(rshift n b)` | `n << b` |
| `(lshift n b)` | `n >> b` |

# TypeScript Functions in TSLisp

| TSLisp      | TypeScript |
|-------------|------------|
| `(filter f l)`    | `l.filter(f)`   |
| `(map f l)`    | `l.map(f)`   |
| `(some f l)`    | `l.some(f)`   |
| `(every f l)`    | `l.every(f)`   |
| `(length str)`    | `str.length`   |
| `(list x y z)` | `[x, y, z]` |
| `(includes v l)` | `l.includes(v)` |

# TypeScript Control Flow in TSLisp

| TSLisp        | TypeScript |
|---------------|------------|
| `(if x (if-true) (if-false))` | `if (x) { if-true; } else { if-false }` |
