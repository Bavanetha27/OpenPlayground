// Theme Toggle Functionality
const toggleBtn = document.getElementById('toggle-mode-btn');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

toggleBtn.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add shake animation
    toggleBtn.classList.add('shake');
    setTimeout(() => {
        toggleBtn.classList.remove('shake');
    }, 500);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('ri-lightbulb-line');
        themeIcon.classList.add('ri-lightbulb-fill');
    } else {
        themeIcon.classList.remove('ri-lightbulb-fill');
        themeIcon.classList.add('ri-lightbulb-line');
    }
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('%cWant to contribute? Check out: https://github.com/YadavAkhileshh/OpenPlayground', 'font-size: 14px; color: #8b5cf6;');

// Pagination and Filtering Logic
const itemsPerPage = 10;
let currentPage = 1;
let currentFilter = 'all';
const projectsContainer = document.querySelector('.projects-container');
const paginationContainer = document.getElementById('pagination-controls');
const allCards = Array.from(document.querySelectorAll('.card')); // Store all original cards

// Initial Render
renderProjects();

// Category Filtering
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        currentFilter = btn.getAttribute('data-filter');
        currentPage = 1; // Reset to first page
        renderProjects();
    });
});

function renderProjects() {
    // 1. Filter projects
    const filteredCards = allCards.filter(card => {
        return currentFilter === 'all' || card.getAttribute('data-category') === currentFilter;
    });

    // 2. Paginate projects
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);

    // 3. Update DOM
    // Clear current projects but keep them in memory (already in allCards)
    // We need to hide all cards first then show only the paginated ones
    // But since we are not removing them from DOM in original code, we just toggle display.
    // However, the original code had them all in DOM. To respect pagination, we should probably hide all and only show the ones for current page.
    
    // Better approach:
    // Hide ALL cards
    allCards.forEach(card => card.style.display = 'none');
    
    // Show only paginated cards
    paginatedCards.forEach(card => {
        card.style.display = ''; // Restore default display (flex/block)
        // Reset animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });

    // 4. Update Pagination Controls
    renderPaginationControls(filteredCards.length);
}

function renderPaginationControls(totalItems) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Always render controls, just disable them if not needed
    // if (totalPages <= 1) return; <--- REMOVED THIS LINE

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('pagination-btn');
    prevBtn.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects();
            scrollToProjects();
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('pagination-btn');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderProjects();
            scrollToProjects();
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('pagination-btn');
    nextBtn.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects();
            scrollToProjects();
        }
    });
    paginationContainer.appendChild(nextBtn);
}

function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    projectsSection.scrollIntoView({ behavior: 'smooth' });
}
// ===============================
// Project Search & Category Filter
// ===============================

const searchInput = document.getElementById("project-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".projects-container .card");

let activeCategory = "all";

// Filter function
function filterProjects() {
    const searchText = searchInput.value.toLowerCase();

    projectCards.forEach(card => {
        const title = card.querySelector(".card-heading").textContent.toLowerCase();
        const category = card.getAttribute("data-category");

        const matchesSearch = title.includes(searchText);
        const matchesCategory = activeCategory === "all" || category === activeCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Search input event
searchInput.addEventListener("input", () => {
    filterProjects();
});

// Category button events
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        activeCategory = button.getAttribute("data-filter");
        filterProjects();
    });
});

// Mobile Navbar Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
