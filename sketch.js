const canvasSketch = require('canvas-sketch');
const {
    renderPolylines
} = require('canvas-sketch-util/penplot');
const {
    clipPolylinesToBox
} = require('canvas-sketch-util/geometry');

const settings = {
    dimensions: 'A4',
    // dimensions: [ 15, 15 ],
    orientation: 'landscape',
    pixelsPerInch: 300,
    scaleToView: true,
    units: 'cm',
};

const sketch = ({
    width,
    height
}) => {
    // List of polylines for our pen plot
    let lines = [];

    let resolution = 360 * 12; // points to draw per 360 degrees
    let turns = 12; // number of full rotations
    // spiral constant
    // let a = (Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 0.5) / (turns * Math.PI * 2);
    // let a = (Math.max(canvas.width, canvas.height) * 1.0) / (turns * Math.PI * 2);
    let a = (Math.min(width, height) * 0.5) / (turns * Math.PI * 2);
    a *= 0.9;

    let randomStartRotation = Math.PI * 0.25;//Math.random() * Math.PI * 2;

    let total_pts = turns * resolution;
    let angle_diff = (Math.PI * 2) / resolution;
    [0, 1].forEach(d => {
        // ctx.save();
        // ctx.rotate(Math.PI * d);
        let direction = Math.PI * d;
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        let line = [];
        for (let i = 0; i < total_pts; i++) {
            // archimedes' spiral:
            // r = aθ
            let angle = i * angle_diff;
            let radius = a * angle;
            // sub wave
            // let subwave = Math.sin(i * 0.1) * (a * 1.0); // sunflower look
            {
                // x = r × cos( θ )
                // y = r × sin( θ )
                let peace_switch = 0.5;
                let peace_symbol_angles = [
                    Math.PI * 1.5,
                    Math.PI * 0.5,
                    Math.PI * 1.25,
                    Math.PI * 1.75
                    // Math.PI * 0.25,
                    // Math.PI,
                    // Math.PI * -0.25
                ];
                peace_symbol_angles.forEach(peace => {
                    let tmp_x = radius * Math.cos(angle + direction + randomStartRotation + peace);
                    let tmp_y = radius * Math.sin(angle + direction + randomStartRotation + peace);
                    if (tmp_y < 0) {
                        // let tmp_switch = Math.abs(tmp_x * 2) % 2 < 1 ? 0.5 : 0;
                        // let tmp_switch2 = (Math.sin(tmp_x * 4) + 1) / 4;
                        let line_width = width * 0.029;
                        tmp_x = Math.abs(tmp_x);
                        tmp_x = Math.max(tmp_x - line_width, 0);
                        let tmp_switch = Math.min(tmp_x, 0.5);
                        peace_switch = Math.min(peace_switch, tmp_switch);
                    }
                });
                let peace_ring = radius < width * 0.249 ? 0.5 : 0.0;
                peace_switch = Math.min(peace_switch, peace_ring);
                // let tmp_x = radius * Math.cos(angle + direction + randomStartRotation);
                // // let tmp_switch = Math.abs(tmp_x * 2) % 2 < 1 ? 0.5 : 0;
                // // let tmp_switch2 = (Math.sin(tmp_x * 4) + 1) / 4;
                // let line_width = width * 0.05;
                // tmp_x = Math.abs(tmp_x);
                // tmp_x = Math.max(tmp_x - line_width, 0);
                // let tmp_switch = Math.min(tmp_x, 0.5);
                let c = 2 * Math.PI * radius; // circumference
                let f = c * 4; // frequency
                let subwave = Math.sin((angle * f)) * (a * 1.0); // sunflower look
                subwave *= Math.pow(Math.sin(angle + (Math.PI * peace_switch)), 2); // CD shimmer effect
                // subwave *= Math.min(radius / (a * Math.PI * 5), 1.0); // no wave at center
                subwave *= radius < (a * Math.PI * 3) ? 0 : 1;
                radius += subwave;
            }
            // polar to cartesian
            let x = radius * Math.sin(angle + direction + randomStartRotation);
            let y = radius * Math.cos(angle + direction + randomStartRotation);
            // draw
            // ctx.lineTo(x, y);
            line.push([
                (width / 2) + x,
                (height / 2) + y
            ])

        }
        lines.push(line);
        // ctx.stroke();
        // ctx.restore();
    });
    /*
    // Draw some circles expanding outward
    const steps = 5;
    const count = 20;
    const spacing = Math.min(width, height) * 0.05;
    const radius = Math.min(width, height) * 0.25;
    for (let j = 0; j < count; j++) {
      const r = radius + j * spacing;
      const circle = [];
      for (let i = 0; i < steps; i++) {
        const t = i / Math.max(1, steps - 1);
        const angle = Math.PI * 2 * t;
        circle.push([
          width / 2 + Math.cos(angle) * r,
          height / 2 + Math.sin(angle) * r
        ]);
      }
      lines.push(circle);
    }
    */

    // Clip all the lines to a margin
    const margin = 1.0;
    const box = [margin, margin, width - margin, height - margin];
    lines = clipPolylinesToBox(lines, box);

    // The 'penplot' util includes a utility to render
    // and export both PNG and SVG files
    return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);