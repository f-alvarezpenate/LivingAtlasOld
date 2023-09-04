function filterMarkers(category){
    for (i=0; i < allMarkers.length; i++){
        if (allMarkers[i][0] != category){
            hide(i);
        }
        else{
            show(i);
        }
    }
}
function hide(index) {
    let markers = document.getElementsByClassName("marker");
    markers[index].style.visibility = "hidden";
}

function show(index) {
    let markers = document.getElementsByClassName("marker");
    markers[index].style.visibility = "visible";
}

function showAll() {
    let markers = document.getElementsByClassName("marker");
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.visibility = "visible";
    }
}

// Added for the toggle side navbar
// Make the side navbar become active after a click
const navbarToggle = document.getElementById('navbarToggle');

// Created a function to toggle the sidebar (8/29/23)
function toggleSidebar() {
    const sideNav = document.getElementById('sideNav'); // Replace with your actual sidebar element ID
    sideNav.classList.toggle('active');
}

// Toggle the sidebar when it is clicked
navbarToggle.addEventListener('click', () => {
    toggleSidebar();
});

