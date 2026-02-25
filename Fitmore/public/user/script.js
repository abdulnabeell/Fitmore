document.addEventListener('DOMContentLoaded', () => {
    // Flash Sales Countdown
    const flashSalesEndDate = new Date();
    flashSalesEndDate.setDate(flashSalesEndDate.getDate() + 3); // 3 days from now

    function updateFlashCountdown() {
        const now = new Date();
        const diff = flashSalesEndDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('flash-days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('flash-hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('flash-minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('flash-seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    // Promo Banner Countdown
    const promoEndDate = new Date();
    promoEndDate.setDate(promoEndDate.getDate() + 5);

    function updatePromoCountdown() {
        const now = new Date();
        const diff = promoEndDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Assuming similar IDs for promo timer if we attach them in HTML
        const promoDays = document.querySelector('.promo-timer .timer-circle:nth-child(2) .time-val');
        const promoHours = document.querySelector('.promo-timer .timer-circle:nth-child(1) .time-val');
        // Note: The screenshot visual order was 23 hours, 05 days... wait. 
        // Screenshot says: 23 Hours, 05 Days, 59 Minutes, 35 Seconds. 
        // That's unusual ordering (Hours, Days, Min, Sec). I'll respect the HTML structure I built.

        // In my HTML build, I ordered them: Hours, Days, Minutes, Seconds based on the screenshot text provided in previous step?
        // Let's check the React code I wrote for PromoBanner:
        // Value 23 -> Label Hours
        // Value 05 -> Label Days
        // Value 59 -> Label Minutes
        // Value 35 -> Label Seconds
        // So yes, the order is Hours, Days, Minutes, Seconds.

        if (promoHours) promoHours.innerText = hours < 10 ? '0' + hours : hours;
        if (promoDays) promoDays.innerText = days < 10 ? '0' + days : days;
        const promoMinutes = document.querySelector('.promo-timer .timer-circle:nth-child(3) .time-val');
        const promoSeconds = document.querySelector('.promo-timer .timer-circle:nth-child(4) .time-val');

        if (promoMinutes) promoMinutes.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (promoSeconds) promoSeconds.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    setInterval(updateFlashCountdown, 1000);
    setInterval(updatePromoCountdown, 1000);

    updateFlashCountdown();
    updatePromoCountdown();
});
