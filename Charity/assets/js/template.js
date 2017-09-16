jQuery(document).ready(function($) {

	$(".headroom").headroom({
		"tolerance": 20,
		"offset": 50,
		"classes": {
			"initial": "animated",
			"pinned": "slideDown",
			"unpinned": "slideUp"
		}
	});

});

$('#searchPageBtn').on('click', function(event) {
    event.preventDefault();
    var url = $(this).data('target');
    location.replace(url);
});

//<button type="submit" class="mybtn" data-target="/search.html">Search</button>