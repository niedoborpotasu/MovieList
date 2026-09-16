function renderBrowseMovies(moviesList) {
    var container = document.querySelector('.movies-results-grid');
    if (!container) return;

    if (moviesList.length === 0) {
        container.innerHTML = '<p>Brak filmów spełniających kryteria...</p>';
        return;
    }

    var html = '';
    for (const m of moviesList) {
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
        for (const movie of testMovies) {
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
    for (const select of selects) {
        select.addEventListener('change', filterMovies);
    }

    renderBrowseMovies(testMovies);
}

document.addEventListener('DOMContentLoaded', function() {
    initMoviesPage();
});
