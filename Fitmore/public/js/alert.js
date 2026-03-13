/**
 * Custom Alert System using SweetAlert2
 * Theme: Dark Mode (#0b0b0b) with Red Accent (#ff1e1e)
 */

// Common configuration for all alerts
const commonConfig = {
    background: '#0b0b0b',
    color: '#ffffff',
    confirmButtonColor: '#ff1e1e',
    cancelButtonColor: '#333333',
    buttonsStyling: true,
    customClass: {
        popup: 'premium-alert-popup',
        title: 'premium-alert-title',
        confirmButton: 'premium-alert-confirm',
        cancelButton: 'premium-alert-cancel'
    }
};

// Inject Custom Styles for SweetAlert2
const style = document.createElement('style');
style.innerHTML = `
    .premium-alert-popup {
        border: 1px solid rgba(255, 30, 30, 0.2) !important;
        box-shadow: 0 0 20px rgba(255, 30, 30, 0.1) !important;
        border-radius: 12px !important;
    }
    .premium-alert-title {
        font-family: 'Oswald', sans-serif !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
    }
    .premium-alert-confirm {
        font-family: 'Inter', sans-serif !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        padding: 12px 24px !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 4px 15px rgba(255, 30, 30, 0.3) !important;
    }
    .premium-alert-cancel {
        font-family: 'Inter', sans-serif !important;
        font-weight: 500 !important;
        color: #ffffff !important;
    }
    div:where(.swal2-container) h2:where(.swal2-title) {
        color: #ffffff !important;
    }
    div:where(.swal2-icon).swal2-error {
        border-color: #ff1e1e !important;
        color: #ff1e1e !important;
    }
    div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line] {
        background-color: #ff1e1e !important;
    }
    div:where(.swal2-icon).swal2-success {
        border-color: #ff1e1e !important;
        color: #ff1e1e !important;
    }
    div:where(.swal2-icon).swal2-success [class^=swal2-success-line] {
        background-color: #ff1e1e !important; 
    }
    div:where(.swal2-icon).swal2-success .swal2-success-ring {
        border: .25em solid rgba(255, 30, 30, 0.3) !important;
    }
`;
document.head.appendChild(style);

/**
 * Success Alert
 * @param {string} message 
 */
function successAlert(message) {
    return Swal.fire({
        ...commonConfig,
        icon: 'success',
        title: 'SUCCESS',
        text: message,
        timer: 2000,
        showConfirmButton: false
    });
}

/**
 * Error Alert
 * @param {string} message 
 */
function errorAlert(message) {
    return Swal.fire({
        ...commonConfig,
        icon: 'error',
        title: 'ERROR',
        text: message,
        confirmButtonText: 'OK'
    });
}

/**
 * Confirmation Alert
 * @param {string} message 
 * @param {function} onConfirm 
 */
function confirmAlert(message, onConfirm) {
    Swal.fire({
        ...commonConfig,
        icon: 'warning',
        title: 'ARE YOU SURE?',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'YES, PROCEED',
        cancelButtonText: 'CANCEL'
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        }
    });
}

/**
 * Toast Notification (Top Right)
 * @param {string} message 
 * @param {string} icon 'success', 'error', 'warning', 'info'
 */
function toastAlert(message, icon = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#151515',
        color: '#ffffff',
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: icon,
        title: message
    });
}
