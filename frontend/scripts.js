// Przykładowe dane filmów dla strony głównej
const MOVIES_DATA = {
    all: [
        { title: "Skazani na Shawshank", year: "1994" },
        { title: "Ojciec Chrzestny", year: "1972" },
        { title: "Mroczny Rycerz", year: "2008" },
        { title: "Pulp Fiction", year: "1994" },
        { title: "Władca Pierścieni: Powrót Króla", year: "2003" },
        { title: "Fight Club", year: "1999" },
        { title: "Incepcja", year: "2010" },
        { title: "Matrix", year: "1999" },
        { title: "Interstellar", year: "2014" },
        { title: "Gladiator", year: "2000" }
    ],
    year: [
        { title: "Diuna: Część Druga", year: "2026" },
        { title: "Deadpool & Wolverine", year: "2026" },
        { title: "Gladiator II", year: "2026" },
        { title: "Joker: Folie à Deux", year: "2026" },
        { title: "Nosferatu", year: "2026" },
        { title: "Furiosa: Saga Mad Max", year: "2026" },
        { title: "Substancja", year: "2026" },
        { title: "Obcy: Romulus", year: "2026" },
        { title: "Civil War", year: "2026" },
        { title: "Wicked", year: "2026" }
    ]
};


function switchFilter(filterType) {
    const filterButtons = document.querySelectorAll('.filter-buttons .filter-btn');
    filterButtons.forEach(btn => {
        const matches = (filterType === 'all' && btn.textContent.toLowerCase().includes('all')) ||
                        (filterType === 'year' && btn.textContent.toLowerCase().includes('year'));
        btn.classList.toggle('active', matches);
    });

    const grid = document.getElementById('moviesGrid');
    if (grid && MOVIES_DATA[filterType]) {
        const movieCards = grid.querySelectorAll('.movie-card');
        const list = MOVIES_DATA[filterType];

        movieCards.forEach((card, index) => {
            if (list[index]) {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.textContent = `${list[index].title} (${list[index].year})`;
                    card.style.opacity = '1';
                }, 150);
            }
        });
    }
}


function toggleMovies() {
    const grid = document.getElementById('moviesGrid');
    const expandBtn = document.getElementById('expandBtn');
    if (!grid) return;

    const isExpanded = grid.classList.toggle('expanded');

    if (isExpanded) {
        grid.style.maxHeight = (grid.scrollHeight + 50) + 'px';
        if (expandBtn) {
            expandBtn.style.transform = 'rotate(180deg)';
            expandBtn.setAttribute('aria-expanded', 'true');
            expandBtn.setAttribute('title', 'Zwiń');
        }
    } else {
        grid.style.maxHeight = '320px';
        if (expandBtn) {
            expandBtn.style.transform = 'rotate(0deg)';
            expandBtn.setAttribute('aria-expanded', 'false');
            expandBtn.setAttribute('title', 'Rozwiń');
        }
    }
}

window.switchFilter = switchFilter;
window.toggleMovies = toggleMovies;

function initRankingPage() {
    const modalBackdrop = document.querySelector('.movie-modal-backdrop');
    if (!modalBackdrop) return;

    const modal = modalBackdrop.querySelector('.movie-modal');
    const modalTitle = modal?.querySelector('h3');
    const modalStatusSelect = modal?.querySelector('.modal-field select');
    const modalRatingInput = modal?.querySelector('.modal-input-text');
    const modalSaveBtn = modal?.querySelector('.modal-save-btn');
    const modalCloseBtn = modal?.querySelector('.modal-close-btn');

    let currentEditingCard = null;

    
    function openEditModal(card) {
        currentEditingCard = card;
        const title = card.querySelector('h3')?.textContent.trim() || 'Film';
        const currentStatus = card.querySelector('.movie-status-tag')?.textContent.trim() || 'Watching';
        const ratingText = card.querySelector('.movie-rating-badge strong')?.textContent.trim() || '10/10';
        const numericRating = ratingText.split('/')[0].trim();

        if (modalTitle) modalTitle.textContent = `Edit movie: ${title}`;
        if (modalRatingInput) modalRatingInput.value = numericRating;

        if (modalStatusSelect) {
            for (let i = 0; i < modalStatusSelect.options.length; i++) {
                if (modalStatusSelect.options[i].text.toLowerCase() === currentStatus.toLowerCase()) {
                    modalStatusSelect.selectedIndex = i;
                    break;
                }
            }
        }

        modalBackdrop.style.display = 'flex';
        if (modalRatingInput) modalRatingInput.focus();
    }

    function closeModal() {
        modalBackdrop.style.display = 'none';
        currentEditingCard = null;
    }

    function saveModalChanges() {
        if (!currentEditingCard) {
            closeModal();
            return;
        }

        const newStatus = modalStatusSelect?.value || 'Watching';
        let newRating = modalRatingInput?.value.trim() || '10';

        let num = parseInt(newRating, 10);
        if (isNaN(num) || num < 1) num = 1;
        if (num > 10) num = 10;

        const statusTag = currentEditingCard.querySelector('.movie-status-tag');
        if (statusTag) {
            statusTag.textContent = newStatus;
        }

        const ratingBadge = currentEditingCard.querySelector('.movie-rating-badge strong');
        if (ratingBadge) {
            ratingBadge.textContent = `${num}/10`;
        }

        closeModal();
        applyRankingFilters();
    }

    const editButtons = document.querySelectorAll('.edit-movie-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.user-movie-card');
            if (card) openEditModal(card);
        });
    });

    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', saveModalChanges);
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modalBackdrop.style.display === 'flex') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'Enter' && document.activeElement === modalRatingInput) saveModalChanges();
        }
    });

    const statusCheckboxes = document.querySelectorAll('.status-filters input[name="status"]');
    function applyRankingFilters() {
        const checkedValues = Array.from(statusCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        const cards = document.querySelectorAll('.user-movies-grid .user-movie-card');
        cards.forEach(card => {
            const statusTag = card.querySelector('.movie-status-tag')?.textContent.trim().toLowerCase() || '';
            const statusSlug = statusTag.replace(/\s+/g, '-');

            if (checkedValues.length === 0) {
                card.style.display = 'flex';
            } else {
                const matches = checkedValues.includes(statusTag) || checkedValues.includes(statusSlug);
                card.style.display = matches ? 'flex' : 'none';
            }
        });
    }

    statusCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyRankingFilters);
    });
}


function initMoviesPage() {
    const searchInput = document.querySelector('.search-box-large input');
    const resultsContainer = document.querySelector('.movies-results-grid');
    const filterSelects = document.querySelectorAll('.movies-filter-panel select');

    if (!searchInput && filterSelects.length === 0) return;

    const sampleDatabase = [
        { title: "Incepcja", genre: "scifi", year: "older", rating: "8.8", desc: "Złodziej wykradający sekrety z podświadomości." },
        { title: "Interstellar", genre: "scifi", year: "older", rating: "8.7", desc: "Podróż przez tunel czasoprzestrzenny w poszukiwaniu nowego domu." },
        { title: "Mroczny Rycerz", genre: "action", year: "older", rating: "9.0", desc: "Batman stawia czoła Jokerowi w Gotham." },
        { title: "Diuna: Część Druga", genre: "scifi", year: "2026", rating: "8.6", desc: "Paul Atryda jednoczy się z Chani i Fremenami." },
        { title: "Gladiator II", genre: "action", year: "2025", rating: "7.9", desc: "Kontynuacja legendarnego widowiska Ridleya Scotta." },
        { title: "Nosferatu", genre: "horror", year: "2025", rating: "8.1", desc: "Gotycka opowieść o obsesji i wampiryzmie." },
        { title: "Oppenheimer", genre: "drama", year: "older", rating: "8.9", desc: "Historia stworzenia bomby atomowej." },
        { title: "Substancja", genre: "horror", year: "2025", rating: "8.0", desc: "Szokujący horror cielesny o pogoni za młodością." }
    ];

    function filterAndRenderMovies() {
        if (!resultsContainer) return;

        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const genre = filterSelects[0] ? filterSelects[0].value.toLowerCase() : '';
        const year = filterSelects[1] ? filterSelects[1].value.toLowerCase() : '';
        const sort = filterSelects[2] ? filterSelects[2].value.toLowerCase() : '';

        let results = sampleDatabase.filter(movie => {
            const matchesQuery = !query || movie.title.toLowerCase().includes(query) || movie.desc.toLowerCase().includes(query);
            const matchesGenre = !genre || movie.genre === genre;
            const matchesYear = !year || movie.year === year;
            return matchesQuery && matchesGenre && matchesYear;
        });

        if (sort === 'rating') {
            results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        } else if (sort === 'newest') {
            results.sort((a, b) => b.year.localeCompare(a.year));
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="color: #a1a1aa; padding: 20px;">Brak wyników spełniających kryteria.</p>';
            return;
        }

        resultsContainer.innerHTML = results.map(movie => `
            <div class="user-movie-card" style="margin-bottom: 15px;">
                <div class="user-movie-poster">Film</div>
                <div class="user-movie-info">
                    <h3>${movie.title}</h3>
                    <p class="movie-status-tag" style="color: #10b981;">Gatunek: ${movie.genre.toUpperCase()}</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 5px;">${movie.desc}</p>
                    <div class="movie-rating-badge">Ocena: <strong>${movie.rating}/10</strong></div>
                </div>
            </div>
        `).join('');
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderMovies);
    }
    filterSelects.forEach(select => {
        select.addEventListener('change', filterAndRenderMovies);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRankingPage();
    initMoviesPage();

    const allTimeBtn = document.querySelector('.filter-btn[onclick*="all"]');
    if (allTimeBtn) {
        allTimeBtn.addEventListener('click', () => switchFilter('all'));
    }

    const yearBtn = document.querySelector('.filter-btn[onclick*="year"]');
    if (yearBtn) {
        yearBtn.addEventListener('click', () => switchFilter('year'));
    }

    const expandBtn = document.getElementById('expandBtn');
    if (expandBtn) {
        expandBtn.addEventListener('click', toggleMovies);
    }
});
