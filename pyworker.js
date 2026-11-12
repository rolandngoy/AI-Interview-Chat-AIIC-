/* =========================================================
   AI Interview Chat — runs the candidate's Python in the browser
   Uses Pyodide (CPython compiled to WebAssembly) inside a Web Worker
   so an infinite loop can be stopped by terminating the worker.
   ========================================================= */
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

const RUNNER = `
import json

def run_tests(code, fn_name, tests_json):
    ns = {'__name__': 'candidate'}
    try:
        exec(compile(code, 'solution.py', 'exec'), ns)
    except BaseException as e:
        return json.dumps({'error': type(e).__name__ + ': ' + str(e)})
    fn = ns.get(fn_name)
    if not callable(fn):
        return json.dumps({'error': 'Define a function named ' + fn_name + '.'})
    out = []
    for t in json.loads(tests_json):
        shown = ', '.join(repr(a) for a in t['args'])
        try:
            got = fn(*t['args'])
            if isinstance(got, tuple):
                got = list(got)
            out.append({'ok': got == t['expected'], 'call': fn_name + '(' + shown + ')', 'expected': repr(t['expected']), 'got': repr(got)})
        except BaseException as e:
            out.append({'ok': False, 'call': fn_name + '(' + shown + ')', 'expected': repr(t['expected']), 'got': type(e).__name__ + ': ' + str(e)})
    return json.dumps({'results': out})
`;

const ready = loadPyodide().then(function (py) { py.runPython(RUNNER); return py; });
ready.then(function () { postMessage({ ready: true }); },
           function (err) { postMessage({ loadError: String(err) }); });

self.onmessage = async function (e) {
  const d = e.data;
  try {
    const py = await ready;
    py.globals.set('user_code', d.code);
    py.globals.set('fn_name', d.fn);
    py.globals.set('tests_json', JSON.stringify(d.tests));
    const out = py.runPython('run_tests(user_code, fn_name, tests_json)');
    postMessage({ id: d.id, out: JSON.parse(out) });
  } catch (err) {
    postMessage({ id: d.id, out: { error: String(err) } });
  }
};
