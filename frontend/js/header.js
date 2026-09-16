function loadHeader() {
    var headerElement = document.getElementById('main-header');
    if (!headerElement) return;

    fetch('header.html')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            headerElement.innerHTML = data;
        })
        .catch(function(error) {
            console.error('Error loading header:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
});
