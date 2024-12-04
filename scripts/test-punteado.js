let aciertosTotales = 0;
let errores = 0;
let secuenciaActual = 1;
let testActivo = false;
let tiemposPorOrificio = [0, 0, 0];
let aciertosPorOrificio = [0, 0, 0];
let tiempoInicio = Date.now();
let tiempoLimite = 30000; // 30 segundos

function iniciarTest() {
  aciertosTotales = 0;
  errores = 0;
  secuenciaActual = 1;
  testActivo = true;
  tiemposPorOrificio = [0, 0, 0];
  aciertosPorOrificio = [0, 0, 0];
  tiempoInicio = Date.now();
  document.getElementById("disco").style.animation = "spin 5s linear infinite";

  setTimeout(finalizarTest, tiempoLimite); // Detener después de 30s
}

function verificarAcierto(orificio, elemento) {
  if (!testActivo) return;

  if (orificio !== secuenciaActual) {
    errores++;
    actualizarPuntuacion();
    return;
  }

  const tiempoAcierto = (Date.now() - tiempoInicio) / 1000;
  tiemposPorOrificio[orificio - 1] += tiempoAcierto;
  aciertosPorOrificio[orificio - 1]++;
  aciertosTotales++;

  elemento.style.backgroundColor = "#FACA15";
  setTimeout(() => (elemento.style.backgroundColor = "white"), 500);

  secuenciaActual = secuenciaActual === 3 ? 1 : secuenciaActual + 1;
  actualizarPuntuacion();
}

function actualizarPuntuacion() {
  document.getElementById(
    "aciertosTotales"
  ).textContent = `${aciertosTotales} ACIERTOS`;
  document.getElementById("errores").textContent = `${errores} ERRORES`;
}

function finalizarTest() {
  testActivo = false;
  document.getElementById("disco").style.animation = "none";
  mostrarEstadisticasFinales();
}

function mostrarEstadisticasFinales() {
  for (let i = 0; i < 3; i++) {
    const promedio = (
      tiemposPorOrificio[i] / (aciertosPorOrificio[i] || 1)
    ).toFixed(2);
    document.getElementById(
      `estadistica${i + 1}`
    ).innerHTML = `${aciertosPorOrificio[i]} aciertos <br /> ${promedio} seg/acierto`;
  }

  const promedioTotal = (
    tiemposPorOrificio.reduce((a, b) => a + b) / (aciertosTotales || 1)
  ).toFixed(2);
  document.getElementById(
    "promedioAciertos"
  ).textContent = `${promedioTotal} SEG. DE ACIERTO`;
}
