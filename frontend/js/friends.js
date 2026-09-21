function initFriendsPage() {
    var searchInput = document.getElementById('friendsSearchInput');
    var friendsGrid = document.getElementById('friendsGrid');
    var noFriendsMsg = document.getElementById('noFriendsFound');
    var cards = document.querySelectorAll('.friend-card-full');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var filterVal = searchInput.value.toLowerCase().trim();
            var visibleCount = 0;

            for (const card of cards) {
                var name = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
                var text = card.textContent.toLowerCase();

                if (!filterVal || name.includes(filterVal) || text.includes(filterVal)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }

            if (noFriendsMsg) {
                if (visibleCount === 0) {
                    noFriendsMsg.style.display = 'block';
                } else {
                    noFriendsMsg.style.display = 'none';
                }
            }
        });
    }

    var tabButtons = document.querySelectorAll('.friends-tab-btn');
    for (const btn of tabButtons) {
        btn.addEventListener('click', function() {
            for (const b of tabButtons) {
                b.classList.remove('active');
            }
            btn.classList.add('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initFriendsPage();
});
