function initUserTabs() {
    var tabButtons = document.querySelectorAll('.profile-tab-btn');
    var tabPanes = document.querySelectorAll('.profile-tab-pane');

    for (const btn of tabButtons) {
        btn.addEventListener('click', function() {
            var targetTabId = btn.getAttribute('data-tab');

            for (const b of tabButtons) {
                b.classList.remove('active');
            }
            btn.classList.add('active');

            for (const pane of tabPanes) {
                if (pane.id === targetTabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            }
        });
    }
}

function initUserSettings() {
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user) {
        var usernameInput = document.getElementById('settingsUsername');
        var emailInput = document.getElementById('settingsEmail');
        var profileUsername = document.getElementById('profileUsername');
        if (usernameInput) usernameInput.value = user.username;
        if (emailInput) emailInput.value = user.email;
        if (profileUsername) profileUsername.textContent = user.username;
    }

    var settingsForm = document.getElementById('profileSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var usernameInput = document.getElementById('settingsUsername');
            var bioInput = document.getElementById('settingsBio');

            var profileUsername = document.getElementById('profileUsername');
            var profileBio = document.getElementById('profileBio');

            if (usernameInput && profileUsername) {
                profileUsername.textContent = usernameInput.value;
            }

            if (bioInput && profileBio) {
                profileBio.textContent = bioInput.value;
            }

            var saveBtn = settingsForm.querySelector('.settings-save-btn');
            if (saveBtn) {
                var originalText = saveBtn.textContent;
                saveBtn.textContent = 'Saved!';
                setTimeout(function() {
                    saveBtn.textContent = originalText;
                }, 1500);
            }
        });
    }

    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (typeof logoutUser === 'function') {
                logoutUser();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof requireAuth === 'function') {
        var user = requireAuth();
        if (!user) return;
    }
    initUserTabs();
    initUserSettings();
});
