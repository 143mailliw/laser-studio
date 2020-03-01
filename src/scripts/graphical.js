let spin = false;
let bounce = false;
let expand = false;
let resizeConfirm = false;
let clearConfirm = false;

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
      dotElement.addEventListener("click", (e) => {
        if (e.target.className.includes("graphical-on")) {
          fileObject.graphical.indexObject[e.target.id] = false
          e.target.className = "graphical-dot graphical-off"
        } else {
          fileObject.graphical.indexObject[e.target.id] = true
          e.target.className = "graphical-dot graphical-on"
        }
      })
      rowElement.appendChild(dotElement);
    }
  }
}

function graphicalSetup() {
  renderGraphicalDocument();
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
  document.getElementById("graphical-enable-spin").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      spin = false;
    } else {
      e.target.className = "checkbox ticked"
      spin = true;
    }
  })
  document.getElementById("graphical-enable-bounce").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      bounce = false;
    } else {
      e.target.className = "checkbox ticked"
      bounce = true;
    }
  })
  document.getElementById("graphical-enable-expand").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      expand = false;
    } else {
      e.target.className = "checkbox ticked"
      expand = true;
    }
  })
  document.getElementById("menu-resize").addEventListener("click", (e) => {
    document.getElementById("resize-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  })
}
