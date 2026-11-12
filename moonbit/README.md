# MoonBit playground

A small place to learn [MoonBit](https://www.moonbitlang.com/). No external module dependencies are needed.

## Play tic-tac-toe in the browser

A two-player game on the same screen, with a responsive layout, winning-cell highlights, and session scores. The rules run in MoonBit, compiled to JavaScript. No AI opponent or online multiplayer is included.

With the MoonBit toolchain, Node.js, npm, and Python 3 installed:

```sh
cd moonbit
npm run dev
```

Open **http://127.0.0.1:8000**. No `npm install` is needed. The build finds `moon` on PATH, or in `${MOON_HOME:-~/.moon}/bin`, so a shell restart is not needed after a standard installation. Press Ctrl+C to stop the server. After source changes, stop it and run `npm run dev` again, then reload the page.

- Click a cell, or use Tab and Enter/Space. Arrow keys move between available cells; Home/End select the first/last available cell.
- X starts each round. A win or draw adds one point to the session scores.
- **Restart round** clears the board. Completed results stay in the scores.
- **Play another round** starts the next round. **Reset scores** starts a new session.
- Scores stay in memory and clear when the page reloads.

### How the browser game works

| File | Responsibility |
| --- | --- |
| `tictactoe.mbt` | Board state, valid moves, turns, wins, draws, and reset |
| `tictactoe_test.mbt` | Nine rule tests, including all winning lines and invalid moves |
| `browser/game.mbt` | Six exported functions with a small scalar-value API |
| `browser/moon.pkg` | JavaScript ES module output configuration |
| `web/index.html`, `web/styles.css` | Accessible controls and responsive styling |
| `web/app.js` | DOM updates, keyboard input, and session scores; no game-rule implementation |
| `scripts/build.mjs` | Build MoonBit and copy its output to `web/generated/game.mjs` |
| `web/bridge.test.mjs` | Test the actual generated module against all 5,478 reachable boards |

Build and test separately:

```sh
npm run build
npm run test:web
moon test
moon test --target js
moon test --target native
```

Serve `web/` over HTTP, not through a `file://` URL. The generated module is ignored by Git, so run the build after checkout. For static hosting, upload the complete `web/` folder after a build, including `generated/game.mjs`. Python is only the development server, not an application backend. Google Fonts are optional; system fonts work without them.

## What is MoonBit?

MoonBit is a statically typed language with type inference. It supports functional and imperative code. Its main targets are WebAssembly (`wasm` and `wasm-gc`), JavaScript, and native programs.

Useful language features:

- **Enums and pattern matching:** represent states and handle each case.
- **Structs and traits:** define data and shared behavior. `#derive` can generate trait implementations.
- **Functions and iterators:** pass functions as values; filter and transform collections.
- **Explicit missing values and errors:** use `Option[T]`, `Result[T, E]`, or functions with `raise` and `try`/`catch`.
- **Managed memory:** no Rust-style borrow checker. Memory management depends on the target.
- **Built-in tools:** format, check, build, test, snapshot test, and benchmark with `moon`.
- **Foreign-function interfaces (FFI):** call JavaScript, C, or host functions, subject to the selected target.

MoonBit is not a JavaScript runtime or a browser UI framework. Browser APIs need an integration layer. Native file and network applications can use packages such as `moonbitlang/async`. WebAssembly also needs a host; a compiled file does not automatically have access to the DOM, files, or a network.

The language and libraries change. Check package and target support before a larger project.

## Setup

Install the official **MoonBit** VS Code extension, or use the official command-line installer. For macOS and Linux, download and review the script before you run it:

```sh
curl -fsSL https://cli.moonbitlang.com/install/unix.sh -o /tmp/install-moonbit.sh
less /tmp/install-moonbit.sh
bash /tmp/install-moonbit.sh
```

The installer uses `~/.moon` and can update your shell configuration. Open a new terminal, then check:

```sh
moon version
```

See the [installation guide](https://docs.moonbitlang.com/en/latest/tutorial/tour.html#installation) for Windows and other options.

## Run the examples

From the repository root:

```sh
cd moonbit
moon run cmd/main
moon test
moon check
moon fmt --check
```

The default target is `wasm`. `moon run` supplies the runtime for this example.

Expected output:

```text
MoonBit playground
Doubled even values: [4, 8, 12]
Largest value: -2
20 + 22 = 42
Expected error: Cannot divide by zero
```

Try the same code on other targets:

```sh
moon run cmd/main --target js
moon test --target js
moon run cmd/main --target native
moon test --target native
moon build --target wasm-gc
```

The JavaScript commands need Node.js. Native builds can need a platform C compiler. `moon build` writes output under `_build/`; it does not run the program.

## Files to change

| File | Purpose |
| --- | --- |
| `basics.mbt` | Iterators, closures, mutable bindings, and `Option` |
| `calculator.mbt` | Public enum, derived traits, pattern matching, and `Result` |
| `playground_test.mbt` | Eight black-box tests of the basic example API |
| `tictactoe.mbt`, `tictactoe_test.mbt` | Browser game rules and nine rule tests |
| `cmd/main/main.mbt` | Small executable that calls the library |
| `moon.mod` | Module name and default target |
| `moon.pkg`, `cmd/main/moon.pkg` | Package imports and executable configuration |

`pkg.generated.mbti` files describe public package APIs. Run `moon info` after API changes to update them. Keep these files in version control. Build output and downloaded modules are ignored.

First exercise: add a `Subtract` case to `Operation`, handle it in `calculate`, and add a test. Run `moon fmt`, `moon check`, and `moon test`.

## Things we can build

These are proposed experiments, not implemented features. The first three need no external modules.

| Order | Experiment | What we learn | Target or extra work |
| --- | --- | --- | --- |
| 1 | Extend this calculator with subtraction and a recursive expression tree | Enums, recursion, error cases | Any current example target |
| 2 | Build a todo state machine with add, complete, and remove commands | Structs, immutable updates, exhaustive matching | Start in memory; add storage later |
| 3 | Parse and evaluate arithmetic text such as `2 + 3 * 4` | Tokenization, parsing, typed errors, precedence | Pure library and tests |
| 4 | Count words in a file with a native CLI | Argument parsing, maps, file IO | Native; core `argparse` plus file IO support |
| 5 | Validate JSON settings and report useful errors | JSON, data modeling, validation | Core JSON support; add IO separately |
| 6 | Build a browser calculator or todo UI | JavaScript FFI and DOM events | JS target with HTML/JavaScript integration |
| 7 | Call a MoonBit function from JavaScript through WebAssembly | Exports, host imports, data exchange | Wasm plus a small JS host |
| 8 | Draw a grid simulation or Game of Life on a canvas | Arrays, simulation state, rendering boundaries | JS or Wasm; browser host handles canvas |
| 9 | Fetch an HTTP endpoint with a native CLI | Async functions, HTTP, error handling | Native with `moonbitlang/async` |
| 10 | Benchmark a parser or collection algorithm across targets | `bench` blocks, release builds, runtime costs | Same workload on JS, Wasm, and native |
| 11 | Add property-based tests for the parser or state machine | Generated inputs, invariants, shrinking | Core `quickcheck`; no external module needed |

**Suggested path:** calculator → expression parser → browser UI. This lets us reuse the same tested logic while we compare native, JavaScript, and WebAssembly targets.

## Sources

Official references used to prepare this playground:

- [Beginner tour](https://docs.moonbitlang.com/en/latest/tutorial/tour.html)
- [Language introduction](https://docs.moonbitlang.com/en/latest/language/introduction.html)
- [Language fundamentals](https://docs.moonbitlang.com/en/latest/language/fundamentals.html)
- [Tests and property-based testing](https://docs.moonbitlang.com/en/latest/language/tests.html)
- [FFI and target differences](https://docs.moonbitlang.com/en/latest/language/ffi.html)
- [Native CLI quickstart](https://docs.moonbitlang.com/en/latest/tutorial/cli-quickstart.html)
- [Mooncakes package registry](https://mooncakes.io/)

Initial checks use `moon 0.1.20261104 (940aa18 2026-11-04)`, downloaded to a temporary directory. No compiler is bundled with this folder, and the toolchain is not pinned.
