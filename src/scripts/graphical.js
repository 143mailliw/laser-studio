let spin = false;
let bounce = false;
let expand = false;
let resizeConfirm = false;
let clearConfirm = false;
let pickr = null;

function renderGraphicalDocument() {
  let display = document.getElementById("graphical-display");

  //make sure there are no children
  var child = display.lastElementChild;
  while (child) {
    display.removeChild(child);
    child = display.lastElementChild;
  }

  for (i = 0; i < fileObject.graphical.height; i++) {
    let rowElement = document.createElement("div");
    rowElement.className = "graphical-row";
    rowElement.id = "row-" + i;
    display.appendChild(rowElement);
    for (e = 0; e < fileObject.graphical.width; e++) {
      let dotElement = document.createElement("div");
      dotElement.id = "dot-" + (e + (fileObject.graphical.width * i));
      dotElement.className = "graphical-dot " + (fileObject.graphical.indexObject[dotElement.id] ? "graphical-on" : "graphical-off");
      dotElement.style.backgroundColor = fileObject.graphical.indexObject[dotElement.id] ? fileObject.graphical.colorObject[dotElement.id].hex : "#000000"
      dotElement.addEventListener("click", (e) => {
        if (e.target.className.includes("graphical-on")) {
          fileObject.graphical.indexObject[e.target.id] = false
          delete fileObject.graphical.colorObject[e.target.id]
          e.target.style.backgroundColor = "#000000"
          e.target.className = "graphical-dot graphical-off"
        } else {
          fileObject.graphical.indexObject[e.target.id] = true
          let color = pickr.getColor();
          fileObject.graphical.colorObject[e.target.id] = {hex: color.toHEXA().toString(), hsv: color.toHSVA()}
          console.log(fileObject.graphical.colorObject[e.target.id]);
          e.target.style.backgroundColor = fileObject.graphical.colorObject[e.target.id].hex
          if(e.target.style.backgroundColor == "#000000") {
            fileObject.graphical.indexObject[e.target.id] = false
            delete fileObject.graphical.colorObject[e.target.id]
          }
          e.target.className = "graphical-dot graphical-on"
        }
      })
      rowElement.appendChild(dotElement);
    }
  }
}

function graphicalSetup() {
  renderGraphicalDocument();

  pickr = Pickr.create({
    el: '.color-picker',
    theme: 'nano', // or 'monolith', or 'nano'
    inline: true,
    showAlways: true,
    lockOpacity: true,
    default: '#FFFFFF',

    swatches: [
      'rgb(244, 67, 54)',
      'rgb(233, 30, 99)',
      'rgb(156, 39, 176)',
      'rgb(103, 58, 183)',
      'rgb(63, 81, 181)',
      'rgb(33, 150, 243)',
      'rgb(3, 169, 244)',
      'rgb(0, 188, 212)',
      'rgb(0, 150, 136)',
      'rgb(76, 175, 80)',
      'rgb(139, 195, 74)',
      'rgb(205, 220, 57)',
      'rgb(255, 235, 59)',
      'rgb(255, 193, 7)'
    ],

    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
          hex: true,
          hsva: true,
          input: true,
      }
    }
  });

  document.getElementById("graphical-resize").addEventListener("click", (e) => {
    if(resizeConfirm) {
      fileObject.graphical.width = Number(document.getElementById("graphical-wsize").value);
      fileObject.graphical.height = Number(document.getElementById("graphical-hsize").value);
      fileObject.graphical.indexObject = {};
      fileObject.graphical.colorObject = {};
      renderGraphicalDocument();
      resizeConfirm = false;
      document.getElementById("resize-dialog").style.display = "none";
      document.getElementById("dialog-close").style.display = "none";
      document.getElementById("graphical-resize").innerText="Resize"
    } else {
      resizeConfirm = true;
      document.getElementById("graphical-resize").innerText="Are you sure?"
      setTimeout(() => {
        resizeConfirm = false;
        document.getElementById("graphical-resize").innerText="Resize"
      }, 2500)
    }
  })
  document.getElementById("menu-resize").addEventListener("click", (e) => {
    document.getElementById("resize-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  })
}
