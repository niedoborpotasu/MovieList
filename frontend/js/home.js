function switchFilter(filterType) {
    var buttons = document.querySelectorAll('.filter-buttons .filter-btn');
    for (const btn of buttons) {
        var text = btn.textContent.toLowerCase();
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

function loadHomeMovies(filterType) {
    filterType = filterType || 'all';
    var grid = document.getElementById('moviesGrid');
    var expandBtn = document.getElementById('expandBtn');
    if (!grid) return;

    var currentYear = new Date().getFullYear();
    var movies = testMovies;
    if (filterType === 'year') {
        movies = testMovies.filter(function(m) {
            return m.year === currentYear || m.year >= 2025;
        });
    }

    var html = '';
    for (const m of movies) {
        if (m.poster) {
            html += '<div class="movie-card" title="' + m.title + '"><img src="' + m.poster + '" alt="' + m.title + '"></div>';
        } else {
            html += '<div class="movie-card" title="' + m.title + '">' + m.title + '</div>';
        }
    }
    grid.innerHTML = html;

    if (expandBtn) {
        if (movies.length <= 5) {
            expandBtn.style.display = 'none';
            grid.style.maxHeight = 'none';
        } else {
            expandBtn.style.display = 'block';
            grid.classList.remove('expanded');
            grid.style.maxHeight = '320px';
            expandBtn.style.transform = 'rotate(0deg)';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadHomeMovies();
});
