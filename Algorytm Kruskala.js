const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const w=512
const h=512

const rand = Math.random
const dist = (x,y)=>Math.sqrt(x*x+y*y)

let RADIUS = 10
let STROKE = 3
let points = []
let velocities = []

function getDistances(points){
    let distances = []
    let point1
    let point2
    for(let i = 0; i<points.length; i++){
        point1 = points[i]
        for(let j = 0; j<i; j++){
            point2 = points[j]
            distances.push({
                a:i,
                b:j,
                distance:dist(point1[0]-point2[0],point1[1]-point2[1])
            })
        }
    }
    return distances
}

function addRandomPoint(){
    velocities.push([rand(),rand()])
    points.push([rand()*w,rand()*h])
}

function physics(){
    for(let i = 0;i<points.length;i++){
        points[i][0]+=velocities[i][0]
        points[i][1]+=velocities[i][1]
        points[i][0]+=w
        points[i][1]+=h
        points[i][0]%=w
        points[i][1]%=h
    }
}

function draw(points,lines){
    ctx.clearRect(0,0,w,h)
    ctx.lineWidth = STROKE
    for(point of points){
        ctx.beginPath()
        ctx.arc(...point,RADIUS,0,Math.PI * 2)
        ctx.stroke()
    }
    for(line of lines){
        ctx.beginPath()
        ctx.moveTo(...points[line.a])
        ctx.lineTo(...points[line.b])
        ctx.stroke()
    }
}


function algorytmKruskala(nrOfPoints,lines){
    //lista krawędzi do której będziemy wybierali kolejne krawędzie z grafu
    let returnlines = []

    //algorytm kruskala jest algorytmem zachłannym, dlatego zawsze bierze najmniejszą możliwą wartość
    lines.sort((a,b)=>b.distance-a.distance)

    //na początku każdy punkt należy do drzewa mającego tylko ten punkt
    let drzewa = [...Array(nrOfPoints).keys()]
    while(!drzewa.every(a=>a==drzewa[0])){
        //pobieramy najmniejszą możliwą wartość
        let line = lines.pop()
        //sprawdzamy czy dana krawędz nie należy do tego samego drzewa, czyli czy nie utworzy nam cyklu
        if(drzewa[line.a]!=drzewa[line.b]){
            returnlines.push(line)

            //łączymy dwa osobne drzewa do których należą punkty
            let tochangevalue = drzewa[line.a]
            for(id in drzewa){
                if(drzewa[id]==tochangevalue){
                    drzewa[id]=drzewa[line.b]
                }
            }
        }
    }
    return returnlines
}


function setup(){
    for (let i = 0; i < 50; i++) {
        addRandomPoint()
    }
}
setup()

function tick(){
    physics()
    let lines = getDistances(points)
    lines = algorytmKruskala(points.length,lines)
    draw(points,lines)
}

const fps=60
mainLoop=setInterval(tick,1000/fps)
