const API_BASE_URL = 'http://localhost:5131/api/movies';

let currentPage = 1;

function createMovieCard(m) {
    const posterPath = m.poster_path || m.posterPath;
    const releaseDate = m.release_date || m.releaseDate;
    const voteAvg = m.vote_average !== undefined ? m.vote_average : m.voteAverage;
    const voteCnt = m.vote_count !== undefined ? m.vote_count : m.voteCount;

    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const rating = voteAvg !== undefined && voteAvg !== null ? Number(voteAvg).toFixed(1) : 'N/A';
    const votes = voteCnt !== undefined && voteCnt !== null ? Number(voteCnt).toLocaleString() : '0';
    const posterSrc = posterPath 
        ? 'https://image.tmdb.org/t/p/w500' + posterPath 
        : 'https://placehold.co/500x750/2D3354/D8E3ED?text=' + encodeURIComponent(m.title || 'Movie');

    return '<div class="movie-card" data-id="' + m.id + '">' +
        '<img src="' + posterSrc + '" alt="' + (m.title || '') + '">' +
        '<div class="movie-overlay">' +
            '<div class="overlay-top">' +
                '<span class="movie-votes">' + votes + ' votes</span>' +
                '<span class="movie-rating">' + rating + '/10</span>' +
            '</div>' +
            '<div class="overlay-bottom">' +
                '<h3>' + (m.title || '') + '</h3>' +
                '<span class="movie-year">' + year + '</span>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderBrowseMovies(moviesList, isAppend) {
    const container = document.querySelector('.movies-results-grid');
    if (!container) return;

    if (!isAppend && (!moviesList || moviesList.length === 0)) {
        container.innerHTML = '<p>No movies match the criteria...</p>';
        return;
    }

    let html = '';
    for (const m of moviesList) {
        html += createMovieCard(m);
    }

    if (isAppend) {
        container.insertAdjacentHTML('beforeend', html);
    } else {
        container.innerHTML = html;
    }
}

async function fetchMovies(isAppend = false) {
    const container = document.querySelector('.movies-results-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!container) return;

    if (isAppend) {
        currentPage++;
        if (loadMoreBtn) loadMoreBtn.textContent = 'Loading...';
    } else {
        currentPage = 1;
        container.innerHTML = '<p>Loading movies...</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    const searchInput = document.querySelector('.search-box-large input');
    const selects = document.querySelectorAll('.filter-row select');

    const query = searchInput ? searchInput.value.trim() : '';
    const genreId = selects[0] ? selects[0].value : '';
    const year = selects[1] ? selects[1].value : '';
    const sortBy = selects[2] ? selects[2].value : '';

    const params = new URLSearchParams();
    params.append('page', currentPage);
    if (query) params.append('query', query);
    if (genreId) params.append('genreId', genreId);
    if (year) params.append('year', year);
    if (sortBy) params.append('sortBy', sortBy);

    try {
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('API error');
        }
        const movies = await response.json();
        renderBrowseMovies(movies, isAppend);

        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Load more movies';
            loadMoreBtn.style.display = (movies && movies.length === 20) ? 'inline-block' : 'none';
        }
    } catch (err) {
        if (!isAppend) {
            container.innerHTML = '<p>Error loading movies. Make sure backend is running on http://localhost:5131.</p>';
        }
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

function initMoviesPage() {
    const searchInput = document.querySelector('.search-box-large input');
    const selects = document.querySelectorAll('.filter-row select');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fetchMovies(false), 350);
        });
    }

    for (const select of selects) {
        select.addEventListener('change', () => fetchMovies(false));
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => fetchMovies(true));
    }

    fetchMovies(false);
}

document.addEventListener('DOMContentLoaded', function() {
    initMoviesPage();
});
