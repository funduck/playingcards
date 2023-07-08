function getPx(str) {
    return parseFloat(str.match(/(\d+\.?\d*)px/)[1]);    
}

function getSize(str) {
    const [_, size, unit] = str.match(/(\d+\.?\d*)(\w+)/);
    return {size: parseFloat(size), unit};
}

function multiplySize(str, scale) {
    const {size,unit} = getSize(str);
    return `${parseFloat(size)*scale}${unit}`;
}

const zoomedSet = new Set();

function zoom(el,scale) {
    if (!el.style.width || zoomedSet.has(el)) return;
    zoomedSet.add(el);
    el.style.width = multiplySize(el.style.width,scale);
    el.style.height = multiplySize(el.style.height,scale);
    el.childNodes.forEach(child => {
        zoom(child,scale);
    });
}

function moveIn(el) {
    if (el.classList.contains('MovedIn')) return;
    
    const {left, top, right, bottom} = el.getBoundingClientRect();   
    const {innerWidth, innerHeight} = window;
    // if (left < 0) el.style.left = `0px`;
    // if (top < 0) el.style.top = `0px`;
    if (right > innerWidth) el.style.left = `${innerWidth - right}px`;
    if (bottom > innerHeight) el.style.top = `${innerHeight - bottom}px`;
    el.style.zIndex = 100;
    
    el.classList.add('MovedIn');
}

function moveOut(el) {
    el.classList.remove('MovedIn');
    el.style.left = '';
    el.style.right = '';
    el.style.top = '';
    el.style.bottom = '';
    el.style.zIndex = '';
}

function zoomIn(scale) {
    [...document.querySelectorAll( ":hover" )]
    .filter(el => el.classList.contains('Token'))
    .forEach(el => {
        zoom(el,scale);
        moveIn(el);
    });
}

function zoomOut(scale) {
    [...zoomedSet].forEach(el => {
        zoomedSet.delete(el);
        el.style.width = multiplySize(el.style.width,1/scale);
        el.style.height = multiplySize(el.style.height,1/scale);
        moveOut(el);
    });
}

const zoomLevel = 3;
const zoomAllLevel = 2;
const zoomKey = 'z';
const zoomAllKey = 'Z';
let zoomed = false;
let zoomedAll = false;

function zoomAll(scale) {
    document.body.style.zoom = `${parseInt(100 * scale, 10)}%`;
    if (scale != 1) {
        document.getElementsByTagName('html')[0].style.overflow = 'scroll'
        document.getElementsByClassName('ToolBoxToast')[0].style.display = 'none'
    } else {
        // document.getElementsByTagName('html')[0].style.overflow = ''
        document.getElementsByClassName('ToolBoxToast')[0].style.display = ''
    }
}

document.addEventListener('keydown', event => {
    if (event.key === zoomKey) {
        if (!zoomed) {
            zoomIn(zoomLevel);
            zoomed = true;
        } else {
            zoomOut(zoomLevel);
            zoomed = false;
        }
    }
    if (event.key === zoomAllKey) {
        if (!zoomedAll) {
            zoomAll(zoomAllLevel);
            zoomedAll = true;
        } else {
            zoomAll(1);
            zoomedAll = false;
        }
    }
});

