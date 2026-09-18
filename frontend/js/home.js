const API_BASE_URL = 'http://localhost:5131/api/movies';

function switchFilter(filterType) {
    const buttons = document.querySelectorAll('.filter-buttons .filter-btn');
    for (const btn of buttons) {
        const text = btn.textContent.toLowerCase();
        if (filterType === 'all' && text.includes('all')) {
            btn.classList.add('active');
        } else if (filterType === 'year' && text.includes('year')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
    loadHomeMovies(filterType);
}

function toggleMovies() {
    const grid = document.getElementById('moviesGrid');
    const expandBtn = document.getElementById('expandBtn');
    if (!grid) return;

    if (grid.classList.contains('expanded')) {
        grid.classList.remove('expanded');
        grid.style.maxHeight = '350px';
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

async function loadHomeMovies(filterType) {
    filterType = filterType || 'all';
    const grid = document.getElementById('moviesGrid');
    const expandBtn = document.getElementById('expandBtn');
    if (!grid) return;

    grid.innerHTML = '<p>Loading movies...</p>';

    const params = new URLSearchParams();
    params.append('sortBy', 'popularity.desc');
    if (filterType === 'year') {
        params.append('year', new Date().getFullYear());
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
        grid.innerHTML = html;

        if (expandBtn) {
            if (movies.length <= 5) {
                expandBtn.style.display = 'none';
                grid.style.maxHeight = 'none';
            } else {
                expandBtn.style.display = 'block';
                grid.classList.remove('expanded');
                grid.style.maxHeight = '350px';
                expandBtn.style.transform = 'rotate(0deg)';
            }
        }
    } catch (err) {
        grid.innerHTML = '<p>Error loading movies. Make sure backend is running on http://localhost:5131.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadHomeMovies('all');
});
