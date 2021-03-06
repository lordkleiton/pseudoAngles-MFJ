'use strict'

let maxWH = 300;                                            //largura e altura da caixa em px
let maxVec = 2                                              //maximo de vetores
let canvas = document.getElementById('cv')                  //canvas
let btnZero = document.getElementById('zera')               //botão que zera
let btnClear = document.getElementById('limpa')             //botão que limpa
let btnVector = document.getElementById('vetor')            //botão que desenha até o vetor
let pri = document.getElementById('p')                      //texto
let seg = document.getElementById('s')                      //texto
let dif = document.getElementById('d')                      //texto
let ctx = canvas.getContext('2d')                           //contexto
let centerX = canvas.clientWidth / 2                        //centro em x
let centerY = canvas.clientHeight / 2                       //centro em y
let padding = (canvas.clientWidth - maxWH) / 2              //distancia das bordas ao quadrado
let min = centerX - (maxWH / 2)                             //distancia minima
let max = centerX + (maxWH / 2)                             //distancia maxima
let oct = 0                                                 //octante
let vectors = []                                            //guarda os vetores

canvas.addEventListener('mousemove', drawToMouse)
canvas.addEventListener('click', click)
btnZero.addEventListener('click', zero)
btnClear.addEventListener('click', clear)
btnVector.addEventListener('click', drawToVector)

ctx.fillStyle = 'black'
drawGrid()

function clearText(){
    pri.innerText = ''
    seg.innerText = ''
    dif.innerText = ''
}

function updateText(){
    clearText()

    pri.innerText = 'angulo do ponto a: ' + vectors[0].a
    if (vectors.length > 1){
        let d = (vectors[0].a > vectors[1].a) ? vectors[0].a - vectors[1].a : vectors[1].a - vectors[0].a
        seg.innerText = 'angulo do ponto b: ' + vectors[1].a
        dif.innerText = 'diferença entre a e b: ' + d
    }
}

function click(e){
    if (vectors.length >= maxVec) return
    else{
        let n = normalizeXY(e.clientX, e.clientY, padding, maxWH)
        let r = restoreXY(n.x, n.y, padding, maxWH)
        let o = octant(n.x, n.y)
        let angulo

        ctx.beginPath();
		ctx.arc(r.x, r.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        n = normalizeInterval(n.x, n.y)

        if (o === 0 || o === 3 || o === 4 || o === 7) {
            if (o === 0)            angulo = n.y
            if (o === 3 || o == 4)  angulo = 4 - n.y
            if (o === 7)            angulo = 8 + n.y
        }
        else {
            if (o === 1 || o === 2) angulo = 2 - n.x
            if (o === 5 || o === 6) angulo = 6 + n.x
        }

        vectors.push({ x: r.x, y: r.y, o: o, a: angulo})
    }
    drawToVector()
}

function drawVectors(){
    if (!vectors.length) return
    else{
        for (let i = 0; i < vectors.length; i++){
            ctx.beginPath();
            ctx.arc(vectors[i].x, vectors[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(vectors[i].x, vectors[i].y)
            ctx.stroke()
        }
    }
}

function normalizeXY(_x, _y, _padding, _maxWH){
    let x = _x
    let y = _y

    x = (x - padding) / maxWH
    if (x < 0) x = 0
    if (x > 1) x = 1
    
    y = (y - padding) / maxWH
    if (y < 0) y = 0
    if (y > 1) y = 1

    return {x: x, y: y}
}

function restoreXY(_x, _y, _padding, _maxWH){
    let x = _x
    let y = _y

    x = x * maxWH + padding
    y = y * maxWH + padding

    return {x: x, y: y}
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()
}

function clear(){
    vectors = []
    redraw()
    clearText()
}

function normalizeInterval(x, y){
    return {x: x * 2 - 1, y: 1 - y * 2}
}

function octant(x, y){
    let n = normalizeInterval(x, y)
    let cx = n.x
    let cy = n.y

    if (cx >= 0){
        if (cy >= 0){
            if (cx > cy) return 0
            else return 1
        }
        else{
            if (cx < -cy) return 6
            else return 7
        }
    }
    else{
        if (cy >= 0){
            if (-cx < cy) return 2
            else return 3
        }
        else{
            if (cx < cy) return 4
            else return 5
        }
    }
}

function drawToVector(){
    if (!vectors.length) return 1

    redraw()

    if (vectors.length === 1){
        drawAngle(vectors[0].x, vectors[0].y, vectors[0].o, (vectors[0].o % 2 !== 0), 'red')
    }
    else {
        let equal = vectors[0].o === vectors[1].o
        let maior
        let menor
        let o = (equal) ? vectors[0].o : ''

        if (!equal){
            menor = (vectors[0].o < vectors[1].o) ? 0 : 1
            maior = (vectors[0].o > vectors[1].o) ? 0 : 1
        }
        else{
            if (vectors[0].x === vectors[1].x){
                menor = (vectors[0].y < vectors[1].y) ? 0 : 1
                maior = (vectors[0].y > vectors[1].y) ? 0 : 1
            }
            else{
                menor = (vectors[0].x < vectors[1].x) ? 0 : 1
                maior = (vectors[0].x > vectors[1].x) ? 0 : 1           
            }
        }

        if (!equal){
            drawAngle(vectors[maior].x, vectors[maior].y, vectors[maior].o, (vectors[maior].o % 2 !== 0), 'red')
            drawAngle(vectors[menor].x, vectors[menor].y, vectors[menor].o, (vectors[menor].o % 2 !== 0), 'black')
        }
        else{
            if (o === 0 || o === 1 || o === 2 || o == 7){
                drawAngle(vectors[menor].x, vectors[menor].y, vectors[menor].o, (vectors[menor].o % 2 !== 0), 'red')
                drawAngle(vectors[maior].x, vectors[maior].y, vectors[maior].o, (vectors[maior].o % 2 !== 0), 'black')
            }
            else{
                drawAngle(vectors[maior].x, vectors[maior].y, vectors[maior].o, (vectors[maior].o % 2 !== 0), 'red')
                drawAngle(vectors[menor].x, vectors[menor].y, vectors[menor].o, (vectors[menor].o % 2 !== 0), 'black')
            }
        }
    }

    updateText()

    return 0
}

function drawToMouse(e){
    if (vectors.length >= maxVec) {
        drawToVector()
        return
    }
    redraw()

    let n = normalizeXY(e.clientX, e.clientY, padding, maxWH)
    let r = restoreXY(n.x, n.y, padding, maxWH)
    let o = octant(n.x, n.y)

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(r.x, r.y)
    ctx.stroke()

    drawAngle(r.x, r.y, o, (o % 2 !== 0), 'red')
}

function zero(){
    if (vectors.length < maxVec) vectors.push({x: centerX, y: centerY, oct: 0})
    drawAngle(centerX, centerY, 0, true, 'red')
    redraw()
}

function drawAngle(x, y, oct, comp, color){
    ctx.strokeStyle = color
    ctx.beginPath()

    if (oct === 0){
        if (!comp){
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, y)
        }
        else{
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, min)
        }
    }
    if (oct > 0) {
        drawAngle(x, y, 0, true, color)

        if (comp){
            ctx.moveTo(max, min)
            ctx.lineTo(x, min)
        }
        else{
            ctx.moveTo(max, min)
            ctx.lineTo(centerX, min)
        }
    }
    if (oct > 1) {
        drawAngle(x, y, 1, false, color)

        if (!comp){
            ctx.moveTo(max, min)
            ctx.lineTo(x, min)
        }
        else{
            ctx.beginPath()
            ctx.moveTo(centerX, min)
            ctx.lineTo(min, min)
        }
    }
    if (oct > 2) {
        drawAngle(x, y, 2, true, color)

        if (comp) {
            ctx.moveTo(min, min)
            ctx.lineTo(min, y)
        }
        else {
            ctx.moveTo(min, min)
            ctx.lineTo(min, centerY)
        }
    }
    if (oct > 3) {
        drawAngle(x, y, 3, false, color)

        if (!comp) {
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, y)
        }
        else {
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, max)
        }
    }
    if (oct > 4) {
        drawAngle(x, y, 4, true, color)

        if (comp) {
            ctx.moveTo(min, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.moveTo(min, max)
            ctx.lineTo(centerX, max)
        }
    }
    if (oct > 5) {
        drawAngle(x, y, 5, false, color)

        if (!comp) {
            ctx.moveTo(centerX, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.moveTo(centerX, max)
            ctx.lineTo(max, max)
        }
    }
    if (oct > 6) {
        drawAngle(x, y, 6, true, color)

        if (comp) {
            ctx.moveTo(max, max)
            ctx.lineTo(max, y)
        }
    }

    ctx.stroke()
}

function drawGrid(){
    ctx.strokeStyle = '#ccc'
    ctx.beginPath();
    ctx.moveTo(min, min)
    ctx.lineTo(max, min)
    ctx.lineTo(max, max)
    ctx.lineTo(min, max)
    ctx.lineTo(min, min)
    ctx.moveTo(min - 20, centerY)
    ctx.lineTo(max + 20, centerY)
    ctx.moveTo(centerX, min - 20)
    ctx.lineTo(centerX, max + 20)
    ctx.stroke()
}

function redraw(){
    clearCanvas()
    drawGrid()
    drawVectors()
}