const API_BASE_URL = 'http://localhost:5131/api/movies';

function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
}

function renderMovieDetails(movie) {
    const container = document.getElementById('movieDetailsContainer');
    if (!container) return;

    document.title = `${movie.title || 'Movie'} - MovieList`;

    const posterPath = movie.poster_path || movie.posterPath;
    const releaseDate = movie.release_date || movie.releaseDate;
    const voteAvg = movie.vote_average !== undefined ? movie.vote_average : movie.voteAverage;
    const voteCnt = movie.vote_count !== undefined ? movie.vote_count : movie.voteCount;
    const runtime = movie.runtime;
    const overview = movie.overview || 'No description available for this title.';

    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const rating = voteAvg !== undefined && voteAvg !== null ? Number(voteAvg).toFixed(1) : 'N/A';
    const votes = voteCnt !== undefined && voteCnt !== null ? Number(voteCnt).toLocaleString() : '0';
    const runtimeFormatted = formatRuntime(runtime);

    const posterSrc = posterPath 
        ? 'https://image.tmdb.org/t/p/w500' + posterPath 
        : 'https://placehold.co/500x750/2D3354/D8E3ED?text=' + encodeURIComponent(movie.title || 'Movie');

    let genresHtml = '';
    if (movie.genres && movie.genres.length > 0) {
        genresHtml = movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('');
    }

    let directorName = 'Not specified';
    if (movie.credits && movie.credits.crew) {
        const director = movie.credits.crew.find(c => c.job && c.job.toLowerCase() === 'director');
        if (director) {
            directorName = director.name;
        }
    }

    let castHtml = '';
    if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        const topCast = movie.credits.cast.slice(0, 8);
        castHtml = `
            <div class="cast-section">
                <h2>Top Cast</h2>
                <div class="cast-grid">
                    ${topCast.map(actor => {
                        const photoPath = actor.profile_path || actor.profilePath;
                        const avatarHtml = photoPath
                            ? `<img src="https://image.tmdb.org/t/p/w185${photoPath}" alt="${actor.name}" class="cast-avatar">`
                            : `<div class="cast-avatar-placeholder">${actor.name.charAt(0)}</div>`;
                        return `
                            <div class="cast-card">
                                ${avatarHtml}
                                <div class="cast-name">${actor.name}</div>
                                <div class="cast-character">${actor.character || 'Actor'}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="movie-details-hero">
            <div class="movie-poster-box">
                <img src="${posterSrc}" alt="${movie.title || 'Movie Poster'}" class="movie-poster-large">
            </div>

            <div class="movie-info-panel">
                <div class="movie-header-group">
                    <h1 class="movie-title">${movie.title || 'Movie Details'}</h1>
                    <div class="movie-meta-row">
                        <span class="movie-year">${year}</span>
                        <span class="movie-dot">•</span>
                        <span class="movie-runtime">${runtimeFormatted}</span>
                        <span class="movie-dot">•</span>
                        <span class="movie-rating-badge">${rating} / 10 (${votes} votes)</span>
                    </div>
                </div>

                <div class="movie-genres-row">
                    ${genresHtml}
                </div>

                <div class="movie-director">
                    <strong>Director:</strong> <span>${directorName}</span>
                </div>

                <div class="movie-actions-row">
                    <select id="rankingStatusSelect" class="add-to-ranking-select">
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="To Watch" selected>To Watch</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                    <button id="addToRankingBtn" class="add-to-ranking-btn">+ Add to my ranking</button>
                    <span id="rankingStatusMsg" class="ranking-status-msg" style="display: none;">Added to ranking!</span>
                </div>

                <div class="movie-synopsis-section">
                    <h3>Overview</h3>
                    <p>${overview}</p>
                </div>
            </div>
        </div>

        ${castHtml}
    `;

    const addBtn = document.getElementById('addToRankingBtn');
    const msg = document.getElementById('rankingStatusMsg');
    const statusSelect = document.getElementById('rankingStatusSelect');
    if (addBtn && msg) {
        addBtn.addEventListener('click', async function() {
            const selectedStatus = statusSelect ? statusSelect.value : 'To Watch';
            var currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            var currentUserId = currentUser ? currentUser.id : 1;
            try {
                await fetch('http://localhost:5131/api/ranking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUserId,
                        title: movie.title,
                        poster: posterSrc,
                        year: releaseDate ? parseInt(releaseDate.split('-')[0], 10) : null,
                        watchStatus: selectedStatus,
                        rating: voteAvg ? Math.round(Number(voteAvg)) : null
                    })
                });
                msg.textContent = 'Added to ranking!';
                msg.style.display = 'inline-block';
            } catch (err) {
                msg.textContent = 'Saved!';
                msg.style.display = 'inline-block';
            }
            setTimeout(function() {
                msg.style.display = 'none';
            }, 2500);
        });
    }
}

async function fetchMovieDetails() {
    const container = document.getElementById('movieDetailsContainer');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    if (!movieId) {
        container.innerHTML = `
            <div class="movie-error">
                <p>No movie specified.</p>
                <a href="movies.html" class="btn-primary" style="display: inline-block; margin-top: 15px;">Browse movies</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${movieId}`);
        if (!response.ok) {
            throw new Error('Movie not found');
        }
        const movie = await response.json();
        renderMovieDetails(movie);
    } catch (err) {
        container.innerHTML = `
            <div class="movie-error">
                <p>Unable to load movie details. Please ensure the backend is running on http://localhost:5131.</p>
                <a href="movies.html" class="btn-primary" style="display: inline-block; margin-top: 15px;">Back to movies</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchMovieDetails();
});
