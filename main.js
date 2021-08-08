$(document).ready(() => {
    $('#confirmarMaterias').click(function(e) {
        n_materias = parseInt($("#n_materias").val());
        e.preventDefault();

        //console.log(n_materias)

        $(".input-materias").removeClass("invisible");
        for (var i = 1; i < n_materias; i++) {
            $(".input-materias:first").clone().appendTo("#Materias");
            $(".nuevo-horario:last").attr("name", "agregar" + i)
        }
        $("#confirmarMaterias").attr("disabled", "true"); //desabilito el boton para no seguir agregando matrerias
    });

})

function Agregar(esto) {
    var padre = esto.parentNode;
    $(padre).children('div:last').clone().appendTo(padre)

}

function Eliminar(esto) {
    var padre = esto.parentNode;
    if ($(padre).children("div").length > 1)
        $(padre).children('div:last').remove()

}

class Materia {
    constructor(nombre, horarios) {
        this.nombre = nombre
        this.horarios = horarios
    }
}



function CalcularHorarios() {
    materias = []
        //crea los objetos materia obteniendo los valores del html
    for (var i = 0; i < n_materias; i++) {
        nombre = $(".nombre-materia")[i].value
        horarios = []

        padre = $(".input-materias")[i]
        for (var j = 0; j < $(padre).children(".horarios").length; j++) {
            horarios.push([])
            horario = $(padre).children(".horarios")[j]
            lim = $(horario).children(".dias").length
            h = []
            for (var k = 0; k < lim; k++) {
                dias = $($($(horario).children(".dias")[k]).children("select")).val()
                hora = $($($(horario).children(".dias")[k]).children(".hora")).val()
                duracion = $($($(horario).children(".dias")[k]).children(".duracion")).val()
                    //console.log(typeof(dias))
                h.push([dias, hora, duracion])
            }
            horarios[j].push(h)
        }
        materias.push(new Materia(nombre, horarios)) //para cada materia
    }
    //console.log(materias)
    posibilidades = 1
    var contadores = []
    for (let i = 0; i < materias.length; i++) {
        posibilidades *= materias[i].horarios.length;
        contadores.push(0)
    }
    horariosFinal = []
        //console.log(contadores)
    for (var x = 0; x < posibilidades; x++) {
        console.log(x)
        horario = []
        for (var i = 0; i < materias.length; i++) {
            horario.push([])
            for (var j = 0; j < materias[i].horarios[contadores[i]].length; j++) {
                horario[i].push(materias[i].horarios[contadores[i]][j])
            }
        }
        //          materia  siosi fecha dia/hora/duracion
        //console.log(horario[1][0][1][0])
        if (CumpleCondiciones(horario)) {
            horariosFinal.push(horario)
        }
        contadores[contadores.length - 1] = contadores[contadores.length - 1] < materias[materias.length - 1].horarios.length - 1 ? contadores[contadores.length - 1] + 1 : 0
        for (var i = materias.length - 1; i > 0; i--) {
            if (contadores[i] == 0) {
                contadores[i - 1]++
                    if (contadores[i - 1] > materias[i - 1].horarios.length) {
                        contadores[i - 1] = 0
                        continue
                    }
                break
            } else {
                break
            }
        }
    }
    //console.log(horariosFinal)
    nombres = []
    for (let i = 0; i < materias.length; i++) {
        nombres.push(materias[i].nombre)
    }
    MostrarResultados(horariosFinal, nombres)
}

function MostrarResultados(h, n) {
    document.getElementById("resultados").innerHTML = ""
        //horario materia dias dia/hora/carga horaria
    console.log(h)
    nombreDias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
        //console.log(n)
    var horariosTextos = new Array(h.length)
    for (let i = 0; i < h.length; i++) {

        var texto = ""
        for (let j = 0; j < h[i].length; j++) {
            texto += `${n[j]}: `
            for (let k = 0; k < h[i][j][0].length; k++) {
                texto += `${nombreDias[h[i][j][0][k][0]-1]}:`
                texto += `${h[i][j][0][k][1]} Duracion: ${h[i][j][0][k][2]}/ `
            }
            texto += '\n'
        }
        horariosTextos[i] = texto
        $("#resultados").append(`<p class="respuesta">${texto}</p>`)
    }
    console.log(horariosTextos)

}

function CumpleCondiciones(h) {
    var horariotext = []
    var duraciones = []
    var horas = []
    var dias = []
    for (let i = 0; i < h.length; i++) {
        for (let j = 0; j < h[i][0].length; j++) {
            var fecha = ""
            for (let k = 0; k < h[i][0][j].length - 1; k++) { // -1 para que no tome la duracion
                fecha += h[i][0][j][k]

            }
            dias.push(parseInt(h[i][0][j][0]))
            horas.push(parseFloat(h[i][0][j][1]))
            duraciones.push(parseFloat(h[i][0][j][2]))
            horariotext.push(fecha)

        }

    }
    //console.log(horas, duraciones)
    var horariossinrepetir = [...new Set(horariotext)]
    if (horariotext.length == horariossinrepetir.length) {
        //console.log("hola")
        for (var i = 0; i < horariotext.length; i++) {
            for (var j = 0; j < horariotext.length; j++) {
                if (i == j || dias[i] != dias[j]) continue
                var menorHorario = horas[i] > horas[j] ? j : i
                var mayorHorario = horas[i] > horas[j] ? i : j
                if (horas[menorHorario] + duraciones[menorHorario] > horas[mayorHorario]) return false
            }
        }
        return true
    } else {
        return false
    }

}