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
        var ratingNum = ratingEl ? parseInt(ratingEl.textContent.split('/')[0].trim(), 10) : 0;

        var statusMatches = checkedValues.length === 0 || checkedValues.includes(cardStatus) || checkedValues.includes(cardStatus.replace(' ', '-'));
        var searchMatches = !searchVal || title.includes(searchVal);
        var ratingMatches = ratingVal === null || (ratingVal === 10 ? ratingNum === 10 : ratingNum >= ratingVal);

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
            var numA = parseInt(ratingTextA.split('/')[0].trim(), 10) || 0;
            var numB = parseInt(ratingTextB.split('/')[0].trim(), 10) || 0;

            var titleA = a.querySelector('h3') ? a.querySelector('h3').textContent.toLowerCase().trim() : '';
            var titleB = b.querySelector('h3') ? b.querySelector('h3').textContent.toLowerCase().trim() : '';

            if (sortVal === 'rating-desc') {
                return numB - numA;
            }
            if (sortVal === 'rating-asc') {
                return numA - numB;
            }
            if (sortVal === 'title-asc') {
                return titleA.localeCompare(titleB);
            }
            if (sortVal === 'title-desc') {
                return titleB.localeCompare(titleA);
            }
            return 0;
        });

        for (const card of cards) {
            grid.appendChild(card);
        }
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
        modalRatingInput.value = numericRating;
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

    applyRankingFilters();

    if (!modalBackdrop) return;

    var editButtons = document.querySelectorAll('.edit-movie-btn');
    for (const btn of editButtons) {
        btn.addEventListener('click', function(e) {
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

document.addEventListener('DOMContentLoaded', function() {
    initRankingPage();
});
