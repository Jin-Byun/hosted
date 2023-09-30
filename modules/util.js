module.exports = function get_date() {
    const today = new Date(Date.now());
    return today.toString();
}
