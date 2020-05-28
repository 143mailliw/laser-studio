const startingEffectsObject = {
  name: "Untitled Effect",
  parameters: [],
  text: `# This is an Effect.
# Effects get inserted after Text and Graphical code.
# Effects can be exported to files and allow for you to set custom parameters.
# They can also be used to help break up your code into segments.`,
  id: ""
};

const startingEffectsParameterObject = {
  name: "New Parameter",
  value: "",
  type: 0, //text 0 slider 1 checkbox 2
  variableName: "NewParam",
  processingRules: {}
};

let effectButtons = [];

function addEffect(effect) {
  let id = uuidv4();
  effect.id = id;
  fileObject.effects.effectsArray[id] = effect;
  console.log(fileObject.effects.effectsArray);
  addEffectToSidebar(effect);
}

function regenerateParameterTable() {
  document.getElementById("text-sidebar-effect-parameters").innerHTML = "";
  for(let i = 0; i < fileObject.effects.effectsArray[currentEditorDocument].parameters.length; i++) {
    addParameterToEffectsTable(i);
  }
}

function addParameterToEffectsTable(parameterNumber) {
  let parameter = fileObject.effects.effectsArray[currentEditorDocument].parameters[parameterNumber];
  let sectionElement = document.createElement("div");
  addHeaderToEffectsTable(parameterNumber, sectionElement);
  addNameRowToEffectsTable(parameter, sectionElement);
  addVariableRowToEffectsTable(parameter, sectionElement);
  addValueRowToEffectsTable(parameter, sectionElement);
  let dividerElement = document.createElement("div");
  dividerElement.className = "text-sidebar-properties-divider";
  sectionElement.appendChild(dividerElement);
  document.getElementById("text-sidebar-effect-parameters").appendChild(sectionElement);
}

function addHeaderToEffectsTable(parameterNumber, parent) {
  let headerElement = document.createElement("div");
  headerElement.className = "text-sidebar-header";
  headerElement.innerText = "parameter " + parameterNumber;
  parent.appendChild(headerElement);
}

function addNameRowToEffectsTable(parameter, parent) {
  let rowElement = document.createElement("div");
  rowElement.className = "text-sidebar-properties-row";
  let nameElement = document.createElement("div");
  nameElement.className = "text-sidebar-properties-header";
  nameElement.innerText = "Name";
  rowElement.appendChild(nameElement);
  let contentContainerElement = document.createElement("div");
  contentContainerElement.className = "text-sidebar-properties-option";
  rowElement.appendChild(contentContainerElement);
  let contentElement = document.createElement("input");
  contentElement.className = "text-sidebar-properties-text";
  contentElement.type = "text";
  contentElement.value = parameter.name;
  contentElement.addEventListener("input", (e) => {
    parameter.name = e.target.value;
  });
  contentContainerElement.appendChild(contentElement);
  parent.appendChild(rowElement);
}

function addVariableRowToEffectsTable(parameter, parent) {
  let rowElement = document.createElement("div");
  rowElement.className = "text-sidebar-properties-row";
  let nameElement = document.createElement("div");
  nameElement.className = "text-sidebar-properties-header";
  nameElement.innerText = "VariableName";
  rowElement.appendChild(nameElement);
  let contentContainerElement = document.createElement("div");
  contentContainerElement.className = "text-sidebar-properties-option";
  rowElement.appendChild(contentContainerElement);
  let contentElement = document.createElement("input");
  contentElement.className = "text-sidebar-properties-text";
  contentElement.type = "text";
  contentElement.value = parameter.variableName;
  contentElement.addEventListener("input", (e) => {
    parameter.variableName = e.target.value;
  });
  contentContainerElement.appendChild(contentElement);
  parent.appendChild(rowElement);
}

function addValueRowToEffectsTable(parameter, parent) {
  let rowElement = document.createElement("div");
  rowElement.className = "text-sidebar-properties-row";
  let nameElement = document.createElement("div");
  nameElement.className = "text-sidebar-properties-header";
  nameElement.innerText = "Value";
  rowElement.appendChild(nameElement);
  let contentContainerElement = document.createElement("div");
  contentContainerElement.className = "text-sidebar-properties-option";
  rowElement.appendChild(contentContainerElement);
  let contentElement = document.createElement("input");
  contentElement.className = "text-sidebar-properties-text";
  contentElement.type = "text";
  contentElement.value = parameter.value;
  contentElement.addEventListener("input", (e) => {
    parameter.value = e.target.value;
  });
  contentContainerElement.appendChild(contentElement);
  parent.appendChild(rowElement);
}

function addParameter() {
  let effect = fileObject.effects.effectsArray[currentEditorDocument];
  effect.parameters.push(JSON.parse(JSON.stringify(startingEffectsParameterObject)));
  addParameterToEffectsTable(effect.parameters.length - 1);
  document.getElementById("properties-effect-pcount").innerText = effect.parameters.length;
}

function setupEffectsProperties(effect) {
  document.getElementById("properties-effect-name").value = effect.name;
  document.getElementById("properties-effect-pcount").innerText = effect.parameters.length;
  regenerateParameterTable();
}

function regenerateEffectsMenu() {
  document.getElementById("text-sidebar-effects").innerHTML = "";
  for(let i = 0; i < Object.values(fileObject.effects.effectsArray).length; i++) {
    addEffectToSidebar(Object.values(fileObject.effects.effectsArray)[i]);
  }
}

function addEffectToSidebar(effect) {
  let newElement = document.createElement("div");
  newElement.className = "text-sidebar-item";
  newElement.innerText = effect.name;
  newElement.addEventListener("click", () => {
    changeTextActiveItem(newElement);
    changeDocument(1, effect.id);
  });
  document.getElementById("text-sidebar-effects").appendChild(newElement);
  effectButtons[effect.id] = newElement;
}

function saveEffect() {
  let saveString = JSON.stringify(fileObject.effects.effectsArray[currentEditorDocument]);
  dialog.showSaveDialog({
    filters : [{
      name: "Laser Studio Effect",
      extensions: ["lsfx"]
    }],
    properties: ["showOverwriteConfirmation"]
  }).then(result => {
    filePath = result.filePath;
    if (!filePath.endsWith(".lsfx")) {
      filePath = filePath + ".lsfx";
    }
    if(!result.canceled) {
      fs.writeFileSync(filePath, saveString);
      currentPath = filePath;
    }
  })
}

function loadEffect() {
  dialog.showOpenDialog({
    filters : [{
      name: "Laser Studio Effect",
      extensions: ["lsfx"]
    }],
    properties: ["openFile"]
  }).then(result => {
    if(!result.canceled) {
      console.log(result);
      let filePath = result.filePaths[0];
      let textResult = fs.readFileSync(filePath);
      addEffect(JSON.parse(textResult));
    }
  })
}

function setupEffects() {
  document.getElementById("text-effects-add-new").addEventListener("click", () => {addEffect(JSON.parse(JSON.stringify(startingEffectsObject)))});
  document.getElementById("properties-effect-name").addEventListener("input", (e) => {
    fileObject.effects.effectsArray[currentEditorDocument].name = e.target.value;
    effectButtons[currentEditorDocument].innerText = e.target.value;
  });
  document.getElementById("properties-effect-add-param").addEventListener("click", addParameter)
  document.getElementById("text-effects-add-file").addEventListener("click", loadEffect)
  document.getElementById("effects-save-effect").addEventListener("click", saveEffect)
}