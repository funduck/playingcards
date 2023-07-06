function multiply(str, scale) {
    const [_,size,unit] = str.match(/(\d+\.?\d*)(\w+)/);
    return `${parseFloat(size)*scale}${unit}`;
}

function zoom(el,scale) {
    const className = `Zoomed${scale}`;
    if (!el.style.width || el.classList.contains(className)) return;
    el.style.width = multiply(el.style.width,scale);
    el.style.height = multiply(el.style.height,scale);
    el.classList.add(className);
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
    el.classList.add('MovedIn');
}

function moveOut(el) {
    el.classList.remove('MovedIn');
    el.style.left = '';
    el.style.right = '';
    el.style.top = '';
    el.style.bottom = '';
}

function zoomIn(scale) {
    [...document.querySelectorAll( ":hover" )].filter(el => el.classList.contains('Token')).forEach( el => {
        zoom(el,scale);
        moveIn(el);
    });
}

function zoomOut(scale) {
    const className = `Zoomed${scale}`;
    [...document.getElementsByClassName(className)].forEach(el => {
        if (!el.style || !el.style.width || !el.classList.contains(className)) return;
        el.style.width = multiply(el.style.width,1/scale);
        el.style.height = multiply(el.style.height,1/scale);
        el.classList.remove(className);
        
        moveOut(el);
    });
}

const zoomLevel = 3;
const zoomKey = 'z';

document.addEventListener('keydown', event => {
    if (event.key === zoomKey) {
        zoomIn(zoomLevel);
    }
});
document.addEventListener('keyup', event => {
    if (event.key === zoomKey) {
        zoomOut(zoomLevel);
    }
});
