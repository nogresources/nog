module.exports = function (_nog) { 
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    _nog.resources.forEach(function(resource) {

        let output = Object.keys(resource).map(function (key) {
            return capitalizeFirstLetter(key) + ': ' + resource[key];
        }).join(' | ')

        console.log(output)
    });
};