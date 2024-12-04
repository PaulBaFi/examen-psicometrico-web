let isGreenLight = false;
let isRedLight = false;
let reactionTimes = [];
let attempts = 0;
let startTime;
const maxAttempts = 10;
const approvalTime = 0.43; // Tiempo límite de aprobación en segundos

const greenLight = document.getElementById("green");
const redLight = document.getElementById("red");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const reactionTimesDiv = document.getElementById("reactionTimes");

// Función para iniciar el test
function startTest() {
  message.textContent = "Presiona el acelerador (Flecha Arriba) para iniciar.";
  startBtn.disabled = true; // Deshabilita el botón de inicio
  resetLights(); // Apaga todas las luces al iniciar
}

// Función que apaga las luces (pero manteniendo el color visible)
function resetLights() {
  greenLight.classList.remove("active");
  redLight.classList.remove("active");
  isGreenLight = false;
  isRedLight = false;
}

// Función cuando se presiona la Flecha Arriba (acelerador)
function pressAccelerator() {
  if (!isGreenLight) {
    greenLight.classList.add("active"); // Enciende la luz verde
    isGreenLight = true;
    message.textContent =
      "¡Acelerando! Espera a que el semáforo cambie a rojo...";
    setTimeout(turnOnRed, Math.random() * 3000 + 2000); // Cambia a rojo tras un tiempo aleatorio
  }
}

// Función para encender la luz roja
function turnOnRed() {
  if (isGreenLight && !isRedLight) {
    redLight.classList.add("active"); // Enciende la luz roja
    greenLight.classList.remove("active"); // Apaga la luz verde
    isRedLight = true;
    isGreenLight = false;
    startTime = Date.now(); // Marca el tiempo en que se enciende la luz roja
    message.textContent = "¡Semáforo rojo! Presiona el freno (Flecha Abajo).";
  }
}

// Función cuando se presiona la Flecha Abajo (freno)
function pressBrake() {
  if (isRedLight) {
    const endTime = Date.now();
    const reactionTime = (endTime - startTime) / 1000; // Calcula tiempo en segundos
    reactionTimes.push(reactionTime); // Guarda el tiempo de reacción
    attempts++;
    redLight.classList.remove("active"); // Apaga la luz roja
    isRedLight = false;
    message.textContent = `Tiempo de reacción: ${reactionTime.toFixed(
      2
    )} segundos`;
    updateReactionTimes(); // Actualiza los tiempos en pantalla

    if (attempts < maxAttempts) {
      setTimeout(startTest, 2000); // Espera 2 segundos y comienza de nuevo
    } else {
      calculateResult();
    }
  }
}

// Función para actualizar los tiempos en pantalla
function updateReactionTimes() {
  reactionTimesDiv.innerHTML =
    `<strong>Tiempos de reacción:</strong><br>` +
    reactionTimes
      .map((time, index) => `Intento ${index + 1}: ${time.toFixed(2)} segundos`)
      .join("<br>");
}

// Calcula el resultado final
function calculateResult() {
  const avgTime =
    reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  message.textContent = `Promedio de tiempo de reacción: ${avgTime.toFixed(
    2
  )} segundos`;

  if (avgTime <= approvalTime) {
    message.textContent += " - ¡Aprobado!";
  } else {
    message.textContent += " - No aprobado";
  }
  startBtn.disabled = false;
  startBtn.textContent = "Reiniciar";
}

// Maneja las teclas para presionar acelerador y freno
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    pressAccelerator(); // Presiona el acelerador
  } else if (event.key === "ArrowDown") {
    pressBrake(); // Presiona el freno
  }
});

// Inicia el test al presionar el botón "Iniciar"
startBtn.addEventListener("click", () => {
  reactionTimes = [];
  attempts = 0;
  reactionTimesDiv.innerHTML = ""; // Limpia los tiempos anteriores
  startTest();
});
