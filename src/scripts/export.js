let exportGraphics = true
let exportEffects = true
let exportSnippets = true

function createGraphicsExpression() {
  let outputx = "";
  let outputy = "";
  let outputh = "";
  let outputs = "";
  let outputv = "";
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
      outputh = outputh + "if(index == "+activeCount.toString()+","+Math.round(fileObject.graphical.colorObject["dot-" + i].hsv[0])+","
      outputs = outputs + "if(index == "+activeCount.toString()+","+(Math.round(fileObject.graphical.colorObject["dot-" + i].hsv[1]) / 100)+","
      outputv = outputv + "if(index == "+activeCount.toString()+","+(Math.round(fileObject.graphical.colorObject["dot-" + i].hsv[2]) / 100)+","
      activeCount++
    }
  }

  outputx = outputx + "0"
  outputy = outputy + "0"
  outputh = outputh + "0"
  outputs = outputs + "0"
  outputv = outputv + "0"

  for(let i=0;i<activeCount;i++) {
    outputx = outputx + ")"
    outputy = outputy + ")"
    outputh = outputh + ")"
    outputs = outputs + ")"
    outputv = outputv + ")"
  }

  return "x' = (" + outputx + ");<br><br>y' = (-" + outputy + ");<br><br>h = " + outputh + ";<br>s = " + outputs + ";<br>v = " + outputv +";"
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function createEffectsExpression() {
  let baseString = ``

  for(let i = 0; i < Object.values(fileObject.effects.effectsArray).length; i++) {
    let workingEffect = Object.values(fileObject.effects.effectsArray)[i]
    let workingText = workingEffect.text

    for(let p = 0; p < workingEffect.parameters.length; p++) {
      console.log(escapeRegExp(workingEffect.parameters[p].variableName))
      workingText = workingText.replace(new RegExp(escapeRegExp("%" + workingEffect.parameters[p].variableName + "%"), 'g'), workingEffect.parameters[p].value);
    }

    baseString = baseString + `\n` + workingText
  }

  /*if(spin) {
    baseString = baseString + "<br>xf = x'<br>yf = y'<br><br>xr = projectionTime;<br>yr = projectionTime;<br>zr = projectionTime;<br><br>xz = xf*cos(zr)-yf*sin(zr);<br>yz = xf*sin(zr)+yf*cos(zr);<br><br>x' = xz*cos(yr)+sin(yr)*yz*sin(xr);<br>y' = yz*cos(xr);<br>"
  }

  if(bounce) {
    baseString = baseString + "<br>y' = y' - 10 + abs(15cos(projectionTime*3))"
  }

  if(expand) {
    baseString = baseString + "<br>y' = y' * abs(cos(projectionTime))*2<br>x' = x' * abs(cos(projectionTime))*2"
  }*/

  return baseString
}

function fullExport() {
  let baseString = ""
  if(Object.values(fileObject.graphical.indexObject).includes(true) && exportGraphics) {
    baseString = baseString + createGraphicsExpression() + "<br>"
  }
  baseString = baseString + fileObject.editor.text.replace(/[\n\r]/g, '<br>');
  if(exportEffects) {
    baseString = baseString + createEffectsExpression().replace(/[\n\r]/g, '<br>');
  }
  return baseString
}

function exportSetup() {
  document.getElementById("export").addEventListener("click", () => {
    document.getElementById("output").innerHTML = fullExport();
    document.getElementById("export-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  })
  document.getElementById("output-copy").addEventListener("click", (e) => {
    window.copyToClipboard(document.getElementById("output").innerText);
  })
  document.getElementById("properties-disable-effects").addEventListener("click", (e) => {
    if(exportEffects) {
      e.target.className = "checkbox on";
      exportEffects = false
    } else {
      e.target.className = "checkbox off";
      exportEffects = true
    }
  })
  document.getElementById("properties-disable-graphics").addEventListener("click", (e) => {
    if(exportGraphics) {
      e.target.className = "checkbox on";
      exportGraphics = false
    } else {
      e.target.className = "checkbox off";
      exportGraphics = true
    }
  })
}