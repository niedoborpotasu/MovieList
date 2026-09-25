function getCurrentUser() {
    var userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        return null;
    }
    try {
        return JSON.parse(userJson);
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.removeItem('loggedOut');
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('loggedOut', 'true');
    window.location.href = 'login.html';
}

function requireAuth() {
    var user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}
