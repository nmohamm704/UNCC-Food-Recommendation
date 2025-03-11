const toggleCheckbox = document.getElementById('my-toggle');

toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        console.log("Toggle is ON");
    } else {
        console.log("Toggle is OFF");
    }
});