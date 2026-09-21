const API_BASE_URL = 'http://localhost:5131/api/movies';

let homePage = 1;
let currentHomeFilter = 'today';

function switchFilter(filterType) {
    currentHomeFilter = filterType;
    homePage = 1;

    const buttons = document.querySelectorAll('.filter-buttons .filter-btn');
    for (const btn of buttons) {
        const text = btn.textContent.toLowerCase();
        if (filterType === 'today' && text.includes('today')) {
            btn.classList.add('active');
        } else if (filterType === 'year' && text.includes('year')) {
            btn.classList.add('active');
        } else if (filterType === 'all' && text.includes('all')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
    loadHomeMovies(filterType, false);
}

function createHomeMovieCard(m) {
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

    return '<a href="movie-details.html?id=' + m.id + '" class="movie-card" data-id="' + m.id + '">' +
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
    '</a>';
}

async function loadHomeMovies(filterType, isAppend = false) {
    filterType = filterType || currentHomeFilter;
    const grid = document.getElementById('moviesGrid');
    const loadMoreBtn = document.getElementById('homeLoadMoreBtn');
    if (!grid) return;

    if (isAppend) {
        homePage++;
    } else {
        homePage = 1;
        const savedScrollY = window.scrollY;
        const currentHeight = grid.offsetHeight;
        if (currentHeight > 0) {
            grid.style.minHeight = currentHeight + 'px';
        }
        grid.innerHTML = '<p>Loading movies...</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        window.scrollTo({ top: savedScrollY });
    }

    const params = new URLSearchParams();
    params.append('page', homePage);

    if (filterType === 'today') {
        params.append('sortBy', 'popularity.desc');
    } else if (filterType === 'year') {
        params.append('sortBy', 'vote_count.desc');
        params.append('year', new Date().getFullYear());
    } else {
        params.append('sortBy', 'vote_count.desc');
    }

    try {
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('API error');
        }
        const movies = await response.json();

        let html = '';
        for (const m of movies) {
            html += createHomeMovieCard(m);
        }

        if (isAppend) {
            grid.insertAdjacentHTML('beforeend', html);
        } else {
            grid.innerHTML = html;
            grid.style.minHeight = '';
        }

        if (loadMoreBtn) {
            loadMoreBtn.style.display = (movies && movies.length === 20) ? 'inline-block' : 'none';
        }
    } catch (err) {
        if (!isAppend) {
            grid.innerHTML = '<p>Error loading movies. Make sure backend is running on http://localhost:5131.</p>';
            grid.style.minHeight = '';
        }
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('homeLoadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => loadHomeMovies(currentHomeFilter, true));
    }
    loadHomeMovies('today', false);
});
