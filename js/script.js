$(function () {
	var isMobile;
	if ($(window).innerWidth() > 768) {
		$('.landing-section_mobile').remove();
		$('.section_mobile').remove();
		isMobile = false;
	} else {
		$('.landing-section_desktop').remove();
		isMobile = true;
		$('.landing-car').addClass('landing-car_mobile');
		$('.landing-section-title-collapse, .landing-section-block').hide();
	}

	var $video = $('.landing-section-video'),
		video;
	//if (device.ios() || device.mobile() || !window.atob) {
	//	$video.remove();
	//} else {
		video = $('video', $video).get(0);
	//}
	if (device.android()) {
		$('.check-phone-input')
			.on('focus', function () {
				setTimeout(function () {
					if ($(window).innerHeight() < 100) {
						$('.logo').hide();
						$('.check-phone').css('padding-top', '0');
					}
				}, 300);
			})
			.on('blur', function () {
				$('.logo').show();
				$('.check-phone').css('padding-top', '');
			});
	}

	var intervalRewind;
	$('.landing-sections').fullpage({
		afterLoad: function (anchorLink, index) {
			if (index === 1) {
				intervalRewind = setInterval(function(){
					video.currentTime += 1 / 24;
					if (video.currentTime >= 29) video.currentTime = 0;
					console.log(video.currentTime);
				}, 1000 / 24);
				//if (video) video.play();
			} else {
				clearInterval(intervalRewind);
			}
			if (device.ios()) $('.landing-sections').fullpage.reBuild();
			placeToggler();
		},
		afterRender: function() {
			$('.landing-cover').fadeOut(600, function () {
				$(this).remove();
			});
		},
		onLeave: function (index, nextIndex, direction) {
			var landingIndex = nextIndex - 1;
			if (landingIndex >= 5) {
				landingIndex += isMobile ? 0 : 1;
			}

			$('.landing-fixed')
				.attr('class', 'landing-fixed')
				.addClass('landing-fixed_' + landingIndex)
				.addClass(landingIndex == 6 ? 'landing-fixed_final' : '');

			var title_1 = $('.landing-title_1');
			if (landingIndex > 0 && landingIndex < 4) {
				title_1.addClass('landing-title_active')
			} else title_1.removeClass('landing-title_active');

			var title_2 = $('.landing-title_2');
			if (landingIndex >= 4 && landingIndex < 6) {
				title_2.addClass('landing-title_active')
			} else title_2.removeClass('landing-title_active');

			$('.landing-section.landing-section_active').removeClass('landing-section_active');
			$('.landing-section_' + landingIndex).addClass('landing-section_active');

		}
	});

	$('.landing-section-gonext span').click(function () {
		$('.landing-sections').fullpage.moveSectionDown();
	});

	$('.landing-phone').on('touchstart', function (e) {
		if ($(e.target).is('input, a')) return;
		$('.landing-sections').fullpage.moveSectionUp();
	});

	$(window).on('orientationchange', function () {
		//trying to get rid of ios orientation change bugs
		$('input[type="text"]').blur();
		$('html').hide();
		$('.landing-car img').hide();
		setTimeout(function () {
			$('.landing-car img').fadeIn(100);
			$('html').fadeIn(500);
			$('.landing-sections').fullpage.reBuild();
			placeToggler();
		}, 500);
	});

	$(window).resize(placeToggler);
	function placeToggler (e) {
		var $toggler = $('.landing-section-title-collapse-toggler');
		var $fixedToggler = $('.fixed-toggler');
		if ($toggler.is(':visible')) {
			if (!$fixedToggler.length) {
				$fixedToggler = $('<div></div>').addClass('fixed-toggler');
				$fixedToggler.css({
					position: 'fixed'
				});
				$fixedToggler.click(function (e) {
					var $section = $toggler.closest('.landing-section');
					if ($section.is('.landing-section_collapsed')) {
						$section.removeClass('landing-section_collapsed');
						$toggler.text('Показать');
					} else {
						$section.addClass('landing-section_collapsed');
						$toggler.text('Свернуть');
					}
					placeToggler();
				});
				$('body').append($fixedToggler);
			}
			$fixedToggler.css({
				display: 'block',
				top: $toggler.offset().top,
				left: $toggler.offset().left,
				width: $toggler.innerWidth(),
				height: $toggler.innerHeight()
			});
		} else {
			$fixedToggler.hide();
		}
	}

});