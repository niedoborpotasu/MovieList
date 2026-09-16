var testMovies = [
    { title: "Inception", status: "Completed", rating: 9, genre: "scifi", year: 2010, poster: "posters/inception.jpg" },
    { title: "Interstellar", status: "Watching", rating: 10, genre: "scifi", year: 2014, poster: "posters/interstellar.jpg" },
    { title: "The Dark Knight", status: "To Watch", rating: 9, genre: "action", year: 2008, poster: "posters/dark_knight.jpg" },
    { title: "Pulp Fiction", status: "Dropped", rating: 8, genre: "drama", year: 1994 },
    { title: "The Conjuring", status: "To Watch", rating: 7, genre: "horror", year: 2013, poster: "posters/the_conjuring.jpg" },
    { title: "Fight Club", status: "Completed", rating: 9, genre: "drama", year: 1999, poster: "posters/fight_club.jpg" },
    { title: "The Matrix", status: "Watching", rating: 10, genre: "scifi", year: 1999 },
    { title: "Gladiator", status: "Dropped", rating: 8, genre: "action", year: 2000, poster: "posters/gladiator.jpg" },
    { title: "Avatar 3", status: "Watching", rating: 8, genre: "scifi", year: 2025 },
    { title: "Avengers: Secret Wars", status: "To Watch", rating: 9, genre: "action", year: 2026 }
];

function switchFilter(filterType) {
    var buttons = document.querySelectorAll('.filter-buttons .filter-btn');
    for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        var text = btn.textContent.toLowerCase();
        if (filterType === 'all' && text.includes('all')) {
            btn.classList.add('active');
        } else if (filterType === 'year' && text.includes('year')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
}

function toggleMovies() {
    var grid = document.getElementById('moviesGrid');
    var expandBtn = document.getElementById('expandBtn');
    if (!grid) return;

    if (grid.classList.contains('expanded')) {
        grid.classList.remove('expanded');
        grid.style.maxHeight = '320px';
        if (expandBtn) {
            expandBtn.style.transform = 'rotate(0deg)';
        }
    } else {
        grid.classList.add('expanded');
        grid.style.maxHeight = (grid.scrollHeight + 50) + 'px';
        if (expandBtn) {
            expandBtn.style.transform = 'rotate(180deg)';
        }
    }
}

var currentEditingCard = null;

function applyRankingFilters() {
    var checkboxes = document.querySelectorAll('.status-filters input[name="status"]');
    var checkedValues = [];

    for (var i = 0; i < checkboxes.length; i++) {
        var cb = checkboxes[i];
        var label = cb.parentElement;
        if (cb.checked) {
            checkedValues.push(cb.value.toLowerCase());
            if (label) {
                label.classList.add('active');
            }
        } else {
            if (label) {
                label.classList.remove('active');
            }
        }
    }

    var cards = document.querySelectorAll('.user-movies-grid .user-movie-card');
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var tag = card.querySelector('.movie-status-tag');
        var cardStatus = '';
        if (tag) {
            cardStatus = tag.textContent.toLowerCase().trim();
        }

        if (checkedValues.length === 0) {
            card.style.display = 'flex';
        } else {
            var isMatched = false;
            for (var j = 0; j < checkedValues.length; j++) {
                var val = checkedValues[j];
                if (val === cardStatus || val === cardStatus.replace(' ', '-')) {
                    isMatched = true;
                    break;
                }
            }
            if (isMatched) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    }
}

function openEditModal(card) {
    currentEditingCard = card;

    var titleEl = card.querySelector('h3');
    var statusEl = card.querySelector('.movie-status-tag');
    var ratingEl = card.querySelector('.movie-rating-badge strong');

    var title = titleEl ? titleEl.textContent.trim() : 'Film';
    var currentStatus = statusEl ? statusEl.textContent.trim() : 'Watching';
    var ratingText = ratingEl ? ratingEl.textContent.trim() : '10/10';
    var numericRating = ratingText.split('/')[0].trim();

    var modal = document.querySelector('.movie-modal');
    var modalTitle = modal ? modal.querySelector('h3') : null;
    var modalStatusSelect = modal ? modal.querySelector('.modal-field select') : null;
    var modalRatingInput = modal ? modal.querySelector('.modal-input-text') : null;
    var modalBackdrop = document.querySelector('.movie-modal-backdrop');

    if (modalTitle) {
        modalTitle.textContent = 'Edit movie: ' + title;
    }
    if (modalRatingInput) {
        modalRatingInput.value = numericRating;
    }

    if (modalStatusSelect) {
        for (var i = 0; i < modalStatusSelect.options.length; i++) {
            if (modalStatusSelect.options[i].text.toLowerCase() === currentStatus.toLowerCase()) {
                modalStatusSelect.selectedIndex = i;
                break;
            }
        }
    }

    if (modalBackdrop) {
        modalBackdrop.style.display = 'flex';
    }
}

function closeModal() {
    var modalBackdrop = document.querySelector('.movie-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.style.display = 'none';
    }
    currentEditingCard = null;
}

function saveModalChanges() {
    if (!currentEditingCard) {
        closeModal();
        return;
    }

    var modal = document.querySelector('.movie-modal');
    var modalStatusSelect = modal ? modal.querySelector('.modal-field select') : null;
    var modalRatingInput = modal ? modal.querySelector('.modal-input-text') : null;

    var newStatus = modalStatusSelect ? modalStatusSelect.value : 'Watching';
    var newRating = modalRatingInput ? parseInt(modalRatingInput.value, 10) : 10;

    if (isNaN(newRating) || newRating < 1) {
        newRating = 1;
    }
    if (newRating > 10) {
        newRating = 10;
    }

    var statusTag = currentEditingCard.querySelector('.movie-status-tag');
    if (statusTag) {
        statusTag.textContent = newStatus;
    }

    var ratingBadge = currentEditingCard.querySelector('.movie-rating-badge strong');
    if (ratingBadge) {
        ratingBadge.textContent = newRating + '/10';
    }

    closeModal();
    applyRankingFilters();
}

function initRankingPage() {
    var modalBackdrop = document.querySelector('.movie-modal-backdrop');
    var statusCheckboxes = document.querySelectorAll('.status-filters input[name="status"]');

    for (var i = 0; i < statusCheckboxes.length; i++) {
        statusCheckboxes[i].addEventListener('change', applyRankingFilters);
    }
    applyRankingFilters();

    if (!modalBackdrop) return;

    var editButtons = document.querySelectorAll('.edit-movie-btn');
    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', function(e) {
            var card = e.target.parentElement;
            if (card) {
                openEditModal(card);
            }
        });
    }

    var modalSaveBtn = modalBackdrop.querySelector('.modal-save-btn');
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', saveModalChanges);
    }

    var modalCloseBtn = modalBackdrop.querySelector('.modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', function(e) {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function loadHomeMovies() {
    var cards = document.querySelectorAll('.movies-grid .movie-card');
    for (var i = 0; i < cards.length && i < testMovies.length; i++) {
        cards[i].textContent = testMovies[i].title;
    }
}

function renderBrowseMovies(moviesList) {
    var container = document.querySelector('.movies-results-grid');
    if (!container) return;

    if (moviesList.length === 0) {
        container.innerHTML = '<p>Brak filmów spełniających kryteria...</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < moviesList.length; i++) {
        var m = moviesList[i];
        var genreLabel = m.genre;
        if (m.genre === 'scifi') genreLabel = 'Sci-Fi';
        if (m.genre === 'action') genreLabel = 'Akcja';
        if (m.genre === 'drama') genreLabel = 'Dramat';
        if (m.genre === 'horror') genreLabel = 'Horror';

        var posterContent = m.poster ? '<img src="' + m.poster + '" alt="' + m.title + '">' : 'Poster';

        html += '<div class="user-movie-card">' +
            '<div class="user-movie-poster">' + posterContent + '</div>' +
            '<div class="user-movie-info">' +
            '<h3>' + m.title + '</h3>' +
            '<p class="movie-status-tag">' + genreLabel + ' | Rok: ' + m.year + '</p>' +
            '<div class="movie-rating-badge">Ocena: <strong>' + m.rating + '/10</strong></div>' +
            '</div>' +
            '</div>';
    }
    container.innerHTML = html;
}

function initMoviesPage() {
    var container = document.querySelector('.movies-results-grid');
    if (!container) return;

    var searchInput = document.querySelector('.search-box-large input');
    var selects = document.querySelectorAll('.filter-row select');

    function filterMovies() {
        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var genreVal = selects[0] ? selects[0].value : '';
        var yearVal = selects[1] ? selects[1].value : '';
        var sortVal = selects[2] ? selects[2].value : '';

        var results = [];
        for (var i = 0; i < testMovies.length; i++) {
            var movie = testMovies[i];
            var matchesTitle = movie.title.toLowerCase().indexOf(query) !== -1;
            var matchesGenre = genreVal === '' || movie.genre === genreVal;
            var matchesYear = false;

            if (yearVal === '') {
                matchesYear = true;
            } else if (yearVal === 'older') {
                if (movie.year < 2025) {
                    matchesYear = true;
                }
            } else if (movie.year == yearVal) {
                matchesYear = true;
            }

            if (matchesTitle && matchesGenre && matchesYear) {
                results.push(movie);
            }
        }

        if (sortVal === 'rating') {
            results.sort(function(a, b) {
                return b.rating - a.rating;
            });
        } else if (sortVal === 'newest') {
            results.sort(function(a, b) {
                return b.year - a.year;
            });
        }

        renderBrowseMovies(results);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterMovies);
    }
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', filterMovies);
    }

    renderBrowseMovies(testMovies);
}

function loadHeader() {
    var headerElement = document.getElementById('main-header');
    if (!headerElement) return;

    fetch('header.html')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            headerElement.innerHTML = data;
        })
        .catch(function(error) {
            console.error('Error loading header:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadHomeMovies();
    initRankingPage();
    initMoviesPage();
});

