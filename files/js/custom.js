$(document).ready(function () {
	populateExploreBlock();
})

function populateExploreBlock() {

	var block = $('#blog-grid');

	$.ajax({
		url: "files/data.json",
		success: function (result) {
			// data = JSON.parse(result)

			result.map(function (data) {

				block.append('' +
					'<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">' +

					'<div class="blog-media">' +
					'					<a href="portfolio-single-custom.html" class="thumb-overlay overlay-effect-1 text-light"> ' +
					'<img src='+ data.img + ' alt="SEO IMG NAME">' +
					'<div class="overlay-caption hidden-on-start">' +
					'<h6 class="caption-sub portfolio-category subtitle-2">'+ data.hover_title +'</h6>' +
					'<h4 class="caption-name portfolio-name uppercase">' + data.hover_subtitle + '</h4>' +
					'</div>' +
					'</a>' +
					'</div>' +

					'<div class="blog-desc align-center">' +
					'<div class="blog-headline">' +
					'<h6 class="post-category uppercase">' + data.category + '</h6>' +
					'<h5 class="post-name"><a href="blog-single-custom1.html"><strong>' + data.title + '</strong></a></h5>' +
					'</div>' +
					'<p>' +
					data.intro +
					'</p>' +
					'<ul class="blog-meta">' +
					'<li class="post-date">'+ data.date +'</li>' +
					'<li class="post-comments"><i class="fa fa-comments"></i> 3</li>' +
					'</ul>' +
					'</div>' +
					'</div>'
				);
			})
		}
	});

}

