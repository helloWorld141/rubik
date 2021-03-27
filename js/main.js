let container;
let camera, scene, renderer;
let mousedown = false, mouseup = false, mousedrag = false;
let rpp = Math.PI / 180; // radian per pixel
let d = 10;
let cubeDim = 1;
let n = 3; // dimension of rubik => number of cubes = n**3
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
    const commonAttr = {side: THREE.DoubleSide, vertexColors: false};
    const material = [
        new THREE.MeshBasicMaterial({color:'red', ...commonAttr}),
        new THREE.MeshBasicMaterial({color:0x00ff00, ...commonAttr}),
        new THREE.MeshBasicMaterial({color:0x0000ff, ...commonAttr}),
        new THREE.MeshBasicMaterial({color:0xffff00, ...commonAttr}),
        new THREE.MeshBasicMaterial({color:'white',  ...commonAttr}),
        new THREE.MeshBasicMaterial({color:0x00ffff, ...commonAttr}),
    ];
    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );

    const rubik = new THREE.Group();
    for (let idx=0; idx<27; idx++) {
        const cube = new THREE.Mesh(geometry, material);
        const edgesMaterial = new THREE.LineBasicMaterial( { color: 'black', linewidth: 10 } );
        const edges = new THREE.EdgesGeometry(cube.geometry);
        const edgesSegment = new THREE.LineSegments(edges, edgesMaterial);
        cube.add(edgesSegment);
        const [i, j, k] = one2three(idx, n);
        pos = cubePositionToVector3(i, j, k, n, cubeDim);
        cube.position.set(...pos);
        rubik.add(cube);
    }
    scene.add(rubik);


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
            // Let R be the camera vector. Rxy is the projection of R on plane Oxy
            const dPhi = rpp * e.movementX; // angle between Rxy and Ox
            const dTheta = rpp * e.movementY; // angle between R and Oz
            const R = camera.position.sub(rubik.position); // relative position of camera to cube
            const r = R.length();
            let theta = Math.acos(R.y / r);
            let phi = Math.atan2(R.x, R.z)
            // theta = Math.min(Math.max(theta - dTheta, 0), Math.PI);
            theta = theta - dTheta;
            phi = phi - dPhi;
            camera.position.z = r * Math.sin(theta) * Math.cos(phi);
            camera.position.x = r * Math.sin(theta) * Math.sin(phi);
            camera.position.y = r * Math.cos(theta);

            camera.lookAt(rubik.position);
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