const path = require('path');
const amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define;
let editor = null;
let currentEditorType = 0; // 0 for Expression, 1 for Effect, 2 for Function

let tokens = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',

  keywords: [
    'if', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'min', 'max', 'floor', 'ceil', 'round', 'abs', 'rand', 'lerp'
  ],

  operators: [
    '=', '+', '-', '*', '/', '^', '%', '<', '>', '<=', '>=', '==', '&', "|", "!"
  ],

  inputs: [
    'x', 'y', 'index', 'count', 'fraction', 'pi', 'tau', 'time', 'projectionTime', 'projectionStartTime'
  ],

  outputs: [
    'x\'', 'y\'', 'h', 's', 'v'
  ],

  // we include these common regular expressions
  symbols:  /[=><!~?:&|+\-*\/\^%]+/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$]['\w$]*/, { cases: { '@keywords': 'keyword',
                                   '@inputs'  : 'input',
                                   '@outputs' : 'output',
                                   '@default' : 'identifier' } }],

      // whitespace
      { include: '@whitespace' },

      [/@symbols/, { cases: { '@operators': 'operator',
                              '@default'  : '' } } ],

      [/\d+/, 'number'],
    ],


    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/#.*$/,    'comment'],
    ],
  },
};

let theme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    {token: 'input', foreground: 'FFA500'},
    {token: 'output', foreground: '008800'}
  ],
  colors: {
    "editor.background": '#222222'
  }
}

function uriFromPath(_path) {
	var pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}
	return encodeURI('file://' + pathName);
}

function textSetup() {
  amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
  });
  
  // workaround monaco-css not understanding the environment
  self.module = undefined;
  
  amdRequire(['vs/editor/editor.main'], function() {
    monaco.languages.register({
			id: 'tuexpression'
    });
    
		monaco.languages.setMonarchTokensProvider('tuexpression', tokens);

		// Define a new theme that constains only rules that match this language
		monaco.editor.defineTheme('laser-studio', theme);
    
    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('tuexpression', {
    	provideCompletionItems: () => {
        let suggestions = [
          {
            label: 'x',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'x',
            detail: "float (input)",
            documentation: "The input horizontal coordinate taken from the projection base (shape or grid), ranging from -100 (left) to 100 (right)."
          }, {
            label: 'y',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'y',
            detail: "float (input)",
            documentation: "The input vertical coordinate taken from the projection base (shape or grid), ranging from -100 (down) to 100 (up)."
          }, {
            label: 'index',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'index',
            detail: "float (input)",
            documentation: "The unique number associated with the current beam. The index on the first beam is 0, and the last beam equal to the number of beams minus 1."
          }, {
            label: 'count',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'count',
            detail: "float (input)",
            documentation: "The total amount of laser beams in the current projection. In most shapes this is equal to 32."
          }, {
            label: 'fraction',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'fraction',
            detail: "float (input)",
            documentation: "This is equal to the index of the beam divided by the total amount of beams."
          }, {
            label: 'pi',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'pi',
            detail: "float (input)",
            documentation: "3.14159265358979323846264338327950288419716..."
          }, {
            label: 'tau',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'tau',
            detail: "float (input)",
            documentation: "Two times pi. Useful for quickly converting radians per second to Hertz, when using functions such as sin(), cos(), and tan()."
          }, {
            label: 'time',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'time',
            detail: "float (input)",
            documentation: "The current time, in seconds, on the local system (your computer)."
          }, {
            label: 'projectionTime',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'projectionTime',
            detail: "float (input)",
            documentation: "The time, in seconds, since the expression was activated."
          }, {
            label: 'projectionStartTime',
            kind: monaco.languages.CompletionItemKind.value,
            insertText: 'projectionStartTime',
            detail: "float (input)",
            documentation: "The local time, in seconds, when the expression was activated."
          }, {
            label: 'x\'',
            kind: monaco.languages.CompletionItemKind.variable,
            insertText: 'x\'',
            detail: "float (output)",
            documentation: "The output horizontal coordinate of the laser beam, ranging from -100 (left) to 100 (right)."
          }, {
            label: 'y\'',
            kind: monaco.languages.CompletionItemKind.variable,
            insertText: 'y\'',
            detail: "float (output)",
            documentation: "The output vertical coordinate of the laser beam, ranging from -100 (down) to 100 (up)."
          }, {
            label: 'h',
            kind: monaco.languages.CompletionItemKind.variable,
            insertText: 'h',
            detail: "float (output)",
            documentation: "The beam hue, ranging from 0° to 360°. This value is wrapped, so the value is always remapped to this range. 0 means red, 120 means green, and 240 means blue. All values inbetween are interpolated, so you can pick any colour in the spectrum."
          }, {
            label: 's',
            kind: monaco.languages.CompletionItemKind.variable,
            insertText: 's',
            detail: "float (output)",
            documentation: "The beam saturation, ranging from 0 to 1. 0 results in a white beam, and 1 results in a fully saturated colour."
          }, {
            label: 'v',
            kind: monaco.languages.CompletionItemKind.variable,
            insertText: 'v',
            detail: "float (output)",
            documentation: "The beam value (brightness), ranging from 0 to 1. 0 results in the beam being invisible, and 1 results in a fully visible beam."
          }, {
            label: 'sin()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'sin($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "sin(angle)",
            documentation: "Returns the sine of 'angle'."
          }, {
            label: 'cos()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'cos($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "cos(angle)",
            documentation: "Returns the cosine of 'angle'."
          }, {
            label: 'tan()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'tan($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "tan(angle)",
            documentation: "Returns the tangent of 'angle'."
          }, {
            label: 'asin()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'asin($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "asin(float)",
            documentation: "Returns the arcsine of 'float'."
          }, {
            label: 'acos()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'acos($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "acos(float)",
            documentation: "Returns the arccosine of 'float'."
          }, {
            label: 'atan()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'atan($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "atan(float)",
            documentation: "Returns the arctangent of 'float'."
          }, {
            label: 'atan2()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'atan2($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "atan2(x, y)",
            documentation: " Returns the arctangent of 'y'/'x' with consideration for divide-by-zero edge cases."
          }, {
            label: 'sqrt()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'sqrt($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "sqrt(float)",
            documentation: "Returns the square-root of 'float'."
          }, {
            label: 'min()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'min($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "min(a, b)",
            documentation: "Returns the smaller value of 'a' or 'b'."
          }, {
            label: 'max()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'max($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "max(a, b)",
            documentation: "Returns the larger value of 'a' or 'b'."
          }, {
            label: 'floor()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'floor($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "floor(float)",
            documentation: "Returns the value 'float' rounded down to the nearest whole number less than 'float'."
          }, {
            label: 'ceil()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'ceil($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "ceil(float)",
            documentation: "Returns the value 'float' rounded up to the nearest whole number greater than 'float'."
          }, {
            label: 'round()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'round($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "round(float)",
            documentation: "Returns the value 'float' rounded to the nearest whole number."
          }, {
            label: 'abs()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'abs($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "abs(float)",
            documentation: "Returns the absolute value of 'float' ('float' < 0 ? -'float' : 'float')."
          }, {
            label: 'rand()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'rand()',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "rand()",
            documentation: "Returns a random number between 0.0 and 1.0."
          }, {
            label: 'if()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'if($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "if(float, a, b)",
            documentation: "Returns 'a' if 'float' is 1 or greater otherwise returns b."
          }, {
            label: 'lerp()',
            kind: monaco.languages.CompletionItemKind.function,
            insertText: 'lerp($0)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "lerp(frac, a, b)",
            documentation: "Interpolates between 'a' and 'b' using 'frac' (a*frac + b*(1-frac))."
          },
        ];
    		return { suggestions: suggestions };
    	}
    });

    editor = monaco.editor.create(document.getElementById('text-container'), {
      theme: "laser-studio",
      value: fileObject.editor.text,
      language: 'tuexpression'
    });

    editor.getModel().onDidChangeContent((e) => {
      fileObject.editor.text = editor.getValue()
    })

    window.addEventListener("resize", (e) => {
      editor.layout();
    })

    document.getElementById("text-undo").addEventListener("click", (e) => {
      editor.trigger('aaaa', 'undo', 'aaaa');
    })
    document.getElementById("text-redo").addEventListener("click", (e) => {
      editor.trigger('aaaa', 'redo', 'aaaa');
    })
    document.getElementById("text-find").addEventListener("click", (e) => {
      editor.getAction('actions.find').run()
    })
  });
}