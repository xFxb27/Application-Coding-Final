const ANZEIGE_ID = "anzeige";
const EINGABEFELD_ID = "eingabefeld";
const RECHENWEG_ANZEIGE_ID = "rechenweg-anzeige";
const RECHNEN_BUTTON_ID = "rechnen-button";
const TASTE_KLASSE = "taste";
const FEHLER_KLASSE = "fehler";

const LEERZEICHEN_ERFORDERLICH_REGEX = /(\d|\))\s*(\+|\-|\*|\/)\s*/g;
const GUELTIGE_EINGABE_REGEX = /^[\d .,\(\)\+\-\*\/]*$/;

const anzeige = document.getElementById(ANZEIGE_ID);
const eingabefeld = document.getElementById(EINGABEFELD_ID);
const rechenwegAnzeige = document.getElementById(RECHENWEG_ANZEIGE_ID);
const rechnenButton = document.getElementById(RECHNEN_BUTTON_ID);
const tasten = document.getElementsByClassName(TASTE_KLASSE);

const formatierer = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 15,
    useGrouping: false,
});

let aktuelleEingabe = "";
let history = [];

// Die Liste der Tasten durchgehen
for (const taste of tasten) {
    // Jeder Taste sagen, was passieren soll, wenn man auf sie klickt
    taste.addEventListener("click", function (ereignis) {
        rechenwegAnzeige.textContent = "";
        const angeklicktesZeichen = ereignis.target.textContent;
        switch (angeklicktesZeichen) {
            case "ENTF":
                eingabefeld.value = eingabefeld.value.trimEnd().slice(0, -1).trimEnd();
                aktuelleEingabe = eingabefeld.value;
                break;

            case "AC":
                eingabefeld.value = "";
                aktuelleEingabe = "";
                break;

            case "=":
                try {
                    const expression = eingabefeld.value.replaceAll(",", ".");
                    const ergebnis = new Function("return " + expression)();
                    const formattedResult = formatierer.format(ergebnis);
                    addHistoryEntry(`${expression} = ${formattedResult}`);
                    eingabefeld.value = formattedResult;
                    rechenwegAnzeige.textContent = aktuelleEingabe;
                    aktuelleEingabe = eingabefeld.value;
                    rechenwegAnzeige.classList.remove(FEHLER_KLASSE);
                } catch {
                    rechenwegAnzeige.textContent = "Ungültige Eingabe!";
                    rechenwegAnzeige.classList.add(FEHLER_KLASSE);
                }
                break;

            default:
                eingabefeld.value += angeklicktesZeichen;
                eingabefeld.value = eingabefeld.value.replaceAll(LEERZEICHEN_ERFORDERLICH_REGEX, "$1 $2 ");
                aktuelleEingabe = eingabefeld.value;
                break;
        }
    });
}

eingabefeld.addEventListener("input", function (ereignis) {
    if (GUELTIGE_EINGABE_REGEX.test(eingabefeld.value)) {
        aktuelleEingabe = eingabefeld.value;
    } else {
        eingabefeld.value = aktuelleEingabe;
    }
});

eingabefeld.addEventListener("keydown", function (ereignis) {
    if (ereignis.key === "Enter") {
        rechnenButton.click();
    }
});

const historyButton = document.getElementById('history-button');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history');

// Event-Listener für History-Button
historyButton.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    fetchHistory();
});

// Funktion, um eine neue Berechnung zur Historie hinzuzufügen
function addHistoryEntry(entry) {
    if (history.length >= 10) {
        history.shift();
    }
    history.push(entry);
    updateHistoryList();
}

// Funktion, um die Historie-Liste zu aktualisieren
function updateHistoryList() {
    historyList.innerHTML = '';
    history.forEach((entry) => {
        const p = document.createElement('p');
        p.textContent = entry;
        p.addEventListener('click', () => {
            const [expression, result] = entry.split(' = ');
            eingabefeld.value = expression;
        });
        historyList.appendChild(p);
    });
}

// Funktion, um die Historie zu laden und anzuzeigen
function fetchHistory() {
    updateHistoryList();
}

 