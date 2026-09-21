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
    var settingsForm = document.getElementById('profileSettingsForm');
    if (!settingsForm) return;

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

document.addEventListener('DOMContentLoaded', function() {
    initUserTabs();
    initUserSettings();
});
