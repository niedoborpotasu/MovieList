const RANKING_API_URL = 'http://localhost:5131/api/ranking';
var currentEditingCard = null;

function applyRankingFilters() {
    var checkboxes = document.querySelectorAll('.status-filters input[name="status"]');
    var checkedValues = [];

    for (const cb of checkboxes) {
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

    var searchInput = document.getElementById('rankingSearch');
    var searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    var ratingSelect = document.getElementById('rankingRatingFilter');
    var ratingVal = ratingSelect && ratingSelect.value ? parseInt(ratingSelect.value, 10) : null;

    var sortSelect = document.getElementById('rankingSort');
    var sortVal = sortSelect ? sortSelect.value : '';

    var grid = document.querySelector('.user-movies-grid');
    var cards = Array.from(document.querySelectorAll('.user-movies-grid .user-movie-card'));

    for (const card of cards) {
        var tag = card.querySelector('.movie-status-tag');
        var cardStatus = tag ? tag.textContent.toLowerCase().trim() : '';

        var titleEl = card.querySelector('h3');
        var title = titleEl ? titleEl.textContent.toLowerCase().trim() : '';

        var ratingEl = card.querySelector('.movie-rating-badge strong');
        var ratingNum = ratingEl ? parseFloat(ratingEl.textContent.split('/')[0].trim()) : 0;

        var normalizedStatus = cardStatus.replace(/\s+/g, '-');
        var statusMatches = checkedValues.length === 0 || checkedValues.includes(cardStatus) || checkedValues.includes(normalizedStatus);
        var searchMatches = !searchVal || title.includes(searchVal);
        var ratingMatches = ratingVal === null || (ratingVal === 10 ? ratingNum >= 10 : ratingNum >= ratingVal);

        if (statusMatches && searchMatches && ratingMatches) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    }

    if (sortVal && grid) {
        cards.sort(function(a, b) {
            var ratingTextA = a.querySelector('.movie-rating-badge strong') ? a.querySelector('.movie-rating-badge strong').textContent : '0';
            var ratingTextB = b.querySelector('.movie-rating-badge strong') ? b.querySelector('.movie-rating-badge strong').textContent : '0';
            var numA = parseFloat(ratingTextA.split('/')[0].trim()) || 0;
            var numB = parseFloat(ratingTextB.split('/')[0].trim()) || 0;

            var titleA = a.querySelector('h3') ? a.querySelector('h3').textContent.toLowerCase().trim() : '';
            var titleB = b.querySelector('h3') ? b.querySelector('h3').textContent.toLowerCase().trim() : '';

            if (sortVal === 'rating-desc') return numB - numA;
            if (sortVal === 'rating-asc') return numA - numB;
            if (sortVal === 'title-asc') return titleA.localeCompare(titleB);
            if (sortVal === 'title-desc') return titleB.localeCompare(titleA);
            return 0;
        });

        for (const card of cards) {
            grid.appendChild(card);
        }
    }
}

function createUserMovieCard(item) {
    var posterHtml = item.poster 
        ? '<img src="' + item.poster + '" alt="' + item.title + '">' 
        : 'Poster';

    var ratingDisplay = (item.rating !== null && item.rating !== undefined) ? item.rating : 'N/A';

    return '<div class="user-movie-card" data-ranking-id="' + item.id + '" data-media-id="' + item.mediaItemId + '">' +
        '<div class="user-movie-poster">' + posterHtml + '</div>' +
        '<div class="user-movie-info">' +
            '<h3>' + item.title + '</h3>' +
            '<p class="movie-status-tag">' + item.watchStatus + '</p>' +
            '<div class="movie-rating-badge">Rating: <strong>' + ratingDisplay + '/10</strong></div>' +
        '</div>' +
        '<button class="edit-movie-btn">Edit</button>' +
    '</div>';
}

async function loadUserRanking() {
    var grid = document.querySelector('.user-movies-grid');
    if (!grid) return;

    var currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!currentUser) {
        grid.innerHTML = '<p style="color: #D8E3ED; padding: 20px;">Please sign in to view your ranking.</p>';
        return;
    }

    grid.innerHTML = '<p style="color: #D8E3ED; padding: 20px;">Loading ranking from database...</p>';

    try {
        var response = await fetch(RANKING_API_URL + '?userId=' + currentUser.id);
        if (!response.ok) {
            throw new Error('Failed to load ranking');
        }

        var items = await response.json();
        if (!items || items.length === 0) {
            grid.innerHTML = '<p style="color: #D8E3ED; padding: 20px;">Your ranking is empty. Add movies to your ranking!</p>';
            return;
        }

        var html = '';
        for (const item of items) {
            html += createUserMovieCard(item);
        }
        grid.innerHTML = html;

        var editButtons = grid.querySelectorAll('.edit-movie-btn');
        for (const btn of editButtons) {
            btn.addEventListener('click', function(e) {
                var card = e.target.closest('.user-movie-card');
                if (card) {
                    openEditModal(card);
                }
            });
        }

        applyRankingFilters();
    } catch (err) {
        grid.innerHTML = '<p style="color: #D8E3ED; padding: 20px;">Could not connect to backend database. Please start backend with dotnet run.</p>';
    }
}

function openEditModal(card) {
    currentEditingCard = card;

    var titleEl = card.querySelector('h3');
    var statusEl = card.querySelector('.movie-status-tag');
    var ratingEl = card.querySelector('.movie-rating-badge strong');

    var title = titleEl ? titleEl.textContent.trim() : 'Movie';
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
        modalRatingInput.type = 'number';
        modalRatingInput.step = '0.1';
        modalRatingInput.min = '1';
        modalRatingInput.max = '10';
        modalRatingInput.value = numericRating === 'N/A' ? '10' : numericRating;
    }

    if (modalStatusSelect) {
        for (const option of modalStatusSelect.options) {
            if (option.text.toLowerCase() === currentStatus.toLowerCase()) {
                option.selected = true;
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

async function saveModalChanges() {
    if (!currentEditingCard) {
        closeModal();
        return;
    }

    var rankingId = currentEditingCard.getAttribute('data-ranking-id');
    var modal = document.querySelector('.movie-modal');
    var modalStatusSelect = modal ? modal.querySelector('.modal-field select') : null;
    var modalRatingInput = modal ? modal.querySelector('.modal-input-text') : null;

    var newStatus = modalStatusSelect ? modalStatusSelect.value : 'Watching';
    var newRating = modalRatingInput ? parseFloat(modalRatingInput.value) : 10;

    if (isNaN(newRating) || newRating < 1) newRating = 1;
    if (newRating > 10) newRating = 10;
    newRating = Math.round(newRating * 10) / 10;

    if (rankingId) {
        try {
            await fetch(RANKING_API_URL + '/' + rankingId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watchStatus: newStatus,
                    rating: newRating
                })
            });
        } catch (err) {
        }
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

    for (const cb of statusCheckboxes) {
        cb.addEventListener('change', applyRankingFilters);
    }

    var searchInput = document.getElementById('rankingSearch');
    if (searchInput) {
        searchInput.addEventListener('input', applyRankingFilters);
    }

    var ratingSelect = document.getElementById('rankingRatingFilter');
    if (ratingSelect) {
        ratingSelect.addEventListener('change', applyRankingFilters);
    }

    var sortSelect = document.getElementById('rankingSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyRankingFilters);
    }

    if (modalBackdrop) {
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

    loadUserRanking();
}

document.addEventListener('DOMContentLoaded', function() {
    initRankingPage();
});
