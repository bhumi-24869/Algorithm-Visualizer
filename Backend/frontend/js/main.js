
import * as THREE from
    'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';


// 1. Get the canvas
const canvas = document.getElementById("particle-canvas");


// 2. Create the scene
const scene = new THREE.Scene();


// 3. Create the camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 12;


// 4. Create the renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// 5. Create a group for particles
const particleGroup = new THREE.Group();

scene.add(particleGroup);


// 6. Particle settings
const particleCount =
    window.innerWidth < 768 ? 450 : 1000;

const positions = new Float32Array(particleCount * 3);

const originalPositions = new Float32Array(particleCount * 3);

const colors = new Float32Array(particleCount * 3);


// 7. Create random particles
for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3;

    const x = (Math.random() - 0.5) * 25;
    const y = (Math.random() - 0.5) * 15;
    const z = (Math.random() - 0.5) * 15;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    originalPositions[i3] = x;
    originalPositions[i3 + 1] = y;
    originalPositions[i3 + 2] = z;


    // Purple and blue colours
    const colorChoice = Math.random();

    if (colorChoice < 0.5) {

        colors[i3] = 0.55;
        colors[i3 + 1] = 0.25;
        colors[i3 + 2] = 1.0;

    } else {

        colors[i3] = 0.2;
        colors[i3 + 1] = 0.65;
        colors[i3 + 2] = 1.0;

    }

}


// 8. Create particle geometry
const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
);


// 9. Create particle material
const material = new THREE.PointsMaterial({

    size: 0.045,

    vertexColors: true,

    transparent: true,

    opacity: 0.8,

    blending: THREE.AdditiveBlending,

    depthWrite: false

});


// 10. Create the particle system
const particles = new THREE.Points(geometry, material);

particleGroup.add(particles);


// 11. Mouse position
let mouseX = 1000;
let mouseY = 1000;


// 12. Detect mouse movement
window.addEventListener("mousemove", (event) => {

    mouseX =
        (event.clientX / window.innerWidth - 0.5) * 25;

    mouseY =
        -(event.clientY / window.innerHeight - 0.5) * 15;

});


// 13. Reset mouse position when it leaves the page
window.addEventListener("mouseout", (event) => {

    if (!event.relatedTarget) {
        mouseX = 1000;
        mouseY = 1000;
    }

});


// 14. Animation
function animate() {

    requestAnimationFrame(animate);

    const positionAttribute =
        geometry.attributes.position;

    const currentPositions = positionAttribute.array;


    for (let i = 0; i < particleCount; i++) {

        const i3 = i * 3;

        let x = currentPositions[i3];
        let y = currentPositions[i3 + 1];
        let z = currentPositions[i3 + 2];

        const originalX = originalPositions[i3];
        const originalY = originalPositions[i3 + 1];
        const originalZ = originalPositions[i3 + 2];


        // Distance between particle and mouse
        const dx = x - mouseX;
        const dy = y - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);


        // Particles move away from mouse
        if (distance < 3) {

            const force = (3 - distance) / 3;

            x += (dx / (distance + 0.1)) * force * 0.08;

            y += (dy / (distance + 0.1)) * force * 0.08;

        }


        // Slowly return to original position
        x += (originalX - x) * 0.015;

        y += (originalY - y) * 0.015;

        z += (originalZ - z) * 0.015;


        // Update particle position
        currentPositions[i3] = x;

        currentPositions[i3 + 1] = y;

        currentPositions[i3 + 2] = z;

    }


    // Tell Three.js that positions changed
    positionAttribute.needsUpdate = true;


    // Slow 3D rotation
    particleGroup.rotation.y += 0.0005;

    particleGroup.rotation.x += 0.0002;


    // Render scene
    renderer.render(scene, camera);

}


// 15. Handle browser resizing
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

});


// 16. Start animation
animate();
