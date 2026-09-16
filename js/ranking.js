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

    var cards = document.querySelectorAll('.user-movies-grid .user-movie-card');
    for (const card of cards) {
        var tag = card.querySelector('.movie-status-tag');
        var cardStatus = '';
        if (tag) {
            cardStatus = tag.textContent.toLowerCase().trim();
        }

        if (checkedValues.length === 0) {
            card.style.display = 'flex';
        } else {
            var isMatched = false;
            for (const val of checkedValues) {
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
