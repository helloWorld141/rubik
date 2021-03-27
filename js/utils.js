function cubePositionToVector3(i, j, k, n, side) {
    const x = (j- parseInt(n/2))*side;
    const y = -(i - parseInt(n/2))*side;
    const z = -(k - parseInt(n/2))*side;
    return [x, y, z];
}

function one2three(x, n) {
    const k = parseInt(x/(n**2));
    const p = x%(n**2);
    const j = p%n;
    const i = parseInt(p/n);
    return [i, j, k];
}