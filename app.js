// Save in Elkin NC - Interactive Features
// Main application JavaScript with mobile-first approach

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileNavigation();
    initSmoothScrolling();
    initSearchFilters();
    initGasFinder(); // New gas finder with external links
    initDealAlerts();
    initFavoritesSystem();
    initBackToTop();
    initEventCountdowns();
    initWeatherWidget();
    initServiceWorker();
    initAccessibilityFeatures();
});

// Mobile Navigation - Fixed
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    
    if (hamburger && nav) {
        // Remove any existing event listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.getElementById('hamburger');
        
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger clicked'); // Debug log
            
            newHamburger.classList.toggle('open');
            nav.classList.toggle('open');
            
            // Trap focus in navigation when open
            if (nav.classList.contains('open')) {
                trapFocus(nav);
            }
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target) && nav.classList.contains('open')) {
                newHamburger.classList.remove('open');
                nav.classList.remove('open');
            }
        });
        
        // Close nav when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                newHamburger.classList.remove('open');
                nav.classList.remove('open');
                newHamburger.focus();
            }
        });
        
        // Close nav when clicking on nav links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                newHamburger.classList.remove('open');
                nav.classList.remove('open');
            });
        });
    }
}

// Smooth Scrolling for Internal Links - Fixed
function initSmoothScrolling() {
    // Handle all anchor links including navigation and quick links
    const links = document.querySelectorAll('a[href^="#"], .quick-link-card[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            console.log('Scrolling to:', targetId); // Debug log
            
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Use both methods to ensure compatibility
                try {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } catch (e) {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition);
                }
                
                // Close mobile nav if open
                const nav = document.getElementById('nav');
                const hamburger = document.getElementById('hamburger');
                if (nav && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    hamburger.classList.remove('open');
                }
                
                // Update URL without triggering page reload
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            } else {
                console.warn('Target element not found:', targetId);
            }
        });
    });
}

// Search and Filter Functionality
function initSearchFilters() {
    // Grocery store search
    const grocerySearch = document.getElementById('grocery-search');
    if (grocerySearch) {
        grocerySearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const groceryCards = document.querySelectorAll('.grocery-card');
            
            groceryCards.forEach(card => {
                const storeName = card.dataset.name.toLowerCase();
                const storeText = card.textContent.toLowerCase();
                
                if (storeName.includes(searchTerm) || storeText.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    }
    
    // Business search
    const businessSearch = document.getElementById('business-search');
    if (businessSearch) {
        businessSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const businessItems = document.querySelectorAll('.business-item');
            
            businessItems.forEach(item => {
                const businessName = item.dataset.name.toLowerCase();
                const businessText = item.textContent.toLowerCase();
                
                if (businessName.includes(searchTerm) || businessText.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    }
}

// Gas Finder Interactive Features
function initGasFinder() {
    // Add hover effects to gas cards
    const gasCards = document.querySelectorAll('.gas-card');
    gasCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Track link clicks for analytics (if needed)
    const gasLinks = document.querySelectorAll('.gas-card .btn');
    gasLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const serviceName = this.closest('.gas-card').querySelector('h3').textContent;
            console.log(`Gas finder link clicked: ${serviceName}`);
            // Could add analytics tracking here
        });
    });
}

// Deal Alerts for Time-Sensitive Offers
function initDealAlerts() {
    const expiringElements = document.querySelectorAll('.expires');
    const now = new Date();
    
    expiringElements.forEach(element => {
        const expiryDate = new Date(element.dataset.expires);
        const timeDiff = expiryDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff <= 3 && daysDiff > 0) {
            element.classList.add('urgent-deal');
            element.style.borderLeft = '4px solid var(--accent)';
            element.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
            
            // Add urgent indicator
            const urgentBadge = document.createElement('span');
            urgentBadge.className = 'urgent-badge';
            urgentBadge.textContent = `${daysDiff} days left!`;
            urgentBadge.style.cssText = `
                background: var(--accent);
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                margin-left: 8px;
            `;
            element.appendChild(urgentBadge);
        }
    });
}

// Favorites System using sessionStorage (localStorage not available in sandbox)
function initFavoritesSystem() {
    let favorites = getFavorites();
    
    function getFavorites() {
        try {
            return JSON.parse(sessionStorage.getItem('elkin-favorites') || '[]');
        } catch (e) {
            return [];
        }
    }
    
    function saveFavorites(favs) {
        try {
            sessionStorage.setItem('elkin-favorites', JSON.stringify(favs));
        } catch (e) {
            console.warn('Could not save favorites');
        }
    }
    
    function updateFavoriteButton(button, isFavorite) {
        const icon = button.querySelector('i');
        if (icon) {
            if (isFavorite) {
                icon.className = 'fas fa-star';
                button.classList.add('active');
                button.setAttribute('aria-label', 'Remove from favorites');
            } else {
                icon.className = 'far fa-star';
                button.classList.remove('active');
                button.setAttribute('aria-label', 'Add to favorites');
            }
        }
    }
    
    // Initialize favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const itemId = button.dataset.id;
        if (itemId) {
            const isFavorite = favorites.includes(itemId);
            updateFavoriteButton(button, isFavorite);
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const currentlyFavorite = favorites.includes(itemId);
                
                if (currentlyFavorite) {
                    favorites = favorites.filter(id => id !== itemId);
                } else {
                    favorites.push(itemId);
                }
                
                saveFavorites(favorites);
                updateFavoriteButton(button, !currentlyFavorite);
                
                // Show feedback
                showToast(currentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
            });
        }
    });
}

// Back to Top Button - Fixed
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        function updateBackToTopVisibility() {
            if (window.scrollY > 400) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Initial check
        updateBackToTopVisibility();
        
        // Listen for scroll events
        window.addEventListener('scroll', debounce(updateBackToTopVisibility, 100));
        
        // Handle click event
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Back to top clicked'); // Debug log
            
            // Use multiple methods to ensure compatibility
            try {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (e) {
                // Fallback for older browsers
                window.scrollTo(0, 0);
            }
            
            // Alternative method
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }
}

// Event Countdowns
function initEventCountdowns() {
    const events = [
        {
            id: 'countdown-pumpkin',
            date: '2025-09-27T09:00:00'
        },
        {
            id: 'countdown-wine', 
            date: '2026-05-16T10:00:00'
        },
        {
            id: 'countdown-trail',
            date: '2026-06-05T09:00:00'
        }
    ];
    
    function updateCountdowns() {
        const now = new Date().getTime();
        
        events.forEach(event => {
            const element = document.getElementById(event.id);
            if (!element) return;
            
            const eventTime = new Date(event.date).getTime();
            const distance = eventTime - now;
            
            if (distance < 0) {
                element.textContent = 'Event has passed';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 30) {
                element.textContent = `${days} days to go`;
            } else if (days > 0) {
                element.textContent = `${days}d ${hours}h ${minutes}m`;
            } else {
                element.textContent = `${hours}h ${minutes}m`;
            }
        });
    }
    
    // Update immediately and then every minute
    updateCountdowns();
    setInterval(updateCountdowns, 60000);
}

// Weather Widget
function initWeatherWidget() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;
    
    async function fetchWeather() {
        try {
            // TODO: Replace with real OpenWeatherMap API key
            // const API_KEY = 'your-openweathermap-api-key';
            // const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Elkin,NC,US&appid=${API_KEY}&units=imperial`;
            
            // Mock weather data for demonstration
            const mockWeather = {
                temp: Math.round(65 + Math.random() * 25),
                condition: ['sunny', 'cloudy', 'partly-cloudy'][Math.floor(Math.random() * 3)]
            };
            
            const tempElement = document.getElementById('weather-temp');
            const iconElement = weatherWidget.querySelector('i');
            
            if (tempElement) {
                tempElement.textContent = `${mockWeather.temp}°F`;
            }
            
            if (iconElement) {
                const iconClass = {
                    'sunny': 'fas fa-sun',
                    'cloudy': 'fas fa-cloud',
                    'partly-cloudy': 'fas fa-cloud-sun'
                };
                iconElement.className = iconClass[mockWeather.condition] || 'fas fa-sun';
            }
            
        } catch (error) {
            console.error('Failed to fetch weather:', error);
        }
    }
    
    // Fetch weather on load and every hour
    fetchWeather();
    setInterval(fetchWeather, 60 * 60 * 1000);
}

// Service Worker for Offline Functionality
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Create service worker inline to avoid additional file
        const swCode = `
            const CACHE_NAME = 'elkin-savings-v1';
            const urlsToCache = [
                '/',
                '/index.html',
                '/style.css',
                '/app.js'
            ];
            
            self.addEventListener('install', function(event) {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            return cache.addAll(urlsToCache);
                        })
                );
            });
            
            self.addEventListener('fetch', function(event) {
                event.respondWith(
                    caches.match(event.request)
                        .then(function(response) {
                            if (response) {
                                return response;
                            }
                            return fetch(event.request);
                        })
                );
            });
        `;
        
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl)
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// Accessibility Features
function initAccessibilityFeatures() {
    // Announce page changes to screen readers
    function announcePageChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        announcement.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

// Focus Trap for Modal-like Elements
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable?.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable?.focus();
                e.preventDefault();
            }
        }
    }
    
    element.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

// Toast Notification System - Fixed with better styling and z-index
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Set styling based on type
    let backgroundColor = 'var(--primary)';
    if (type === 'success') {
        backgroundColor = 'var(--secondary)';
    } else if (type === 'error') {
        backgroundColor = 'var(--accent)';
    }
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${backgroundColor};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: auto;
        font-size: 14px;
        max-width: 90vw;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // Force reflow and animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initLazyLoading();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send errors to a logging service
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}

// Weekly Specials Functions
function updateLastModified() {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = formatted;
    }
}

function addDeal(storeId, icon, item, price, savings) {
    const dealsContainer = document.getElementById(storeId + '-deals');
    if (!dealsContainer) return;
    
    const dealElement = document.createElement('div');
    dealElement.className = 'deal-item';
    dealElement.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="item">${item}</span>
        <span class="price">${price}</span>
        <span class="savings">${savings}</span>
    `;
    dealsContainer.appendChild(dealElement);
}

function loadCurrentWeekDeals() {
    console.log('Weekly deals loaded successfully');
    updateLastModified();
}

function highlightBestDeals() {
    const deals = document.querySelectorAll('.deal-item');
    deals.forEach(deal => {
        const savingsElement = deal.querySelector('.savings');
        if (savingsElement) {
            const savings = savingsElement.textContent;
            if (savings.includes('Save $3') || savings.includes('Save $2')) {
                deal.style.background = 'rgba(16, 185, 129, 0.05)';
                deal.style.borderLeft = '3px solid #10b981';
            }
        }
    });
}

// Savings Calculator Functions
let gasSavingsAnnual = 0;
let grocerySavingsAnnual = 0;
let diningSavingsAnnual = 0;

function showCalculator(type, buttonElement) {
    // Hide all panels
    document.querySelectorAll('.calculator-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    const panel = document.getElementById(type + '-calculator');
    if (panel) {
        panel.classList.add('active');
    }
    
    // Add active class to clicked tab
    buttonElement.classList.add('active');
    
    // Calculate for the active calculator
    setTimeout(() => {
        if (type === 'gas') calculateGasSavings();
        if (type === 'grocery') calculateGrocerySavings();
        if (type === 'dining') calculateDiningSavings();
    }, 100);
}

function calculateGasSavings() {
    const milesPerWeek = parseFloat(document.getElementById('miles-per-week').value) || 0;
    const mpg = parseFloat(document.getElementById('mpg').value) || 1;
    const expensivePrice = parseFloat(document.getElementById('expensive-price').value) || 0;
    const cheapPrice = parseFloat(document.getElementById('cheap-price').value) || 0;
    
    if (expensivePrice <= cheapPrice) {
        document.getElementById('gas-insight').textContent = 'The expensive station price should be higher than the cheap station price.';
        return;
    }
    
    const gallonsPerWeek = milesPerWeek / mpg;
    const weeklySavings = gallonsPerWeek * (expensivePrice - cheapPrice);
    const monthlySavings = weeklySavings * 4.33;
    const annualSavings = weeklySavings * 52;
    
    gasSavingsAnnual = annualSavings;
    
    document.getElementById('weekly-gas-savings').textContent = '$' + weeklySavings.toFixed(2);
    document.getElementById('monthly-gas-savings').textContent = '$' + monthlySavings.toFixed(2);
    document.getElementById('annual-gas-savings').textContent = '$' + annualSavings.toFixed(2);
    
    let insight = `By choosing the cheapest gas station in Elkin, you use ${gallonsPerWeek.toFixed(1)} gallons per week and save ${((expensivePrice - cheapPrice) * 100).toFixed(1)}¢ per gallon.`;
    
    if (annualSavings > 100) {
        insight += ` That's enough to cover your vehicle registration fees!`;
    } else if (annualSavings > 50) {
        insight += ` Every little bit helps with rising costs!`;
    }
    
    document.getElementById('gas-insight').textContent = insight;
    updateTotalSavings();
}

function calculateGrocerySavings() {
    const weeklyBudget = parseFloat(document.getElementById('weekly-grocery-budget').value) || 0;
    const salePercentage = parseFloat(document.getElementById('sale-percentage').value) / 100 || 0;
    const averageDiscount = parseFloat(document.getElementById('average-discount').value) / 100 || 0;
    const couponSavings = parseFloat(document.getElementById('coupon-savings').value) || 0;
    
    const saleSavings = weeklyBudget * salePercentage * averageDiscount;
    const totalWeeklySavings = saleSavings + couponSavings;
    const monthlySavings = totalWeeklySavings * 4.33;
    const annualSavings = totalWeeklySavings * 52;
    
    grocerySavingsAnnual = annualSavings;
    
    document.getElementById('weekly-grocery-savings').textContent = '$' + totalWeeklySavings.toFixed(2);
    document.getElementById('monthly-grocery-savings').textContent = '$' + monthlySavings.toFixed(2);
    document.getElementById('annual-grocery-savings').textContent = '$' + annualSavings.toFixed(2);
    
    const savingsPercentage = weeklyBudget > 0 ? (totalWeeklySavings / weeklyBudget * 100).toFixed(1) : 0;
    let insight = `You're saving ${savingsPercentage}% on your grocery budget through sales and coupons.`;
    
    if (annualSavings > 500) {
        insight += ` That's like getting a month of groceries free every year!`;
    } else if (annualSavings > 200) {
        insight += ` That adds up to significant savings over time!`;
    }
    
    document.getElementById('grocery-insight').textContent = insight;
    updateTotalSavings();
}

function calculateDiningSavings() {
    const mealsOut = parseFloat(document.getElementById('meals-out-per-week').value) || 0;
    const mealCost = parseFloat(document.getElementById('average-meal-cost').value) || 0;
    const homeCost = parseFloat(document.getElementById('home-meal-cost').value) || 0;
    const mealsToReduce = parseFloat(document.getElementById('meals-to-reduce').value) || 0;
    
    if (mealCost <= homeCost) {
        document.getElementById('dining-insight').textContent = 'Home cooking cost should be less than dining out cost for savings.';
        return;
    }
    
    const savingsPerMeal = mealCost - homeCost;
    const weeklySavings = mealsToReduce * savingsPerMeal;
    const monthlySavings = weeklySavings * 4.33;
    const annualSavings = weeklySavings * 52;
    
    diningSavingsAnnual = annualSavings;
    
    document.getElementById('weekly-dining-savings').textContent = '$' + weeklySavings.toFixed(2);
    document.getElementById('monthly-dining-savings').textContent = '$' + monthlySavings.toFixed(2);
    document.getElementById('annual-dining-savings').textContent = '$' + annualSavings.toFixed(2);
    
    let insight = `By cooking ${mealsToReduce} more meals at home each week, you save $${savingsPerMeal.toFixed(2)} per meal.`;
    
    if (annualSavings > 1000) {
        insight += ` That's enough for a nice vacation!`;
    } else if (annualSavings > 500) {
        insight += ` That could cover several months of utilities!`;
    }
    
    document.getElementById('dining-insight').textContent = insight;
    updateTotalSavings();
}

function updateTotalSavings() {
    const totalAnnual = gasSavingsAnnual + grocerySavingsAnnual + diningSavingsAnnual;
    
    if (totalAnnual > 0) {
        const displayElement = document.getElementById('total-savings-display');
        if (displayElement) {
            displayElement.style.display = 'block';
        }
        
        const totalElement = document.getElementById('total-annual-savings');
        if (totalElement) {
            totalElement.textContent = '$' + totalAnnual.toFixed(0);
        }
        
        const months = Math.round(totalAnnual / 95);
        const comparisonElement = document.getElementById('insurance-comparison');
        if (comparisonElement) {
            comparisonElement.textContent = months;
        }
    }
}

// Initialize Weekly Specials
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentWeekDeals();
    highlightBestDeals();
    
    // Add hover effects to special cards
    const cards = document.querySelectorAll('.special-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Initialize calculators
    calculateGasSavings();
});

// Make calculator functions globally available
window.showCalculator = showCalculator;
window.calculateGasSavings = calculateGasSavings;
window.calculateGrocerySavings = calculateGrocerySavings;
window.calculateDiningSavings = calculateDiningSavings;

// Make grocery specials functions globally available
window.GrocerySpecials = {
    addDeal: addDeal,
    updateLastModified: updateLastModified,
    highlightBestDeals: highlightBestDeals
};

// Debug logging for troubleshooting
console.log('Save in Elkin NC app initialized with new components');

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNavigation,
        initSearchFilters,
        initFavoritesSystem,
        showToast,
        debounce,
        showCalculator,
        calculateGasSavings,
        calculateGrocerySavings,
        calculateDiningSavings
    };
}