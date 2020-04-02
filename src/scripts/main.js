const { dialog, shell } = require('electron').remote;
const remote = require('electron').remote;
const fs = require('fs');

let currentPath = null;
let currentMode = 999; // 0: Graphical, 1: Editor, 2: Render, 999: Intro
let startingFileObject = {
  effects: { effectsArray: [] },
  snippets: { snippetsArray: [] },
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
};

let fileObject = JSON.parse(JSON.stringify(startingFileObject));

function dismissIntro() {
  if(currentMode === 999) {
    document.getElementById("save").style.display = "block";
    document.getElementById("save-as").style.display = "block";
    document.getElementById("export").style.display = "block";
    document.getElementById("edit-menu").style.display = "inline-block";
    document.getElementById("tabbar").style.display = "block";
    document.getElementById("graphical").style.display = "block";
    document.getElementById("intro").style.display = "none";
    currentMode = 0
  }
}

function newDocument() {
  fileObject = JSON.parse(JSON.stringify(startingFileObject));
  fileObject.graphical.lastUpdate = new Date();
  fileObject.editor.lastUpdate = new Date();
  dismissIntro();
  editor.setValue(fileObject.editor.text);
  renderGraphicalDocument();
  document.getElementById("text-sidebar-expitem").innerText = "Untitled";
  document.getElementById("text-sidebar-expitem").className = "text-sidebar-item text-sidebar-item-active";
}

function upgradeFileObject() {
  //upgrade LSE files v1.0 up to 2.0
  if(!fileObject.effects.effectsArray) {
    fileObject.effects.effectsArray = [];
  }
  if(!fileObject.snippets) {
    fileObject.snippets = { snippetsArray: [] };
  }
}

function openDocument() {
  dialog.showOpenDialog({
    filters : [{
      name: "Laser Studio Expression", 
      extensions: ["lse"]
    }],
    properties: ["openFile"]
  }).then(result => {
    if(!result.canceled) {
      console.log(result);
      let filePath = result.filePaths[0];
      result = fs.readFileSync(filePath);
      let fileObject = JSON.parse(result);
      upgradeFileObject();
      dismissIntro();
      renderGraphicalDocument();
      editor.setValue(fileObject.editor.text);
      if(currentMode === 2) {
        stopDrawing();
        startDrawing();
      }
      currentPath = filePath;
      let fileName = filePath.split("/");
      let fileNameWindows = fileName[fileName.length - 1].split("\\");
      document.getElementById("text-sidebar-expitem").innerText = fileNameWindows[fileNameWindows.length - 1].slice(0, -4);
      document.getElementById("text-sidebar-expitem").className = "text-sidebar-item text-sidebar-item-active";
    }
  })
}

function saveDocument() {
  if(!currentPath) {
    saveDocumentAs()
  } else {
    fs.writeFileSync(filePath, JSON.stringify(fileObject));
  }
}

function saveDocumentAs() {
  dialog.showSaveDialog({
    filters : [{
      name: "Laser Studio Expression", 
      extensions: ["lse"]
    }],
    properties: ["showOverwriteConfirmation"]
  }).then(result => {
    filePath = result.filePath;
    if (!filePath.endsWith(".lse")) {
      filePath = filePath + ".lse";
    }
    if(!result.canceled) {
      fs.writeFileSync(filePath, JSON.stringify(fileObject));
      currentPath = filePath;
    }
  })
}

// we call this onLoad
// noinspection JSUnusedLocalSymbols
function setup() {
  graphicalSetup();
  exportSetup();
  textSetup();
  setupRender();
  setupIntro();
  setupSnippets();
  setupEffects();

  //setup toolbar
  document.getElementById("clear").addEventListener("click", () => {
    if(clearConfirm) {
      fileObject.graphical.indexObject = {};
      fileObject.graphical.colorObject = {};
      renderGraphicalDocument();
      clearConfirm = false;
      document.getElementById("clear").innerText="Clear"
    } else {
      clearConfirm = true;
      document.getElementById("clear").innerText="Are you sure?";
      setTimeout(() => {
        clearConfirm = false;
        document.getElementById("clear").innerText="Clear"
      }, 2500)
    }
  });
  document.getElementById("save").addEventListener("click", () => {
    saveDocument();
  });
  document.getElementById("open").addEventListener("click", openDocument);
  document.getElementById("new").addEventListener("click", newDocument);
  document.getElementById("text-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active";
    document.getElementById("graphical-tab").className = "tabbar-item";
    document.getElementById("render-tab").className = "tabbar-item";

    document.getElementById("text").style.display = "flex";
    document.getElementById("menu-edit-text").style.display = "block";

    document.getElementById("render").style.display = "none";

    document.getElementById("menu-edit-graphical").style.display = "none";
    document.getElementById("graphical").style.display = "none";

    editor.setValue(fileObject.editor.text);
    editor.layout();
    stopDrawing();

    currentMode = 1;
  });
  document.getElementById("graphical-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active";
    document.getElementById("text-tab").className = "tabbar-item";
    document.getElementById("render-tab").className = "tabbar-item";

    document.getElementById("menu-edit-graphical").style.display = "block";
    document.getElementById("graphical").style.display = "block";

    document.getElementById("render").style.display = "none";

    document.getElementById("text").style.display = "none";
    document.getElementById("menu-edit-text").style.display = "none";

    stopDrawing();

    currentMode = 0;
  });
  document.getElementById("render-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active";
    document.getElementById("text-tab").className = "tabbar-item";
    document.getElementById("graphical-tab").className = "tabbar-item";

    document.getElementById("render").style.display = "block";

    document.getElementById("menu-edit-graphical").style.display = "none";
    document.getElementById("graphical").style.display = "none";

    document.getElementById("text").style.display = "none";
    document.getElementById("menu-edit-text").style.display = "none";

    startDrawing();

    currentMode = 2;
  });
  document.getElementById("close").addEventListener("click", () => {
    let window = remote.getCurrentWindow();
    window.close();
  });
  document.getElementById("maximize").addEventListener("click", () => {
    let window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
  });
  document.getElementById("minimize").addEventListener("click", () => {
    let window = remote.getCurrentWindow();
    window.minimize(); 
  });
  document.getElementById("help-discord").addEventListener("click", () => {
    shell.openExternal('https://discord.gg/58txEK9')
  });
  document.getElementById("help-about").addEventListener("click", () => {
    document.getElementById("about-dialog").style.display = "block";
    document.getElementById("dialog-close").style.display = "block";
  });
  document.getElementById("dialog-close").addEventListener("click", () => {
    document.getElementById("about-dialog").style.display = "none";
    document.getElementById("resize-dialog").style.display = "none";
    document.getElementById("export-dialog").style.display = "none";
    document.getElementById("dialog-close").style.display = "none";
  });
  window.addEventListener('keydown', (e) => {
    if(e.keyCode === 83 && e.ctrlKey && currentMode !== 999) {
      saveDocument();
    }
  });
  document.getElementById("save-as").addEventListener("click", saveDocumentAs)
}