document.addEventListener("DOMContentLoaded", function () {
    const cont = document.getElementById("display");
    const botones = document.querySelectorAll("[id^=boton]");
    const a1 = document.getElementById("n1");
    const a2 = document.getElementById("n2");
    const a3 = document.getElementById("n3");
    const a4 = document.getElementById("n4");
    const botonStop = document.getElementById("stop");
    const botonReset = document.getElementById("reset");
    const intentosDisplay = document.getElementById("intentos");
    const gameOverMessage = document.getElementById("gameOverMessage");
    const codigoCorrectoSpan = document.getElementById("codigoCorrecto");

    let clave = generarClave();
    let intentosRestantes = 10;
    const crono = new Crono(cont);

    actualizarIntentos();

    function generarClave() {
        let claveGenerada = "";
        while (claveGenerada.length < 4) {
            const digito = Math.floor(Math.random() * 10).toString();
            if (!claveGenerada.includes(digito)) {
                claveGenerada += digito;
            }
        }
        return claveGenerada;
    }

    function actualizarIntentos() {
        intentosDisplay.innerText = `Intentos restantes: ${intentosRestantes}`;
    }

    function comprobarClave() {
        if ([a1, a2, a3, a4].every((el, i) => el.innerHTML === clave[i])) {
            crono.stop();
            bloquearBotones();
            mostrarMensajeExito();
        }
    }

    function asignarNumero(elemento) {
        if (intentosRestantes <= 0) return;

        const numero = elemento.innerText;
        crono.start();

        clave.split("").forEach((digito, i) => {
            if (digito === numero) {
                const casilla = document.getElementById("n" + (i + 1));
                casilla.innerHTML = numero;
                casilla.classList.add("correct-guess");
            }
        });

        intentosRestantes--;
        actualizarIntentos();

        if (intentosRestantes === 0) {
            crono.stop(); // Detener el cronómetro al alcanzar los 10 intentos
            bloquearBotones();
            mostrarMensajeDerrota();
        }

        comprobarClave();
    }

    function bloquearBotones() {
        botones.forEach(boton => boton.disabled = true);
    }

    function desbloquearBotones() {
        botones.forEach(boton => boton.disabled = false);
    }

    function mostrarMensajeExito() {
        const tiempo = crono.getTime();
        alert(`¡Felicidades! Has adivinado la clave en ${tiempo} segundos.`);
    }

    function mostrarMensajeDerrota() {
        codigoCorrectoSpan.innerText = clave;
        gameOverMessage.style.display = "block";
        alert(`¡Has perdido! El código era: ${clave}`);
    }

    function reiniciarJuego() {
        crono.reset();
        clave = generarClave();
        intentosRestantes = 10;
        actualizarIntentos();
        desbloquearBotones();
        console.log("Nueva clave:", clave);
        [a1, a2, a3, a4].forEach(el => {
            el.innerHTML = "*";
            el.classList.remove("correct-guess");
        });
        gameOverMessage.style.display = "none";
    }

    botones.forEach(boton => {
        boton.addEventListener("click", function () {
            asignarNumero(this);
        });
    });

    botonStop.addEventListener("click", () => crono.stop());
    botonReset.addEventListener("click", reiniciarJuego);
    const botonStart = document.getElementById("start"); // Asegúrate de que exista este bloque
    botonStart.addEventListener("click", () => crono.start());
});
