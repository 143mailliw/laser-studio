let projectionCode = ""
let interval = setInterval(function() {}, 100000)
let canvas = null
let canvasContext = null
let ext = {};
let projectionStartTime = null;
let projectionRenderScale = 2;

function reverseError(errorText) {
  let laserError = errorText.replace(/_prime/g , "'");
  laserError = laserError.replace(/Math.sin\(/g, "sin(")
  laserError = laserError.replace(/Math.asin\(/g, "asin(")
  laserError = laserError.replace(/Math.cos\(/g, "cos(")
  laserError = laserError.replace(/Math.acos\(/g, "acos(")
  laserError = laserError.replace(/Math.tan\(/g, "tan(")
  laserError = laserError.replace(/Math.aban\(/g, "atan(")
  laserError = laserError.replace(/Math.sqrt\(/g,"sqrt(");
  laserError = laserError.replace(/Math.max\(/g,"max(");
  laserError = laserError.replace(/Math.min\(/g,"min(");
  laserError = laserError.replace(/Math.floor\(/g,"floor(");
  laserError = laserError.replace(/Math.ceil\(/g,"ceil(");
  laserError = laserError.replace(/Math.round\(/g,"round(");
  laserError = laserError.replace(/Math.abs\(/g,"abs(");
  laserError = laserError.replace(/Math.random\(/g,"rand(");
  laserError = laserError.replace(/towerIf\(/g,"if(");
  laserError = laserError.replace(/\*\*/g, "^");

  return laserError;
}

function convertToJs(laserCode) {
  let javaCode = laserCode.replace(/'/g , "_prime");
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
  javaCode = javaCode.replace(/#/g,"//");
  javaCode = javaCode.replace(/\^/g, "**");
  javaCode = javaCode.replace(/[0-9](?=[A-Za-z(])/g, function (subStr) {
    return subStr + "*"
  })

  return javaCode
}

function createSandboxFunction(jsFunction) {
  projectionStartTime = Date.now() / 1000;
  return `let index = %INDEX%
let count = 400
let x = ((index % 20) - 10) * 10
let y = Math.floor(index/20 - 9) * 10
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

function calculateHSL(h, s, v){
  // determine the lightness in the range [0,100]
  var l = (2 - s / 100) * v / 2;

  // store the HSL components
  hsl =
    {
      'h' : h,
      's' : s * v / (l < 50 ? l * 2 : 200 - l * 2),
      'l' : l
    };

  // correct a division-by-zero error
  if (isNaN(hsl.s)) hsl.s = 0;

  return (hsl);
}

function drawDot(x, y, h, s, v) {
  if(v != 0) {
    x = x || 0;
    y = y || 0;
    h = h || 0;
    v = v || 0;
    let hsl = calculateHSL(h, s, v)
    let ctx = canvasContext
    ctx.fillStyle = "hsl(" + hsl.h.toString() + "," + hsl.s.toString() + "%," + hsl.l.toString() + "%)";
    ctx.strokeStyle = "hsl(" + hsl.h.toString() + "," + hsl.s.toString() + "%," + hsl.l.toString() + "%)";
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}

function drawFrame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  currentProjectionTime = (Date.now() / 1000) - projectionStartTime;
  for(i = 0; i < 400; i++) {
    drawIndex(i, currentProjectionTime);
  }
}

function drawIndex(index,projectionTime) {
  eval(projectionCode.replace("%INDEX%", index).replace("%PROJECTIONTIME%", projectionTime))
  drawDot(projectionRenderScale * (Object.values(ext.exports)[0]) + (canvas.width / 2), -1 * projectionRenderScale * (Object.values(ext.exports)[1]) + (canvas.height / 2), Math.abs(Math.round(Object.values(ext.exports)[2] % 360)), Math.round(Object.values(ext.exports)[3] * 100), Math.round(Object.values(ext.exports)[4] * 100))
}

function setupRender() {
  canvas = document.getElementById('render-canvas');
  canvasContext = canvas.getContext('2d');

  document.getElementById("render-controls-plus").addEventListener("click", () => {
    projectionRenderScale = projectionRenderScale < 10 ? (projectionRenderScale + 0.25) : projectionRenderScale;
    document.getElementById("render-controls-zoom").innerText = projectionRenderScale.toString() + "x"
  })

  document.getElementById("render-controls-minus").addEventListener("click", () => {
    projectionRenderScale = projectionRenderScale > 0.25 ? (projectionRenderScale - 0.25) : projectionRenderScale;
    document.getElementById("render-controls-zoom").innerText = projectionRenderScale.toString() + "x"
  })

  window.addEventListener("resize", (e) => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  })
}

function startDrawing() {
  projectionCode = createSandboxFunction(convertToJs(fullExport().replace(/<br>/g, "\n")))
  interval = setInterval(function() { drawFrame() }, 33)
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function stopDrawing() {
  clearInterval(interval);
  document.getElementById("render-error").style.display = "none"

  delete y_prime
  delete x_prime
  delete h
  delete s
  delete v
}

window.addEventListener('error', (errorEvent) => {
  err = errorEvent.error
  if(errorEvent.error.stack.toString().includes("drawIndex")) {
    const { lineno } = errorEvent;
    document.getElementById("render-error").style.display = "block"
    document.getElementById("render-error").innerText = "Error: " + reverseError(err.message) + " (ln " + (Number(lineno) - 19) + ")"
    clearInterval(interval);
  } else {
    console.log(err)
  }
  // Don't pollute the console with additional info:
  errorEvent.preventDefault();
});