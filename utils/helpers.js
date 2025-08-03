function relativeDateString(date) {
    let now = new Date();
    let diff = now - new Date(date);

    if (diff < 1000 * 60) return "just now";
    if (diff < 1000 * 60 * 2) return "1 minute ago";
    if (diff < 1000 * 60 * 60) return Math.floor(diff / (1000 * 60)) + " minutes ago";
    if (diff < 1000 * 60 * 60 * 2) return "1 hour ago";
    if (diff < 1000 * 60 * 60 * 24) return Math.floor(diff / (1000 * 60 * 60)) + " hours ago";

    if (diff < 1000 * 60 * 60 * 24 * 365)
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function circleNumberString(index) {
    // 0 -> ①, etc...
    return String.fromCharCode(0x2460 + index);
}

function myConfirm(message, yes = "Yes", no = "No") {
    return new Promise((resolve) => {
        // Implementation would go here - this is just a placeholder
        // In the actual refactor, you'd move the full implementation
        resolve(window.confirm(message));
    });
}

export { relativeDateString, circleNumberString, myConfirm };
