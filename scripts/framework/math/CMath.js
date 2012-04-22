define(
[],
function() {
	Math.nearestPowerOf = function(power, val) {
		return Math.pow(power, Math.round(Math.log(val) / Math.log(power))); 
	};	

	Math.degToRad = function(deg) { return deg * Math.PI / 180; }

	Math.radToDeg = function(rad) { return rad / Math.PI * 180; }
});