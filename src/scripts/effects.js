const startingEffectsObject = {
    name: "Untitled Effect",
    parameters: []
};

const startingEffectsParameterObject = {
    name: "New Parameter",
    value: null,
    type: "text",
    variableName: "newparam"
};

function addEffect(effect) {

}

function setupEffects() {
    document.getElementById("text-effects-add-new").addEventListener("click", addEffect(JSON.stringify(startingEffectsObject)));
}