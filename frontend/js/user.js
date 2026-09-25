const USERS_API_BASE = 'http://localhost:5131/api/users';

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

function applyUserPhotos(user) {
    if (!user) return;
    var profileAvatar = document.getElementById('profileAvatar');
    var avatarPreview = document.getElementById('avatarPreview');
    var profileBanner = document.getElementById('profileBanner');
    var bannerPreview = document.getElementById('bannerPreview');

    if (user.avatarUrl) {
        if (profileAvatar) profileAvatar.src = user.avatarUrl;
        if (avatarPreview) avatarPreview.src = user.avatarUrl;
    }
    if (user.bannerUrl) {
        if (profileBanner) profileBanner.src = user.bannerUrl;
        if (bannerPreview) bannerPreview.src = user.bannerUrl;
    }
}

function applyUserData(user) {
    if (!user) return;
    var profileUsername = document.getElementById('profileUsername');
    var profileBio = document.getElementById('profileBio');
    var usernameInput = document.getElementById('settingsUsername');
    var bioInput = document.getElementById('settingsBio');
    var emailInput = document.getElementById('settingsEmail');

    if (profileUsername) profileUsername.textContent = user.username || '';
    if (profileBio) profileBio.textContent = user.bio || '';
    if (usernameInput) usernameInput.value = user.username || '';
    if (bioInput) bioInput.value = user.bio || '';
    if (emailInput) emailInput.value = user.email || '';

    applyUserPhotos(user);
}

async function refreshUserData(user) {
    var current = typeof getCurrentUser === 'function' ? getCurrentUser() : user;
    if (!current || !current.id) return;
    try {
        var response = await fetch(USERS_API_BASE + '/' + current.id);
        if (response.ok) {
            var latest = await response.json();
            if (typeof setCurrentUser === 'function') {
                setCurrentUser(latest);
            }
            applyUserData(latest);
        }
    } catch (err) {}
}

function initPhotoUploads(user) {
    if (!user || !user.id) return;

    var avatarFileInput = document.getElementById('avatarFileInput');
    var avatarFileName = document.getElementById('avatarFileName');
    var uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    var avatarPreview = document.getElementById('avatarPreview');
    var avatarStatus = document.getElementById('avatarUploadStatus');
    var selectedAvatarFile = null;

    if (avatarFileInput && uploadAvatarBtn) {
        avatarFileInput.addEventListener('change', function(e) {
            var file = e.target.files && e.target.files[0];
            if (file) {
                selectedAvatarFile = file;
                if (avatarFileName) avatarFileName.textContent = file.name;
                if (avatarPreview) avatarPreview.src = URL.createObjectURL(file);
                uploadAvatarBtn.disabled = false;
                if (avatarStatus) {
                    avatarStatus.textContent = '';
                    avatarStatus.className = 'photo-status-msg';
                }
            }
        });

        uploadAvatarBtn.addEventListener('click', async function() {
            if (!selectedAvatarFile) return;

            uploadAvatarBtn.disabled = true;
            var originalText = uploadAvatarBtn.textContent;
            uploadAvatarBtn.textContent = 'Uploading...';

            if (avatarStatus) {
                avatarStatus.textContent = 'Uploading to Cloudinary...';
                avatarStatus.className = 'photo-status-msg info';
            }

            var formData = new FormData();
            formData.append('file', selectedAvatarFile);

            try {
                var response = await fetch(USERS_API_BASE + '/' + user.id + '/avatar', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    var errorText = await response.text();
                    throw new Error(errorText || 'Failed to upload avatar.');
                }

                var updatedUser = await response.json();
                if (typeof setCurrentUser === 'function') {
                    setCurrentUser(updatedUser);
                }
                user = updatedUser;
                applyUserPhotos(updatedUser);

                var userLogo = document.querySelector('.user-logo');
                if (userLogo && updatedUser.avatarUrl) {
                    userLogo.src = updatedUser.avatarUrl;
                }

                if (avatarStatus) {
                    avatarStatus.textContent = 'Avatar uploaded successfully!';
                    avatarStatus.className = 'photo-status-msg success';
                }
            } catch (err) {
                if (avatarStatus) {
                    avatarStatus.textContent = err.message || 'Upload failed.';
                    avatarStatus.className = 'photo-status-msg error';
                }
                uploadAvatarBtn.disabled = false;
            } finally {
                uploadAvatarBtn.textContent = originalText;
            }
        });
    }

    var bannerFileInput = document.getElementById('bannerFileInput');
    var bannerFileName = document.getElementById('bannerFileName');
    var uploadBannerBtn = document.getElementById('uploadBannerBtn');
    var bannerPreview = document.getElementById('bannerPreview');
    var bannerStatus = document.getElementById('bannerUploadStatus');
    var selectedBannerFile = null;

    if (bannerFileInput && uploadBannerBtn) {
        bannerFileInput.addEventListener('change', function(e) {
            var file = e.target.files && e.target.files[0];
            if (file) {
                selectedBannerFile = file;
                if (bannerFileName) bannerFileName.textContent = file.name;
                if (bannerPreview) bannerPreview.src = URL.createObjectURL(file);
                uploadBannerBtn.disabled = false;
                if (bannerStatus) {
                    bannerStatus.textContent = '';
                    bannerStatus.className = 'photo-status-msg';
                }
            }
        });

        uploadBannerBtn.addEventListener('click', async function() {
            if (!selectedBannerFile) return;

            uploadBannerBtn.disabled = true;
            var originalText = uploadBannerBtn.textContent;
            uploadBannerBtn.textContent = 'Uploading...';

            if (bannerStatus) {
                bannerStatus.textContent = 'Uploading to Cloudinary...';
                bannerStatus.className = 'photo-status-msg info';
            }

            var formData = new FormData();
            formData.append('file', selectedBannerFile);

            try {
                var response = await fetch(USERS_API_BASE + '/' + user.id + '/banner', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    var errorText = await response.text();
                    throw new Error(errorText || 'Failed to upload banner.');
                }

                var updatedUser = await response.json();
                if (typeof setCurrentUser === 'function') {
                    setCurrentUser(updatedUser);
                }
                user = updatedUser;
                applyUserPhotos(updatedUser);

                if (bannerStatus) {
                    bannerStatus.textContent = 'Banner uploaded successfully!';
                    bannerStatus.className = 'photo-status-msg success';
                }
            } catch (err) {
                if (bannerStatus) {
                    bannerStatus.textContent = err.message || 'Upload failed.';
                    bannerStatus.className = 'photo-status-msg error';
                }
                uploadBannerBtn.disabled = false;
            } finally {
                uploadBannerBtn.textContent = originalText;
            }
        });
    }
}

function initUserSettings(user) {
    if (user) {
        applyUserData(user);
    }

    var settingsForm = document.getElementById('profileSettingsForm');
    var statusMsg = document.getElementById('settingsStatusMsg');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            var current = typeof getCurrentUser === 'function' ? getCurrentUser() : user;
            if (!current || !current.id) return;

            var usernameInput = document.getElementById('settingsUsername');
            var bioInput = document.getElementById('settingsBio');
            var emailInput = document.getElementById('settingsEmail');
            var saveBtn = settingsForm.querySelector('.settings-save-btn');

            var updatedUsername = usernameInput ? usernameInput.value.trim() : '';
            var updatedBio = bioInput ? bioInput.value.trim() : '';
            var updatedEmail = emailInput ? emailInput.value.trim() : '';

            if (!updatedUsername) {
                if (statusMsg) {
                    statusMsg.textContent = 'Username cannot be empty.';
                    statusMsg.className = 'photo-status-msg error';
                    statusMsg.style.display = 'block';
                }
                return;
            }

            var originalText = saveBtn ? saveBtn.textContent : 'Save Changes';
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
            }

            try {
                var response = await fetch(USERS_API_BASE + '/' + current.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: updatedUsername,
                        bio: updatedBio,
                        email: updatedEmail
                    })
                });

                if (!response.ok) {
                    var errText = await response.text();
                    throw new Error(errText || 'Failed to update profile.');
                }

                var updatedUser = await response.json();
                if (typeof setCurrentUser === 'function') {
                    setCurrentUser(updatedUser);
                }
                applyUserData(updatedUser);

                if (statusMsg) {
                    statusMsg.textContent = 'Profile updated successfully!';
                    statusMsg.className = 'photo-status-msg success';
                    statusMsg.style.display = 'block';
                }
                if (saveBtn) {
                    saveBtn.textContent = 'Saved!';
                }
            } catch (err) {
                if (statusMsg) {
                    statusMsg.textContent = err.message || 'Error updating profile.';
                    statusMsg.className = 'photo-status-msg error';
                    statusMsg.style.display = 'block';
                }
            } finally {
                if (saveBtn) {
                    saveBtn.disabled = false;
                    setTimeout(function() {
                        saveBtn.textContent = originalText;
                        if (statusMsg) {
                            setTimeout(function() {
                                statusMsg.style.display = 'none';
                            }, 3000);
                        }
                    }, 1500);
                }
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

    initPhotoUploads(user);
    refreshUserData(user);
}

document.addEventListener('DOMContentLoaded', function() {
    var user = null;
    if (typeof requireAuth === 'function') {
        user = requireAuth();
        if (!user) return;
    } else if (typeof getCurrentUser === 'function') {
        user = getCurrentUser();
    }
    initUserTabs();
    initUserSettings(user);
});
