// Fonction pour générer le code HTML
function generateHTML() {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">        
        <title>Document</title>
    </head>
    <body>
        <main class="container"> 
        <div style="text-align:center;padding:1em 0;"> <h4><a style="text-decoration:none;" href="https://www.zeitverschiebung.net/fr/city/3031582"><span style="color:gray;">Heure actuelle</span><br />Bordeaux, France</a></h4> <iframe src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=fr&size=small&timezone=Europe%2FParis" width="100%" height="90" frameborder="0" seamless></iframe> </div>   
            <div class="main_wrapper">
             <div class="wrapper">
                <div>
                    <div class="code"></div>
                        <div id="box">            
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                            <div>4</div>
                            <div>5</div>
                            <div>6</div>
                            <div>7</div>
                            <div>8</div>
                            <div>9</div>
                            <div class="zero">0</div>
                        </div>
                        <div class="timer">Temps restant: 1:00</div>     
                    </div>        
                    <div class="attempts"></div>
                </div>
            </div>
        </main>
    </body>
    </html>
  `;
}

document.addEventListener("DOMContentLoaded", function() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = generateHTML();

    // Eléments du DOM
    const numbersDiv = document.getElementById("box");
    const codeDiv = document.querySelector(".code");
    const attemptsDiv = document.querySelector(".attempts");
    const timerDiv = document.querySelector(".timer");
    const mainContainer = document.querySelector(".container");
    const wrapperDiv = document.querySelector(".wrapper")

    // Récupération de la combinaison secrète depuis le local storage ou génération d'une nouvelle combinaison si il n'y en a pas
    let secretCombination = localStorage.getItem("secretCombination");
    if (!secretCombination) {
        secretCombination = generateSecretCombination();
        localStorage.setItem("secretCombination", JSON.stringify(secretCombination));
    } else {
        secretCombination = JSON.parse(secretCombination);
    }

    // Variables du jeu en cours. On stocke les chiffres et les essais dans des tableaux
    let selectedNumbers = [];
    let attemptsHistory = [];
    let remainingTime = 60;
    let timer;

    // Fonction pour générer un nouvelle combinaison
    function generateSecretCombination() {
        const combination = [];
        while (combination.length < 3) {
            const randomDigit = Math.floor(Math.random() * 10);
            if (!combination.includes(randomDigit)) {
                combination.push(randomDigit);
            }
        }
        return combination;
    }

    // Fonction pour les chiffres sélectionnés
    function handleNumberClick(e) {
        if (selectedNumbers.length >= 3) {
            return;
        }

        const number = e.target.textContent;
        codeDiv.innerHTML += number;
        selectedNumbers.push(parseInt(number));

        if (selectedNumbers.length === 3) {
            checkCombination();
        }
    }

    // Fonction pour vérifier la combinaison choisie par le joueur
    function checkCombination() {
        let attempts = parseInt(localStorage.getItem("attempts")) || 0;
        attempts++;

        let feedbackHTML = '';
        let correctAndPositionedCount = 0;

        // On vérifie que les chiffres correspondent à la combinaison, et on leur attribue la couleur en fonction
        for (let i = 0; i < selectedNumbers.length; i++) {
            const selectedNum = selectedNumbers[i];
            const secretNum = secretCombination[i];

            if (selectedNum === secretNum) {
                feedbackHTML += `<span style="color: green; font-size: 1.5em">${selectedNum}</span> `;
                correctAndPositionedCount++;
            } else if (secretCombination.includes(selectedNum)) {
                feedbackHTML += `<span style="color: orange; font-size: 1.5em">${selectedNum}</span> `;
            } else {
                feedbackHTML += `<span style="color: #e11a1a; font-size: 1.5em">${selectedNum}</span> `;
            }
        }

        // On affiche dans la div attempts les essais du joueur
        attemptsHistory.push(`<p>${feedbackHTML}</p>`);
        attemptsDiv.innerHTML = attemptsHistory.join('');

        // Si le joueur fait plus de 10 combinaisons, on réinitialise le jeu
        if(attempts === 10) {
            resetGame();
        }

        // Si la combinaison est bonne, on change de background
        if (correctAndPositionedCount === 3) {
            mainContainer.classList.add("container_winner");
            wrapperDiv.style.display = "none";
            codeDiv.style.display = "none";
            attemptsDiv.style.display = "none";
            numbersDiv.style.display = "none";
            timerDiv.style.display = "none";
            resetGame();
        } else {
            localStorage.setItem("attempts", String(attempts));
            selectedNumbers = [];
            codeDiv.innerHTML = "";
        }
    }

    // Fonction pour réinitialiser le jeu
    function resetGame() {
        localStorage.removeItem("secretCombination");
        localStorage.removeItem("attempts");

        attemptsDiv.innerHTML = "";
        selectedNumbers = [];
        codeDiv.innerHTML = "";

        secretCombination = generateSecretCombination();
        localStorage.setItem("secretCombination", JSON.stringify(secretCombination));
        localStorage.setItem("attempts", "0")
        startTimer()
    }

    // Fonction pour démarrer le timer
    function startTimer() {
        timer = setInterval(updateTimer, 1000);
    }

    // Fonction pour gérer le timer
    function updateTimer() {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDiv.innerHTML = `Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime === 0) {
            clearInterval(timer);
            alert("Le temps est écoulé ! Le jeu sera réinitialisé.");
            resetGame();
        }
    }

    // Au chargement de la page, le timer démarrer
    startTimer();

    // Pour gérer le clic des chiffres
    numbersDiv.addEventListener("click", handleNumberClick);
});








