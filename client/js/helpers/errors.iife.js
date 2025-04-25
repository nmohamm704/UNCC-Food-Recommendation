/*  Global error-display helper Loads once, attaches showErrors(json) to window  */

(function () {
    window.showErrors = function (json) {
        // express-validator format        { errors:[ {msg,param}… ] }
        if (json?.errors && Array.isArray(json.errors)) {
            alert(json.errors.map(e => e.msg).join('\n'));
            return;
        }

        // simple message                  { message:"…" }
        if (json?.message) {
            alert(json.message);
            return;
        }

        alert('Unexpected error ─ please try again.');
    };
})();
