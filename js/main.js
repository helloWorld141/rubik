let container;
let camera, scene, renderer;
let mousedown = false, mouseup = false, mousedrag = false;
let rpp = Math.PI / 180; // radian per pixel
let d = 5;
const epsilon = 0.05;

////// entry point //////
init();
animate();


////// define functions /////
function init() {
    container = document.createElement('div');
    container.setAttribute('id', 'three_container');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = [
        new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({color:0x0000ff, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({color:0xffff00, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({color:0xff00ff, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({color:0x00ffff, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
    ];
    const cube = new THREE.Mesh(geometry, material);
    console.log(geometry);
    scene.add(cube);

    camera.position.z = d;


    //// add handlers ////
    // mouse interaction //
    container.addEventListener('mousedown', (e) => {
        mousedown = true;
        mouseup = false;
        console.log("Mouse down");
    });
    container.addEventListener('mouseup', (e) => {
        mouseup = true;
        mousedown = false;
        console.log("Mouse up");
    });
    container.addEventListener('mousemove', (e) => {
        if (mousedown) {
            console.log("Mouse dragged");
            mousedrag = true;
            /// change camera angle based on mouse movement ///
            // console.log(e.movementX, e.movementY);
            // Let R be the camera vector. Rxy is the projection of R on plane Oxy
            const dPhi = rpp * e.movementX; // angle between Rxy and Ox
            const dTheta = rpp * e.movementY; // angle between R and Oz
            const R = camera.position.sub(cube.position); // relative position of camera to cube
            const r = R.length();
            let theta = Math.acos(R.y / r);
            let phi = Math.atan2(R.x, R.z)
            theta = Math.min(Math.max(theta - dTheta, 0), Math.PI);
            phi = phi - dPhi;
            const spherical = THREE.Spherical(r, phi, theta);
            // camera.position.setFromSpherical(spherical);
            camera.position.z = r * Math.sin(theta) * Math.cos(phi);
            camera.position.x = r * Math.sin(theta) * Math.sin(phi);
            camera.position.y = r * Math.cos(theta);

            camera.lookAt(cube.position);
            console.log(camera.position);
        } else {
            mousedrag = false;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}