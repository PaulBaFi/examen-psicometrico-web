let isPointerDown = false;
let startTime;
let timeLimit = 60000; // 60 segundos
let errors = 0;
let totalErrorTime = 0; // Tiempo total de errores
const maxErrors = 12;
const statusDisplay = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const errorInfoDisplay = document.getElementById("error-info");
const path = document.getElementById("path");
const restartBtn = document.getElementById("restart-btn");

// Detección de clic en el punto de inicio
document.getElementById("start").addEventListener("mousedown", startTest);
document.addEventListener("mouseup", endTest);
document.addEventListener("mousemove", trackMovement);
restartBtn.addEventListener("click", resetSimulator); // Evento para el botón de reinicio

// Temporizador
let timerInterval;

function startTimer() {
  let elapsedTime = 0;
  timerInterval = setInterval(() => {
    elapsedTime += 1000;
    timerDisplay.innerHTML = `Tiempo: ${elapsedTime / 1000} segundos`;
    if (elapsedTime >= timeLimit) {
      clearInterval(timerInterval);
      statusDisplay.innerHTML = "Error: Excediste el tiempo límite!";
      isPointerDown = false;
      showErrorInfo();
    }
  }, 1000);
}

// Iniciar el test
function startTest() {
  isPointerDown = true;
  startTime = Date.now();
  errors = 0;
  statusDisplay.innerHTML = "Estado: En progreso";
  timerDisplay.innerHTML = "Tiempo: 0 segundos"; // Resetear tiempo
  totalErrorTime = 0; // Reiniciar tiempo de errores
  errorInfoDisplay.style.display = "none"; // Ocultar información de errores
  startTimer();
}

// Finalizar el test
function endTest(event) {
  clearInterval(timerInterval);

  if (isPointerDown) {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > timeLimit) {
      statusDisplay.innerHTML = "Error: Excediste el tiempo límite!";
      totalErrorTime += elapsedTime; // Sumar tiempo de error total
      showErrorInfo(); // Mostrar información de errores
    } else if (event.target.id === "end") {
      statusDisplay.innerHTML = "¡Felicidades, terminaste el circuito!"; // Mensaje de felicitaciones
      showErrorInfo(); // Mostrar información de errores
    } else {
      statusDisplay.innerHTML =
        "Error: Levantaste el puntero antes de terminar.";
      totalErrorTime += elapsedTime; // Sumar tiempo de error total
      showErrorInfo(); // Mostrar información de errores
    }
  }
  isPointerDown = false;
}

// Detección de movimiento del mouse
function trackMovement(event) {
  if (isPointerDown) {
    const x = event.clientX;
    const y = event.clientY;

    // Verificar si el mouse está dentro del SVG (trayectoria)
    const isInPath = document.elementFromPoint(x, y) === path;
    const isOnEndPoint = document.elementFromPoint(x, y).id === "end"; // Verificar si está en el punto final

    if (!isInPath && !isOnEndPoint) {
      errors++;
      if (errors >= maxErrors) {
        statusDisplay.innerHTML =
          "Error: Demasiados errores (saliste del circuito).";
        isPointerDown = false;
        clearInterval(timerInterval);
        showErrorInfo(); // Mostrar información de errores
      } else {
        statusDisplay.innerHTML = `Error: Te saliste del trazado (${errors}/${maxErrors} errores).`;
      }
    }
  }
}

// Mostrar información de errores
function showErrorInfo() {
  const averageErrorTime =
    errors > 0 ? (totalErrorTime / errors / 1000).toFixed(2) : 0;
  errorInfoDisplay.innerHTML = `Errores: ${errors} | Tiempo total de error: ${Math.floor(
    totalErrorTime / 1000
  )}s | Tiempo promedio por error: ${averageErrorTime}s`;
  errorInfoDisplay.style.display = "block"; // Mostrar información de errores
}

// Reiniciar el simulador
function resetSimulator() {
  statusDisplay.innerHTML = "Estado: Haz clic en el punto de inicio";
  timerDisplay.innerHTML = "Tiempo: 0 segundos";
  errorInfoDisplay.style.display = "none"; // Ocultar información de errores
  errors = 0; // Reiniciar contador de errores
  totalErrorTime = 0; // Reiniciar tiempo total de errores
  isPointerDown = false; // Reiniciar estado del puntero
}
