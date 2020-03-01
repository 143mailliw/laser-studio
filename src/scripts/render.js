let projectionCode = ""
let interval = setInterval(function() {}, 100000)
let canvas = null
let canvasContext = null
let ext = {};
let projectionStartTime = null;

const { NodeVM } = require( 'vm2' );
const vm = new NodeVM( {
  console: 'inherit',
  // pass our declared ext variable to the sandbox
  sandbox: { ext },
  require: {
    external: true,
    builtin: ['fs', 'path'],
    root: './',
  },
} );


function convertToJs(laserCode) {
  javaCode = laserCode.replace(/'/g , "_prime");
  javaCode = javaCode.replace(/asin\(/g, "Math.abin(")
  javaCode = javaCode.replace(/sin\(/g, "Math.sin(")
  javaCode = javaCode.replace(/Math.abin\(/g, "Math.asin(")
  javaCode = javaCode.replace(/acos\(/g, "Math.abos(")
  javaCode = javaCode.replace(/cos\(/g, "Math.cos(")
  javaCode = javaCode.replace(/Math.abos\(/g, "Math.acos(")
  javaCode = javaCode.replace(/atan\(/g, "Math.aban(")
  javaCode = javaCode.replace(/tan\(/g, "Math.tan(")
  javaCode = javaCode.replace(/Math.aban\(/g, "Math.atan(")
  javaCode = javaCode.replace(/sqrt\(/g,"Math.sqrt(");
  javaCode = javaCode.replace(/max\(/g,"Math.max(");
  javaCode = javaCode.replace(/min\(/g,"Math.min(");
  javaCode = javaCode.replace(/floor\(/g,"Math.floor(");
  javaCode = javaCode.replace(/ceil\(/g,"Math.ceil(");
  javaCode = javaCode.replace(/round\(/g,"Math.round(");
  javaCode = javaCode.replace(/abs\(/g,"Math.abs(");
  javaCode = javaCode.replace(/rand\(/g,"Math.random(");
  javaCode = javaCode.replace(/if\(/g,"towerIf(");
  javaCode = javaCode.replace(/#/g,"//")

  javaCode = javaCode.replace(/[0-9]Math/, function (subStr) {
    splitString = subStr.split("M")
    return splitString[0] + " * Math"
  })

  javaCode = javaCode.replace(/[0-9]towerIf/, function (subStr) {
    splitString = subStr.split("t")
    return splitString[0] + " * towerIf"
  })

  javaCode = javaCode.replace(/[0-9]lerp/, function (subStr) {
    splitString = subStr.split("l")
    return splitString[0] + " * lerp"
  })

  return javaCode
}

function createSandboxFunction(jsFunction) {
  projectionStartTime = Date.now() / 1000;
  return `let x = %X%
let y = %Y%
let index = %INDEX%
let count = 400
let fraction = index/count
let pi = Math.PI
let tau = Math.PI * 2
let time = Date.now() / 1000
let projectionTime = %PROJECTIONTIME%
let projectionStartTime = ` + (Date.now() / 1000).toString() + `

function towerIf(condition, a1, a2) {
  return condition ? a1 : a2
}
function lerp(frac,a,b){
  return (a*frac + b*(1-frac))
}
  
function render() {
  ` + jsFunction + `

  return [x_prime, y_prime, h, s, v]
}
  
ext.exports = render()`
}

function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

function drawDot(x, y, color) {
  if(color == "#000000") {
    return
  }
  let ctx = canvasContext
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function drawFrame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  currentProjectionTime = (Date.now() / 1000) - projectionStartTime;
  for(i = 0; i < 400; i++) {
    drawIndex(i, currentProjectionTime);
  }
}

function drawIndex(index,projectionTime) {
  vm.run(projectionCode.replace("%INDEX%", index).replace("%X%", 1).replace("%Y%", 1).replace("%PROJECTIONTIME%", projectionTime))
  drawDot(4 * (Object.values(ext.exports)[0]) + 400, -4 * (Object.values(ext.exports)[1]) + 400, HSLToHex(Object.values(ext.exports)[2] * 360, Object.values(ext.exports)[3] * 100, Object.values(ext.exports)[4] * 100))
}

function setupRender() {
  //TODO: Hookup VM2
  //TODO: Don't render when we're not showing
  //TODO: Render frame
  canvas = document.getElementById('render-canvas');
  canvasContext = canvas.getContext('2d');
}

function startDrawing() {
  projectionCode = createSandboxFunction(convertToJs(fullExport().replace(/<br>/g, "\n")))
  interval = setInterval(function() { drawFrame() }, 33)
}

function stopDrawing() {
  clearInterval(interval);
}