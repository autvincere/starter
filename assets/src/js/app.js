/* global FWC, socialAPIs, WOW, FB */

'use strict';

/*
	Markup-based means of executing JavaScript on page load (using jQuery)

	How to use:

	Add this to your <body>
	<body id="myapp" data-controller="module" data-action="action1 action2">

	Replace "myapp" to match what you put as 
	the body ID (use something meaningful and short for the project)

	Replace "MYAPP" to match what you put as the body ID (but capitalized)
*/

(function($, window, document, undefined) {

	var FWC = window.FWC = window.FWC || {};

	FWC.util = {
		exec: function(controller, action) {
			var ns = FWC,
				act = (action === undefined) ? 'init' : action;

			if (controller !== '' && ns[controller] && typeof ns[controller][act] === 'function') {
				ns[controller][act]();
			}
		},
		init: function() {
			var el = document.getElementById('fwc'), // Update the body ID here
				controller = el.getAttribute('data-controller'),
				actions = el.getAttribute('data-action');

			FWC.util.exec('common');
			FWC.util.exec(controller);

			// do all the actions too.
			$.each(actions.split(/\s+/), function(i, action){
				FWC.util.exec(controller, action);
			});
		}
	};


	// Common to the whole app/site
	FWC.common = (function() {
		
		var init = function() {

			// Initialize FB SDK
			socialAPIs.facebook.init({
				lang: $('html').attr('lang'),
				fbInitOptions: {
					appId: $('body').data('fwc-fbappid'),
					status: false,
					xfbml: false,
					version: 'v2.3'
				},
				FBhasLoaded: function() {
					console.log('Facebook JS SDK ready!');

					$('.js-fb-share').on('click', function(e) {
						e.preventDefault();
						FB.ui({
							method: 'feed',
							link: $(this).attr('data-fb-link'),
							caption: $(this).attr('data-fb-caption'),
							description: $(this).attr('data-fb-description'),
							picture: $(this).attr('data-fb-picture'),
						}, function(response){});
					});
				}
			});

			// Initialize YouTube SDK
			socialAPIs.youtube.init({
				YThasLoaded: function() {
					console.log('YouTube JS API ready!');
				}
			});

			// Animate ALL the things
			var wow = new WOW({
				boxClass:     'anim',      // default
				animateClass: 'animated', // default
				offset:       100,          // default
				mobile:       true,       // default
				live:         true        // default
			});

			wow.init();

		};

		return {
			init: init
		};
	})();


	// Example module for the homepage
	FWC.home = (function() {
		var init = function() {
			FWC.instagramBlocks.init();
			FWC.ambassadorsSlider.init();
			FWC.videoPanel.init();
			FWC.perspectiveWithMousemove.init();

			$('.js-tweet-btn').on('click', function(e) {
				var width  = 575,
				height = 400,
				left   = ($(window).width()  - width)  / 2,
				top    = ($(window).height() - height) / 2,
				url    = this.href,
				opts   = 'status=1' +
								 ',width='  + width  +
								 ',height=' + height +
								 ',top='    + top    +
								 ',left='   + left;

				window.open(url, 'twitter', opts);
				e.preventDefault();
			});
		};

		return {
			init: init
		};
	})();


	// Instagram gallery
	FWC.instagramBlocks = (function() {
		var $el = 				$('#js-instagram-blocks'),
				$toggleBtn =	$el.find('.instagram-blocks__toggle'),
				$items = 			$el.find('.instagram-blocks__item');
		
		var init = function() {

			$items.addClass('is-closed');

			$toggleBtn.on('click', function() {
				$(this).parents('.instagram-blocks__item').toggleClass('is-closed');
			});
		};

		return {
			init: init
		};
	})();


	// Video panel
	FWC.videoPanel = (function() {
		var $playBtn = $('.panel-video__play'),
				$closeBtn = $('.panel-video__close'),
				$panelContent = $('.panel-video'),
				player = null;

		var init = function() {
			$playBtn.on('click', function(e) {
				togglePlayer();
			});

			$closeBtn.on('click', function(e) {
				togglePlayer();
			});
		};

		var togglePlayer = function() {
	
			smoothScroll.animateScroll( null, '#a_video', {
				speed: 500, // Integer. How fast to complete the scroll in milliseconds
				easing: 'easeInOutCubic', // Easing pattern to use
				updateURL: true, // Boolean. Whether or not to update the URL with the anchor hash on scroll
				offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
				callbackBefore: function ( toggle, anchor ) {}, // Function to run before scrolling
				callbackAfter: function ( toggle, anchor ) {
					
					// Triggers the opening/closing CSS animations
					$panelContent.toggleClass('is-video-opened');
					
					// We have to re-create the player everytime because of iOS limitations
					if(player === null) {
						createPlayer();
					}else {
						player.destroy();
						player = null;
					}
				} // Function to run after scrolling
			});
		};

		var createPlayer = function() {

			$panelContent.toggleClass('is-initialized');

			window.player = player = new YT.Player('panel-video__player', {
				height: '390',
				width: '640',
				videoId: $playBtn.attr('data-yt-id'),
				playerVars: { 
					'rel': 0,
					'enablejsapi': 1
				},
				events: {
					'onReady': function(event) {
						if(!device.ios()) {
							player.playVideo();
						}
						
						dataLayer.push({
							'event': 'track-youtube',
							'player_id': $playBtn.attr('data-yt-id')
						});
					}
				}
			});
		};

		return {
			init: init,
			player: player
		};
	})();


	FWC.perspectiveWithMousemove = (function() {
	
		var init = function() {
			$('body').mousemove(function(event) {
				var
					cx = Math.ceil($('body').width() / 2.0),
					cy = Math.ceil($('body').height() / 2.0),
					dx = event.pageX - cx,
					dy = event.pageY - cy,
					tiltx = (dy / cy),
					tilty = - (dx / cx),
					radius = Math.sqrt(Math.pow(tiltx,2) + Math.pow(tilty,2)),
					degree = (radius * 10);

				$('.panel-twitter__perspective-wrap').css('-webkit-transform','rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)');
			});
		};

		return {
			init: init
		};
	})();


	FWC.ambassadorsSlider = (function() {
		
		var init = function() {

			$('.ambassadors').on('init', function(event, slick){
				$('.ambassadors').append('<div class="ambassadors__nav"><div class="container"><span class="ambassadors__current">1/5</span></div></div>');
				$('.ambassadors__prev').prependTo($('.ambassadors__nav .container'));
				$('.ambassadors__next').prependTo($('.ambassadors__nav .container'));
			});

			// On before slide change
			$('.ambassadors').on('afterChange', function(event, slick, currentSlide){
				$('.ambassadors__current').html(currentSlide + 1 + '/5');
			});

			$('.ambassadors').slick({
				dots: false,
				infinite: true,
				speed: 250,
				fade: false,
				arrows: true,
				draggable: false,
				prevArrow: '<button type="button" class="ambassadors__prev"><svg class="prev-icon"><use xlink:href="#svg--arrow-icon"></use></svg></button>',
				nextArrow: '<button type="button" class="ambassadors__next"><svg class="next-icon"><use xlink:href="#svg--next-icon"></use></svg></button>'
			});

		};

		return {
			init: init
		};
	})();


})(jQuery, window, document);


// Let's get started
$(document).ready(FWC.util.init);
