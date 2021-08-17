/*
================================================================================================ 
Dictionaries
*/

const featuresGreek = {
    "A": "alveolar", "L": "labial", "K": "velar", "J": "palatal",
    "P": "plosive", "Z": "affricate", "R": "approximant", "N": "nasal", "F": "fricative", ">": "voiced",
    "#": "aspirated", "<": "voiceless", "%": "not aspirated", "C": "consonant", "V": "vowel"
};

const featuresVedic = {
    "A": "alveolar", "L": "labial", "K": "velar", "J": "palatal",
    "P": "plosive", "R": "approximant", "W": "sonorant", "N": "nasal", "F": "fricative", "H": "laryngeal", "X": "retroflex", ">": "voiced",
    "#": "aspirated", "<": "voiceless", "%": "not aspirated", "C": "consonant", "V": "vowel"
};

const featuresLatin = {
    "A": "alveolar", "L": "labial", "K": "velar", "J": "palatal",
    "P": "plosive", "Z": "affricate", "R": "approximant", "N": "nasal", "F": "fricative", "H": "laryngeal", ">": "voiced",
    "#": "aspirated", "<": "voiceless", "%": "not aspirated", "C": "consonant", "V": "vowel"
};

const featuresArmenian = {
    "A": "alveolar", "L": "labial", "K": "velar", "J": "palatal", "O": "postalveolar", "X": "lateral", "Q": "trill", "R": "flap",
    "W": "glide", "P": "plosive", "Z": "affricate", "N": "nasal", "F": "fricative", "H": "laryngeal", ">": "voiced",
    "#": "aspirated", "<": "voiceless", "%": "not aspirated", "C": "consonant", "V": "vowel"
}

const wildcards = {"*": "0 or more characters", "|": "marks end of lemma"};


languages = ["greek", "vedic", "latin", "armenian"];

/*
================================================================================================ 
INITIAL CALLS
*/

newKey();
generateKeyboard(language = "1");


/*
================================================================================================ 
EVENT-LISTENERS
*/

document.getElementById("user-input").addEventListener("keypress", key => {
    var existing = document.getElementById("add-input-field");
    if (existing != null) {
        document.getElementById("add-input-field").setAttribute("class", "text-field");
    }
    wrongInputHandling(key, key.key, "user-input");
});

var chooseDropdown = document.getElementById("choose-language-id");
// render key by change
chooseDropdown.addEventListener("change", () => {
    console.log("change key")
    const oldContainer = document.getElementById("generate-body");
    if (oldContainer) {
        console.log("key container exists")
        oldContainer.remove();
    };
    newKey();
});

// generate keyboard by change
chooseDropdown.addEventListener("change", () => {
    var language = document.getElementById("choose-language-id").value;
    const oldContainer = document.getElementById("keyboard-container");
    if (oldContainer) {
        console.log("keyboard container exists")
        oldContainer.remove();
    };

    generateKeyboard(language);
});

// removes value of input fields by change of language
chooseDropdown.addEventListener("change", () => {
    const userInput = document.getElementById("user-input");
    const addInput = document.getElementById("add-input-field");
    userInput.value = "";
    addInput.value = "";
});


//event listener for add phoneme button
//adds secondary input field remove button and add button and their event listeners
document.getElementById("plus-button").addEventListener("click", () => {
    var addContainer = document.createElement("div");
    var addInput = document.createElement("input");
    var addBtn = document.createElement("button");
    var delBtn = document.createElement("button");

    addContainer.setAttribute("id", "add-phoneme-container");
    addContainer.setAttribute("class", "form-part-container");
    addInput.setAttribute("class", "text-field");
    addInput.setAttribute("id", "add-input-field");
    addInput.setAttribute("placeholder", "search pattern");
    addBtn.setAttribute("type", "button");
    addBtn.setAttribute("id", "add-button");
    addBtn.textContent = "add";
    delBtn.setAttribute("type", "button");
    delBtn.setAttribute("id", "minus-button");
    delBtn.setAttribute("class", "plus-minus-button");
    delBtn.textContent = "-";

    addContainer.append(delBtn, addInput, addBtn);
    document.getElementById("search-form").append(addContainer);


    document.getElementById("add-input-field").addEventListener ("keypress", key => {
        wrongInputHandling(key=key, pressed=key.key, fieldId="add-input-field");
    });

    document.getElementById("add-button").addEventListener("click", () => {
       addToSearch(inputContent=document.getElementById("add-input-field").value);
    });

    document.getElementById("minus-button").addEventListener("click", () =>{
        document.getElementById("add-phoneme-container").remove();
        document.getElementById("plus-button").removeAttribute("disabled");
    });

    document.getElementById("plus-button").setAttribute("disabled", "disabled");
});


/*
================================================================================================ 
Functions
*/

function getLanguage () {
    language = document.getElementById("choose-language-id").value;
    return language;
};


function fillField (innerText, con){
    if(innerText !== "") {
        innerText += ", ";    
    };
    
    return innerText += con;
    
};


function newKey (language) {

    language = getLanguage()

    var placeDict = {"B": "labial", "D": "labiodental", "Q": "labiovelar", "A": "alveolar", "S": "postalveolar", "X": "retroflex", "J": "palatal", "K": "velar", "H": "glottal"};
    if (language === "4") {
        var manner = {"N": "nasal", "P": "plosive", "Z": "affricate", "F": "fricative", "W": "glide", "R": "trill", "ɾ": "flap", "L": "lateral"};
    } else {
        var manner = {"N": "nasal", "P": "plosive", "Z": "affricate", "F": "fricative", "W": "glide", "R": "rhotic", "L": "lateral"};
    }
    const greekVow = {'y': 'vowel', 'a': 'vowel', 'e': 'vowel', 'ē': 'vowel', 'y': 'vowel', 'o': 'vowel', 'ō': 'vowel', 'i': 'vowel', 'a': 'vowel', 'u': 'vowel'}
    const greekCon = {
                    'p': ['plosive', 'labial', 'voiceless', 'notAsp'],
                    'b': ['plosive', 'labial', 'voice', 'notAsp'],
                    'ph': ['plosive', 'labial', 'voiceless', 'asp'],
                    't': ['plosive', 'alveolar', 'voiceless', 'notAsp'],
                    'd': ['plosive', 'alveolar', 'voice', 'notAsp'],
                    'th': ['plosive', 'alveolar', 'voiceless', 'asp'],
                    'k': ['plosive', 'velar', 'voiceless', 'notAsp'],
                    'g': ['plosive', 'velar', 'voice', 'notAsp'],
                    'kh': ['plosive', 'velar', 'voiceless', 'asp'],
                    'ks': ['affricate', 'velar', 'voiceless', 'notAsp'],
                    'z': ['affricate', 'alveolar', 'voiceless', 'notAsp'],
                    'n': ['nasal', 'alveolar', 'voice', 'notAsp'],
                    'm': ['nasal', 'labial', 'voice', 'notAsp'],
                    'l': ['lateral', 'alveolar', 'voiceless', 'notAsp'],
                    'r': ['rhotic', 'alveolar', 'voiceless', 'notAsp'],
                    's': ['fricative', 'alveolar', 'voiceless', 'notAsp'],
                    'ps': ['affricate', 'labial', 'voiceless', 'notAsp'],
                    'h': ['fricative', 'glottal', 'voiceless', 'notAsp']
               };

    const vedicVowel = ['a', 'á', 'à', 'ā', 'e', 'é', 'è', 'i', 'ì', 'í', 'ī', 'o', 'ò', 'u', 'ù', 'ú']
    const vedicCon = {
                    'p': ['plosive', 'labial', 'voiceless', 'notAsp'],
                    'b': ['plosive', 'labial', 'voice', 'notAsp'],
                    'ph': ['plosive', 'labial', 'voiceless', 'asp'],
                    'bh': ['plosive', 'labial', 'voice', 'asp'],
                    't': ['plosive', 'alveolar', 'voiceless', 'notAsp'],
                    'd': ['plosive', 'alveolar', 'voice', 'notAsp'],
                    'th': ['plosive', 'alveolar', 'voiceless', 'asp'],
                    'dh': ['plosive', 'alveolar', 'voice', 'asp'],
                    'ṭ': ['plosive', 'retroflex', 'voiceless', 'notAsp'],
                    'ṭh': ['plosive', 'retroflex', 'voiceless', 'asp'],
                    'ḍ': ['plosive', 'retroflex', 'voice', 'notAsp'],
                    'ḍh': ['plosive', 'retroflex', 'voice', 'asp'],
                    'k': ['plosive', 'velar', 'voiceless', 'notAsp'],
                    'g': ['plosive', 'velar', 'voice', 'notAsp'],
                    'kh': ['plosive', 'velar', 'voiceless', 'asp'],
                    'gh': ['plosive', 'velar', 'voice', 'asp'],
                    'c': ['affricate', 'palatal', 'voiceless', 'notAsp'],
                    'ch': ['affricate', 'palatal', 'voiceless', 'asp'],
                    'j': ['affricate', 'palatal', 'voice', 'notAsp'],
                    'v': ["glide", "labiodental", 'voice', 'notAsp'],
                    'y': ["glide", "palatal", 'voice', 'notAsp'],
                    'm': ['nasal', 'labial', 'voice', 'notAsp'], 
                    'n': ['nasal', 'alveolar', 'voice', 'notAsp'],
                    'ṇ': ['nasal', 'retroflex', 'voice', 'notAsp'],
                    "ñ": ['nasal', 'palatal', 'voice', 'notAsp'],
                    "ṅ": ['nasal', 'velar', 'voice', 'notAsp'],
                    'l': ['lateral', 'alveolar', 'voiceless', 'notAsp'],
                    'r': ['rhotic', 'alveolar', 'voiceless', 'notAsp'],
                    's': ['fricative', 'alveolar', 'voiceless', 'notAsp'],
                    'ṣ': ['fricative', 'retroflex', 'voiceless', 'notAsp'],
                    'ś': ['fricative', 'palatal', 'voiceless', 'notAsp'],
                    'h': ['fricative', 'glottal', 'voiceless', 'notAsp']
    };

    const latinCon = {
                    'p': ['plosive', 'labial', 'voiceless', 'notAsp'],
                    'b': ['plosive', 'labial', 'voice', 'notAsp'],
                    'qu': ['plosive', 'labiovelar', 'voice', 'notAsp'],
                    't': ['plosive', 'alveolar', 'voiceless', 'notAsp'],
                    'd': ['plosive', 'alveolar', 'voice', 'notAsp'],
                    'k': ['plosive', 'velar', 'voiceless', 'notAsp'],
                    'g': ['plosive', 'velar', 'voice', 'notAsp'],
                    'v': ["glide", "labiodental", 'voice', 'notAsp'],
                    'm': ['nasal', 'labial', 'voice', 'notAsp'], 
                    'n': ['nasal', 'alveolar', 'voice', 'notAsp'],
                    'l': ['lateral', 'alveolar', 'voiceless', 'notAsp'],
                    'r': ['rhotic', 'alveolar', 'voiceless', 'notAsp'],
                    's': ['fricative', 'alveolar', 'voiceless', 'notAsp'],
                    'f': ['fricative', 'labiodental', 'voiceless', 'notAsp'],
                    'x': ["affricate", 'velar', 'voiceless', 'notAsp'],
                    'h': ['fricative', 'glottal', 'voiceless', 'notAsp']
    };

    const armenianCon = {
        'p': ['plosive', 'labial', 'voiceless', 'notAsp'],
        'b': ['plosive', 'labial', 'voice', 'notAsp'],
        'p`': ['plosive', 'labial', 'voiceless', 'asp'],
        't': ['plosive', 'alveolar', 'voiceless', 'notAsp'],
        'd': ['plosive', 'alveolar', 'voice', 'notAsp'],
        't`': ['plosive', 'alveolar', 'voiceless', 'asp'],
        'k': ['plosive', 'velar', 'voiceless', 'notAsp'],
        'g': ['plosive', 'velar', 'voice', 'notAsp'],
        'k`': ['plosive', 'velar', 'voiceless', 'asp'],
        'n': ['nasal', 'labial', 'voice', 'notAsp'],
        'm': ['nasal', 'alveolar', 'voice', 'notAsp'],
        'l': ['lateral', 'alveolar', 'voiceless', 'notAsp'],
        'r': ['flap', 'alveolar', 'voiceless', 'notAsp'],
        'ṙ': ['trill', 'alveolar', 'voiceless', 'notAsp'],
        's': ['fricative', 'alveolar', 'voiceless', 'notAsp'],
        'n': ['nasal', 'alveolar', 'voice', 'notAsp'],
        'm': ['nasal', 'labial', 'voice', 'notAsp'],
        'v': ["glide", "labiodental", 'voice', 'notAsp'],
        'w': ["glide", "labiodental", 'voice', 'notAsp'],
        'y': ["glide", "palatal", 'voice', 'notAsp'],
        'l': ['lateral', 'alveolar', 'voiceless', 'notAsp'],
        'ł': ['lateral', 'velar', 'voiceless', 'notAsp'],
        'š': ['fricative', 'postalveolar', 'voiceless', 'notAsp'],
        'ž': ['fricative', 'postalveolar', 'voice', 'notAsp'],
        'x': ['fricative', 'velar', 'voiceless', 'notAsp'],
        'f': ['fricative', 'labiodental', 'voiceless', 'notAsp'],
        'c': ['affricate', 'alveolar', 'voiceless', 'notAsp'],
        'j': ['affricate', 'alveolar', 'voice', 'notAsp'],
        'c`': ['affricate', 'alveolar', 'voiceless', 'asp'],
        'č': ['affricate', 'postalveolar', 'voiceless', 'notAsp'],
        'ǰ': ['affricate', 'postalveolar', 'voice', 'notAsp'],
        'č`': ['affricate', 'postalveolar', 'voiceless', 'asp'],
        'h': ['fricative', 'glottal', 'voiceless', 'notAsp']
    };

    cons = [greekCon, vedicCon, latinCon, armenianCon];
    langCon = cons[parseInt(language)-1];

    tbody = document.createElement("tbody");
    tbody.setAttribute("id", "generate-body");
    conTable = document.getElementById("con-table");

    i = 0
    for (var [man_key, man_value] of Object.entries(manner)) {
        console.log(man_value);
        i++;
        var tableRoll = document.createElement("tr");
        tableRoll.innerHTML = `<td><span class="manner">${man_value}</span><span class="user-key">${man_key}</span></td>`;

        for (var [placeKey, place] of Object.entries(placeDict)) {
            console.log(place);
            var td_nv_na = document.createElement("td");
            var td_nv_a = document.createElement("td");
            var td_v_na = document.createElement("td");
            var td_v_a = document.createElement("td");
            td_nv_na.setAttribute("class", "phoneme");
            td_nv_a.setAttribute("class", "phoneme");
            td_v_na.setAttribute("class", "phoneme");
            td_v_a.setAttribute("class", "phoneme");
          
            for (var [con, feature] of Object.entries(langCon)){

                console.log(con);
                if (feature.includes(man_value) && feature.includes(place) && feature.includes("voiceless") && feature.includes("notAsp")) {
                    td_nv_na.innerText = fillField(td_nv_na.innerText, con)
                 
                } else if (feature.includes(man_value) && feature.includes(place) && feature.includes("voiceless") && feature.includes("asp")) {
                    td_nv_a.innerText = fillField(td_nv_a.innerText, con);
                
                } else if (feature.includes(man_value) && feature.includes(place) && feature.includes("voice") && feature.includes("notAsp")) {
                    td_v_na.innerText = fillField(td_v_na.innerText, con);
                 
                } else if (feature.includes(man_value) && feature.includes(place) && feature.includes("voice") && feature.includes("asp")) {
                    td_v_a.innerText = fillField(td_v_a.innerText, con);
                
                };
          
            };
            tableRoll.append(td_nv_na);
            tableRoll.append(td_nv_a);
            tableRoll.append(td_v_na);
            tableRoll.append(td_v_a);
        };
        tbody.append(tableRoll);    
    };
    conTable.append(tbody);
};

// renders HTML for key tables

// if key of virtual keyboard is pressed key is added to search input
function printValue (val) {
    document.getElementById('user-input').value += val;
};
// generates keyboard containing keys for key-characters and special characters in the respective language
function generateKeyboard(language) {
    console.log(language)
    var keyIds = []
    var keyboardContainer = document.createElement("div");
    keyboardContainer.setAttribute("id", "keyboard-container");
    keyboardContainer.setAttribute("class", "expand-container");
    //var language = document.getElementById("choose-language-id").value;
    var specialCharsGreek = {"á": "1", "é": "2", "ē": "3", "ō": "4", "ḗ": "5", "ṓ": "6", "ý": "7", "í": "8"};
    var specialCharsVedic = {
        'á': "1", 'à': "2", 'ā': "3",'é': "4", 'è': "5", 'ì': "6", 'í': "6", 'ī': "7", 'ù': "8", 'ú': "9",
        'ṭ': "9", 'ḍ': "11", 's': "12", 'ś': "13", 'ṣ': "14", 'ṇ': "15", "ṅ": "16", "ñ": "17", "ḥ": "18", 'ṃ': "19", "m̐": "20"
    };
    var specialCharsArmenian = {
        'ē': "1", 'ǝ': "2", 'š': "3", 'ž': "4", 'ł': "5", 'č': "6", 'ǰ': "7", "ṙ": "8", "`": "9"
    };

    noChars = null;

    greek = [featuresGreek, specialCharsGreek, wildcards];
    vedic = [featuresVedic, specialCharsVedic, wildcards];
    latin = [featuresLatin, noChars, wildcards];
    armenian = [featuresArmenian, specialCharsArmenian, wildcards]

    for (var count=0; count<=1; count++) {
        var kind;
        if (language === "1") {
            kind = greek[count];
        } else if (language === "2") {
            kind = vedic[count];
        } else if (language === "3") {
            kind = latin[count];
        } else if (language === "4") {
            kind = armenian[count];
        };

        if (kind == null) {
            console.log("null");
            continue;
        };

        innerContainer = document.createElement("div");
        innerContainer.setAttribute("class", "inner-key-container");
        //console.log(kind);
        for (var [key, value] of Object.entries(kind)) {
            //var spanKey = document.createElement("span");
            //spanKey.setAttribute("class", "key-span");
            var btnKey = document.createElement("button");
            btnKey.innerText = key;
            btnKey.setAttribute("class", "key");
            btnKey.setAttribute("value", key);
            btnKey.setAttribute("onclick", "printValue(this.value);");
            keyIds.push(`key${key}`);
            btnKey.setAttribute("id", `key${key}`);
            innerContainer.append(btnKey);
        }
        keyboardContainer.append(innerContainer);
    }
    document.getElementById("expand-keyboard-section").append(keyboardContainer);
};


function removeDisabled(id) {
    document.getElementById(id).removeAttribute("disabled");
}
// adds content of add phoneme input field to main input field
function addToSearch(inputContent) {
    const searchInput = document.getElementById("user-input");
    searchInput.value += inputContent;
    document.getElementById("add-phoneme-container").remove();
    removeDisabled("plus-button");
}


// adds a message for user if input is not allowed
function wrongInput(errorMessage, fieldId) {
    var inputField = document.getElementById(fieldId);
    inputField.setAttribute("class", "text-field-wrong");
    var infoContainer = document.createElement("div");
    infoContainer.setAttribute("id", "wrong-message-id");
    infoContainer.setAttribute("class", "wrong-message");
    infoContainer.innerText = errorMessage;
    const inputContainer = document.getElementById("user-input-container");
    inputContainer.append(infoContainer);
}


// handles input in the main and secondary input field
// checks whether given char is in list of allowed inputs of the respective language
// special treatment for h in Greek which is only allowed after certain characters
function wrongInputHandling(key, pressed, fieldId) {
    if (document.getElementById("wrong-message-id")) {
        document.getElementById("wrong-message-id").remove();
        document.getElementById(fieldId).setAttribute("class", "text-field");
    }
    var allowed;

    const greekAllowed = ['(', ')', '+', '#', '%', '(', ')', '*', '<', '>', 'A', 'C', 'F', 'J', 'K', 'L', 'N', 'P', 'B',
                          'R', 'V', 'Z', '|', 'y', 'a', 'e', 'ē', 'y', 'o', 'ō', 'i', 'a', 'o', 'ō', 'i', 'u', 'é', 'á', 'ḗ', 'ṓ',' ý', 'í',
                        'p', 'b', 'ph', 't', 'd', 'th', 'k', 'g', 'kh', 'ks', 'z', 'm', 'n', 'l', 'r', 's',
                          'ps', 'h', 'Enter'
                        ];
    const vedicAllowed = ['(', ')', '+', '#', '%', '(', ')', '*', '<', '>', 'A', 'C', 'F', 'H', 'J', 'K', 'L', 'N', 'P',
                          'R', 'V', 'W', 'X', 'Z', '|', 'a', 'á', 'à', 'ā', "e", 'é', 'è', 'i', 'ì', 'í', 'ī', 'o', 'ò', 'u',
                          'ù', 'ú', 'p', 'ph', 'b', 'bh', 't', 'th', 'd', 'dh', 'ṭ', 'ṭh', 'ḍ', 'ḍh', 'k', 'kh', 'g',
                          'gh', 'c', 'ch', 'j', 'v', 'y', 'm', 'ṃ', 'n', 'ṇ', 'l', 'r', 's', 'ṣ', 'ś', 'h', "ñ", "ṅ", "m̐", 'ḥ', 'Enter'
                        ];
    
    const latinAllowed = ['(', ')', '+', '#', '%', '(', ')', '*', '<', '>', '|','A', 'C', 'F', 'J', 'K', 'L', 'N', 'P',
                          'R', 'V', 'H', 'Q', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p',
                          'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'Enter'
                        ];

    const armenianAllowed = ['(', ')', '+', '#', '%', '(', ')', '*', '<', '>', '|','A', 'C', 'F', 'J', 'K', 'L', 'N', 'P',
                             'R', 'V', 'H', 'Q', 'Z', "`", 'a', 'e', 'ē', 'ǝ', 'i', 'o', 'u',
                             'p', 'b', 't', 'd', 'ṭ', 'ḍ', 'k', 'g', 'c', 'j', 'v', 'y', 'm', 'n', 'l', 'r', 'ṙ', 's', 'h', 'š',
                             'ž', 'ł', 'č', 'ǰ', 'f', 'Enter'
                            ];

    const greekFollows = {"h": ["p", "t", "k"]};
    const greekInitial = ["h"];
    const armenianFollows = {"`": ["p", "t", "k", "c", "č"]};
    var follows;
    var initial;

    var language = document.getElementById("choose-language-id").value;
    console.log(language);
    if (language === "1") {
        allowed = greekAllowed;
        follows = greekFollows;
        initial = greekInitial;
        lang = "Greek";
    } else if (language === "2") {
        allowed = vedicAllowed;
        follows = {"": ""};
        initial = [""]
        lang = "Vedic";
    } else if (language === "3") {
        allowed = latinAllowed;
        follows = {"": ""};
        initial = [""];
        lang = "Latin";
    } else if (language === "4") {
        allowed = armenianAllowed;
        follows = armenianFollows;
        initial = [""];
        lang = "Armenian";
    };
    
    if (allowed.includes(pressed)) {
        if (follows.hasOwnProperty(pressed)) {
            fieldValue = document.getElementById(fieldId).value;
            lastChar = fieldValue.slice(-1);
            var value = follows[pressed];
            if (value.includes(lastChar)) {
                console.log("allowed input");
            } else if (initial.includes(pressed) && fieldValue.length === 0) {
                console.log("allowed input");
            } else {
                var message = `'${pressed}' only allowed after ${value.join(", ")}`;
                if (initial.includes(pressed)) {
                    message = message + ` or as initial phoneme`
                };
                key.preventDefault();
                wrongInput(message, fieldId);
            };
        };
    } else {
        var message = `character '${pressed}' is no allowed input for ${lang}`;
        key.preventDefault();
        wrongInput(message, fieldId);
    }
}

/*
document.getElementById("start-button").addEventListener("click", () => {
    var inputFieldCont = document.getElementById("user-input").innerText
    if (inputFieldCont.includes("`")) {
        var cleanInput = inputFieldCont.replace(/`/g, ";");
        inputFieldCont.innerText = cleanInput;
    };
});
*/






/*const phonemesGreek = {
    "a": " α", "e": " ε", "ē": " η", "i": " ι", "o": " ο", "ō": " ω", "y": " υ", "u": " ου", "a": " ά", "é": " έ",
    "i": " ί", "o": " ό", "ō": " ώ", "y": " ύ", "u": " όυ", "ē": " ή", "i": " ι", "p": " π", "b": " β", "ph": "φ",
    "t": " τ", "d": " δ", "th": "θ", "k": " κ", "g": " γ", "kh": "χ", "z": " ζ", "m": " μ", "n": " ν", "l": " λ",
    "r": " ρ", "s": " σ", "s": " ς", "ps": "ψ", "p": " π", "b": " β", "ph": "φ", "t": " τ", "d": " δ", "th": "θ",
    "k": " κ", "g": " γ", "ks": "ξ"
};

if (language == "1") {
            if (pressed == "h") {
                fieldValue = document.getElementById(fieldId).value;
                lastChar = fieldValue.slice(-1);
                if ((lastChar != "p") && (lastChar != "k") && (lastChar != "t") && fieldValue.length != 0) {
                    var message = `'h' only allowed after 'p', 'k', 't' or as first character`;
                    key.preventDefault();
                    wrongInput(message, fieldId);
                }
            }

*/