import { Modal } from 'bootstrap';
import dayjs from "dayjs";

export function setScrollbarWidthCssVar () {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
}


export function closeModal (modalId) {
    const modalEl = $(modalId).get(0);
    if (!modalEl) return Promise.resolve();

    return new Promise((resolve, reject) => {
        let modalInstance = Modal.getInstance(modalEl);
        if (!modalInstance) {
            modalInstance = new Modal(modalEl);
        }
        modalEl.addEventListener(
            'hidden.bs.modal', 
            () => resolve(),
            { once: true }
        )
        modalInstance.hide()
    })
}

export function showModal (modalId) {
    const modalEl = $(modalId).get(0);
    if (!modalEl) return Promise.resolve();

    return new Promise((resolve, reject) => {
        let modalInstance = Modal.getInstance(modalEl);
        if (!modalInstance) {
            modalInstance = new Modal(modalEl);
        }
        modalEl.addEventListener(
            'shown.bs.modal', 
            () => resolve(),
            { once: true }
        )
        modalInstance.show()
    })
}

export function toggleModal (modalId) {
    const modalEl = $(modalId).get(0);
    if (!modalEl) return;

    let modalInstance = Modal.getInstance(modalEl);
    if (!modalInstance) {
        modalInstance = new Modal(modalEl);
    }
    modalInstance.toggle()
}

export function formatISODate (timestamp = (new Date()).toISOString(), formattingToken = 'YYYY-MM-DD') {
    return dayjs(timestamp).format(formattingToken)
}

export function hexToRGB (hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (typeof alpha !== 'undefined') {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export function getAdjustedImageLink (imagePath) {
    if (process.env.NODE_ENV === 'production') return '/taylorsphere/storage' + imagePath;
    return imagePath;
}