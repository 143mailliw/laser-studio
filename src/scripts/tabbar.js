function setupTabbar() {
  document.getElementById("text-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("graphical-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"
    document.getElementById("effects-tab").className = "tabbar-item"
    document.getElementById("functions-tab").className = "tabbar-item"
    document.getElementById("nodes-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "none"

    document.getElementById("nodes").style.display = "none"

    document.getElementById("effects").style.display = "none"

    document.getElementById("text").style.display = "block"
    document.getElementById("menu-edit-text").style.display = "block"

    document.getElementById("render").style.display = "none"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    editor.setValue(fileObject.editor.text)
    editor.layout()
    stopDrawing()

    currentMode = 1;
  })
  document.getElementById("graphical-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"
    document.getElementById("effects-tab").className = "tabbar-item"
    document.getElementById("functions-tab").className = "tabbar-item"
    document.getElementById("nodes-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "none"

    document.getElementById("nodes").style.display = "none"

    document.getElementById("effects").style.display = "none"

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
    document.getElementById("effects-tab").className = "tabbar-item"
    document.getElementById("functions-tab").className = "tabbar-item"
    document.getElementById("nodes-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "none"

    document.getElementById("nodes").style.display = "none"

    document.getElementById("effects").style.display = "none"

    document.getElementById("render").style.display = "block"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    startDrawing()

    currentMode = 2;
  })
  document.getElementById("nodes-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("graphical-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"
    document.getElementById("effects-tab").className = "tabbar-item"
    document.getElementById("functions-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "none"

    document.getElementById("nodes").style.display = "block"

    document.getElementById("effects").style.display = "none"

    document.getElementById("render").style.display = "none"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    stopDrawing()

    currentMode = 3;
  })
  document.getElementById("effects-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("graphical-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"
    document.getElementById("nodes-tab").className = "tabbar-item"
    document.getElementById("functions-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "none"

    document.getElementById("nodes").style.display = "none"

    document.getElementById("effects").style.display = "block"

    document.getElementById("render").style.display = "none"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    stopDrawing()

    currentMode = 4;
  })
  document.getElementById("functions-tab").addEventListener("click", (e) => {
    e.target.className = "tabbar-item tabbar-item-active"
    document.getElementById("text-tab").className = "tabbar-item"
    document.getElementById("graphical-tab").className = "tabbar-item"
    document.getElementById("render-tab").className = "tabbar-item"
    document.getElementById("effects-tab").className = "tabbar-item"
    document.getElementById("nodes-tab").className = "tabbar-item"

    document.getElementById("functions").style.display = "block"

    document.getElementById("nodes").style.display = "none"

    document.getElementById("effects").style.display = "none"

    document.getElementById("render").style.display = "none"

    document.getElementById("menu-edit-graphical").style.display = "none"
    document.getElementById("graphical").style.display = "none"

    document.getElementById("text").style.display = "none"
    document.getElementById("menu-edit-text").style.display = "none"

    stopDrawing()

    currentMode = 5;
  })
}