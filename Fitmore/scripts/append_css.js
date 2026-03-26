const fs = require('fs');

const mediaQueries = `

/* =========================================
   GLOBAL RESPONSIVENESS (MOBILE & TABLET)
========================================= */

@media (max-width: 1024px) {
    .cat-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .prod-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .hero-content h1 {
        font-size: 3.5rem !important;
    }
    .footer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

@media (max-width: 768px) {
    .hero-layout, .muscle-grid, .arrival-grid {
        grid-template-columns: 1fr !important;
        text-align: center;
    }
    
    .footer-grid {
        grid-template-columns: 1fr !important;
        text-align: center;
    }
    
    .cat-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .prod-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }

    .hero-content h1 {
        font-size: 2.5rem !important;
    }
    
    .stats {
        flex-direction: column !important;
        gap: 1.5rem !important;
    }

    .featured-arrival {
        flex-direction: column !important;
        text-align: center;
    }
    
    .featured-img, .featured-txt {
        width: 100% !important;
    }
    
    .section-title {
        font-size: 2rem !important;
    }
}

@media (max-width: 480px) {
    .cat-grid, .prod-grid {
        grid-template-columns: 1fr !important;
    }
    .small-arrivals {
        grid-template-columns: 1fr !important;
    }
}
`;

fs.appendFileSync('public/user/style.css', mediaQueries);
console.log('Appended global responsiveness media queries to style.css');
