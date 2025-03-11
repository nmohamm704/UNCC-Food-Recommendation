const toggleCheckbox = document.getElementById('my-toggle');

toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "white";
        console.log("Dark Mode ON");
    } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        console.log("Light Mode ON");
    }
});