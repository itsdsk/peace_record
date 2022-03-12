'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let resolution = 360 * 12; // points to draw per 360 degrees
let turns = 5; // number of full rotations
// spiral constant
let a = (Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) * 0.5) / (turns * Math.PI * 2);
// let a = (Math.max(canvas.width, canvas.height) * 1.0) / (turns * Math.PI * 2);
a *= 1.0;

let randomStartRotation = Math.random() * Math.PI * 2;

function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // ctx.fillStyle = '#8AC926';
    // ctx.fillStyle = '#95eb0e';
    ctx.fillStyle = '#93e019';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    ctx.rotate((time * 0.00000125) + randomStartRotation);
    ctx.strokeStyle = '#000';


    let total_pts = turns * resolution;
    let angle_diff = (Math.PI * 2) / resolution;
    [0, 1].forEach(d => {
        ctx.save();
        ctx.rotate(Math.PI * d);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i < total_pts; i++) {
            // archimedes' spiral:
            // r = aθ
            let angle = i * angle_diff;
            let radius = a * angle;
            // sub wave
            // let subwave = Math.sin(i * 0.1) * (a * 1.0); // sunflower look
            {
                let c = 2 * Math.PI * radius; // circumference
                let f = c / 40; // frequency
                let subwave = Math.sin((angle * f) - (time * 0.0005)) * (a * 0.25); // sunflower look
                subwave *= Math.pow(Math.sin(angle), 2); // CD shimmer effect
                // subwave *= Math.min(radius / (a * Math.PI * 5), 1.0); // no wave at center
                subwave *= radius < (a * Math.PI * 3) ? 0 : 1;
                radius += subwave;
            }
            // polar to cartesian
            let x = radius * Math.sin(angle);
            let y = radius * Math.cos(angle);
            // draw
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    });
    ctx.restore();

    requestAnimationFrame(render);
}

requestAnimationFrame(render);