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
    value: null,
    type: "text",
    variableName: "newparam"
};

let effectButtons = [];

function addEffect(effect) {
    let id = uuidv4();
    effect.id = id;
    fileObject.effects.effectsArray[id] = effect;
    console.log(fileObject.effects.effectsArray);
    addEffectToSidebar(effect);
}

function addEffectToSidebar(effect) {
    console.log("adding new effect to sidebar");
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

function setupEffects() {
    document.getElementById("text-effects-add-new").addEventListener("click", () => {addEffect(JSON.parse(JSON.stringify(startingEffectsObject)))});
}