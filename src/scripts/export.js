//https://gist.github.com/mjackson/5311256
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

function createGraphicsExpression() {
  let outputx = "";
  let outputy = "";
  let wide = fileObject.graphical.width;
  let tall = fileObject.graphical.height;
  let activeCount = 0;

  for(let i=0; i<(fileObject.graphical.width * fileObject.graphical.height); i++) {
    if(fileObject.graphical.indexObject["dot-" + i]) {
      if (activeCount > 398) {
        return "# Error: Your image must contain less than 400 active lasers. Please reduce the laser count."
      }
      outputx = outputx + "if(index == "+activeCount.toString()+","+(((i%wide)+0.5)-(parseInt(tall)/2)).toString()+","
      outputy = outputy + "if(index == "+activeCount.toString()+","+((Math.floor(i/wide)+0.5)-(parseInt(wide)/2)).toString()+","
      activeCount++
    }
  }

  outputx = outputx + "0"
  outputy = outputy + "0"

  for(let i=0;i<activeCount;i++) {
    outputx = outputx + ")"
    outputy = outputy + ")"
  }

  return "x' = (" + outputx + ");<br><br>y' = (-" + outputy + ");<br><br>h = 0;<br>s = 1;<br>v = if(index < " + (activeCount + 1) + ",1,0);"
}

function createEffectsExpression() {
  let baseString = ""

  if(spin) {
    baseString = baseString + "<br>xf = x'<br>yf = y'<br><br>xr = projectionTime;<br>yr = projectionTime;<br>zr = projectionTime;<br><br>xz = xf*cos(zr)-yf*sin(zr);<br>yz = xf*sin(zr)+yf*cos(zr);<br><br>x' = xz*cos(yr)+sin(yr)*yz*sin(xr);<br>y' = yz*cos(xr);<br>"
  }

  if(bounce) {
    baseString = baseString + "<br>y' = y' - 10 + abs(15cos(projectionTime*3))"
  }

  if(expand) {
    baseString = baseString + "<br>y' = y' * abs(cos(projectionTime))*2)<br>x' = x' * abs(cos(projectionTime))*2)"
  }

  return baseString
}

function exportSetup() {
  document.getElementById("export").addEventListener("click", () => {
    let baseString = ""
    if(Object.values(fileObject.graphical.indexObject).includes(true)) {
      console.log("a");
      baseString = baseString + createGraphicsExpression() + "<br>"
    }
    baseString = baseString + fileObject.editor.text.replace(/[\n\r]/g, '<br>');
    baseString = baseString + createEffectsExpression();
    document.getElementById("output").innerHTML = baseString;
    document.getElementById("export-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  })
  document.getElementById("output-copy").addEventListener("click", (e) => {
    window.copyToClipboard(document.getElementById("output").innerText);
  })
}