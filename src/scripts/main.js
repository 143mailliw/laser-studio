const { dialog, shell } = require('electron').remote
const remote = require('electron').remote;
const fs = require('fs');

let currentMode = 0; // 0: Graphical, 1: Editor, 2: Render, 999: Intro
let fileObject = {
  projectionName: "Untitled",
  effects: { },
  graphical: {
    lastUpdate: new Date(),
    width: 20,
    height: 20,
    indexObject: {},
    colorObject: {}
  },
  editor: {
    lastUpdate: new Date(),
    text: `# Graphical Editor code will be placed before your Text Editor code upon export.

y' = y'
x' = x'

h = h
s = s
v = v

# Effects code will be placed after your Text Editor code upon export.`
  }
}

function setup() {
  graphicalSetup();
  exportSetup();
  textSetup();
  setupRender();

  //setup toolbar
  document.getElementById("clear").addEventListener("click", () => {
    if(clearConfirm) {
      fileObject.graphical.indexObject = {};
      fileObject.graphical.colorObject = {};
      renderGraphicalDocument()
      clearConfirm = false;
      document.getElementById("clear").innerText="Clear"
    } else {
      clearConfirm = true;
      document.getElementById("clear").innerText="Are you sure?"
      setTimeout(() => {
        clearConfirm = false;
        document.getElementById("clear").innerText="Clear"
      }, 2500)
    }
  })
  document.getElementById("save").addEventListener("click", () => {
    dialog.showSaveDialog({
      filters : [{
        name: "Laser Studio Expression", 
        extensions: ["lse"]
      }],
      properties: ["showOverwriteConfirmation"]
    }).then(result => {
      filePath = result.filePath
      if (!filePath.endsWith(".lse")) {
        filePath = filePath + ".lse"
      }
      if(!result.canceled) {
        fs.writeFileSync(filePath, JSON.stringify(fileObject));
      }
    })
  })
  document.getElementById("open").addEventListener("click", () => {
    dialog.showOpenDialog({
      filters : [{
        name: "Laser Studio Expression", 
        extensions: ["lse"]
      }],
      properties: ["openFile"]
    }).then(result => {
      filePath = result.filePaths[0]
      if (!filePath.endsWith(".lse")) {
        filePath = filePath + ".lse"
      }
      if(!result.canceled) {
        result = fs.readFileSync(filePath)
        fileObject = JSON.parse(result);
        renderGraphicalDocument();
        editor.setValue(fileObject.editor.text)
        if(currentMode == 2) {
          stopDrawing()
          startDrawing()
        }
      }
    })
  })
  document.getElementById("new").addEventListener("click", () => { 
    fileObject = {
      projectionName: "Untitled",
      effects: { },
      graphical: {
        lastUpdate: new Date(),
        width: 20,
        height: 20,
        indexObject: {},
        colorObject: {}
      },
      editor: {
        lastUpdate: new Date(),
        text: `
          # Graphical Editor code will be placed before your Text Editor code upon export.
    
          y' = y'
          x' = x'
    
          h = h
          s = s
          v = v
    
          # Effects code will be placed after your Text Editor code upon export.
        `
      }
    }
    renderGraphicalDocument();
  })
  document.getElementById("text-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("graphical-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"

    document.getElementById("text").style.display = "block"
    document.getElementById("menu-edit-text").style.display = "block"

    document.getElementById("render").style.display = "none"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    editor.layout()
    stopDrawing()

    currentMode = 1;
  })
  document.getElementById("graphical-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"

    document.getElementById("menu-edit-graphical").style.display = "block"
    document.getElementById("graphical").style.display = "block"

    document.getElementById("render").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    stopDrawing()

    currentMode = 0;
  })
  document.getElementById("render-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("graphical-tab").className = "tabbar-item"

    document.getElementById("render").style.display = "block"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    startDrawing()

    currentMode = 2;
  })
  document.getElementById("close").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.close();
  })
  document.getElementById("maximize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
  })
  document.getElementById("minimize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.minimize(); 
  })
  document.getElementById("help-discord").addEventListener("click", (e) => {
    shell.openExternal('https://discord.gg/58txEK9')
  })
  document.getElementById("help-about").addEventListener("click", (e) => {
    document.getElementById("about-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  })
  document.getElementById("dialog-close").addEventListener("click", (e) => {
    document.getElementById("about-dialog").style.display = "none";
    document.getElementById("resize-dialog").style.display = "none";
    document.getElementById("export-dialog").style.display = "none";
    document.getElementById("dialog-close").style.display = "none";
  })
}