function updateHeaderAuth() {
    var navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (user) {
        navActions.innerHTML = '<a href="user.html" class="user-link"><img src="img/stark_pfp.jpg" class="user-logo" alt="Profile"></a>';
    } else {
        navActions.innerHTML = '<a href="login.html" class="btn-signin">Sign In</a>';
    }

    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-links a');
    for (const link of navLinks) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    }
}

function loadHeader() {
    var headerElement = document.getElementById('main-header');
    if (!headerElement) return;

    fetch('header.html')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            headerElement.innerHTML = data;
            updateHeaderAuth();
        })
        .catch(function(error) {
            console.error('Error loading header:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
});
