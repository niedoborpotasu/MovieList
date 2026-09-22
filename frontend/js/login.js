const USERS_API_URL = 'http://localhost:5131/api/users';

function showMessage(text, isError) {
    var box = document.getElementById('authMessage');
    if (!box) return;
    box.textContent = text;
    box.className = 'auth-message ' + (isError ? 'error' : 'success');
    box.style.display = 'block';
}

function initAuthTabs() {
    var tabLoginBtn = document.getElementById('tabLoginBtn');
    var tabRegisterBtn = document.getElementById('tabRegisterBtn');
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var messageBox = document.getElementById('authMessage');

    if (!tabLoginBtn || !tabRegisterBtn) return;

    tabLoginBtn.addEventListener('click', function() {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (registerForm) registerForm.style.display = 'none';
        if (messageBox) messageBox.style.display = 'none';
    });

    tabRegisterBtn.addEventListener('click', function() {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        if (registerForm) registerForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
        if (messageBox) messageBox.style.display = 'none';
    });
}

function initAuthForms() {
    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var username = document.getElementById('registerUsername').value.trim();
            var email = document.getElementById('registerEmail').value.trim();
            var password = document.getElementById('registerPassword').value;

            try {
                var response = await fetch(USERS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });

                if (!response.ok) {
                    var errText = await response.text();
                    showMessage(errText || 'Registration failed. Try again.', true);
                    return;
                }

                var createdUser = await response.json();
                if (typeof setCurrentUser === 'function') {
                    setCurrentUser(createdUser);
                }
                showMessage('Account created successfully! Redirecting...', false);
                setTimeout(function() {
                    window.location.href = 'user.html';
                }, 1000);
            } catch (err) {
                showMessage('Could not connect to backend server on http://localhost:5131.', true);
            }
        });
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var email = document.getElementById('loginEmail').value.trim().toLowerCase();
            var password = document.getElementById('loginPassword').value;

            try {
                var response = await fetch(USERS_API_URL);
                if (!response.ok) {
                    throw new Error('Could not fetch users');
                }

                var users = await response.json();
                var matchedUser = users.find(function(u) {
                    return u.email && u.email.toLowerCase() === email;
                });

                if (matchedUser) {
                    if (typeof setCurrentUser === 'function') {
                        setCurrentUser(matchedUser);
                    }
                    showMessage('Logged in successfully! Redirecting...', false);
                    setTimeout(function() {
                        window.location.href = 'user.html';
                    }, 800);
                } else {
                    showMessage('No user found with this email address.', true);
                }
            } catch (err) {
                showMessage('Could not connect to backend server on http://localhost:5131.', true);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user && localStorage.getItem('loggedOut') !== 'true') {
        window.location.href = 'user.html';
        return;
    }
    initAuthTabs();
    initAuthForms();
});
