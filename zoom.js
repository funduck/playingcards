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
    const box = document.getElementsByClassName('Table__board')[0].getBoundingClientRect();

    if (left < box.left) el.style.left = `${box.left}px`;
    if (top < box.top) el.style.top = `${box.top}px`;
    if (right > box.right) el.style.left = `${box.right - right}px`;
    if (bottom > box.bottom) el.style.top = `${box.bottom - bottom}px`;
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

function lockDraggable() {
    const el = [...document.querySelectorAll( ":hover" )]
    .find(el => el.classList.contains('Token'));
    Object.keys(el).filter(key => key.match(/__reactEventHandlers/)).forEach(key => {
        if (el[key].onMouseDown) {
            el[key].__onMouseDown = el[key].onMouseDown;
            el[key].onMouseDown = undefined;
        } else {
            el[key].onMouseDown = el[key].__onMouseDown;
        }
    })
}

const zoomLevel = 3;
const zoomKey = 'z';
let zoomed = false;
const lockKey = 'l';

document.addEventListener('keydown', event => {
    if (event.shiftKey && event.code.match(/Digit[0-9]/)) {
        const level = parseInt(event.code.match(/Digit([0-9])/)[1], 10);
        zoomAll(level);
    }
    if (event.key === zoomKey) {
        if (!zoomed) {
            zoomIn(zoomLevel);
            zoomed = true;
        } else {
            zoomOut(zoomLevel);
            zoomed = false;
        }
    }
    if (event.key === lockKey) {
        lockDraggable();
    }
});
