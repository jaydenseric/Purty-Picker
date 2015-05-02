// Purty Picker: https://github.com/jaydenseric/Purty-Picker

$(function() {
	'use strict';

//-------------------------------------------- Color conversions

//---------------------- Convert HSL to RGB

// Source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

	function HSLToRGB(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;
		var r, g, b;
		if (s == 0) {
			r = g = b = l; // Achromatic
		} else {
			var hueToRGB = function(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};
			var	q = l < 0.5 ? l * (1 + s) : l + s - l * s,
				p = 2 * l - q;
			r = hueToRGB(p, q, h + 1/3);
			g = hueToRGB(p, q, h);
			b = hueToRGB(p, q, h - 1/3);
		}
		return {
			red		: Math.round(r * 255),
			green	: Math.round(g * 255),
			blue	: Math.round(b * 255)
		};
	}

//---------------------- Convert RGB to HSL

// Source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

	function RGBToHSL(r, g, b) {
		r /= 255,
		g /= 255,
		b /= 255;
		var	max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if (max == min) {
			h = s = 0; // Achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return {
			hue			: Math.round(h * 360),
			saturation	: Math.round(s * 100),
			lightness	: Math.round(l * 100)
		};
	}

//---------------------- Convert RGB to Hex

// Source: http://stackoverflow.com/a/5624139

	function RGBToHex(r, g, b) {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

//---------------------- Convert hex to RGB

// Source: http://stackoverflow.com/a/11508164

	function hexToRGB(hex) {
		var bigInt	= parseInt(hex.replace('#', ''), 16),
			r		= (bigInt >> 16) & 255,
			g		= (bigInt >> 8) & 255,
			b		= bigInt & 255;
		return {
			red		: r,
			green	: g,
			blue	: b
		};
	}

//---------------------- Convert hex to HSL

	function hexToHSL(hex) {
		var RGB = hexToRGB(hex);
		return RGBToHSL(RGB.red, RGB.green, RGB.blue);
	}

//---------------------- Convert HSL to hex

	function HSLToHex(h, s, l) {
		var RGB = HSLToRGB(h, s, l);
		return RGBToHex(RGB.red, RGB.green, RGB.blue);
	}

//-------------------------------------------- Setup each color picker

	$.each($('.color-picker'), function() {

//---------------------- Find componenets

		var	$picker				= $(this),
			$formatInput		= $picker.find('.format'),
			$colorInput			= $picker.find('.color'),
			$lightnessInput		= $picker.find('input[type=range]'),
			$spectrum			= $picker.find('.spectrum'),
			$lightnessFilter	= $picker.find('.lightness-filter'),
			$pin				= $picker.find('.pin');

//---------------------- Get current color in HSL

		function getHSL() {
			var	position	= $picker.find('.pin').position(),
				width		= $spectrum.width(),
				height		= $spectrum.height();
			return {
				hue			: Math.round(position.left / width * 360),
				saturation	: Math.round(position.top / height * 100),
				lightness	: $lightnessInput.val()
			};
		}

//---------------------- Output color in desired format

		function updateColorInput() {
			var	HSL = getHSL();
			switch ($formatInput.val()) {
				case 'HSL':
					$colorInput.val('hsl(' + HSL.hue + ', ' + HSL.saturation + '%, ' + HSL.lightness + '%)');
					break;
				case 'RGB':
					var RGB = HSLToRGB(HSL.hue, HSL.saturation, HSL.lightness);
					$colorInput.val('rgb(' + RGB.red + ', ' + RGB.green + ', ' + RGB.blue + ')');
					break;
				case 'Hex':
					$colorInput.val(HSLToHex(HSL.hue, HSL.saturation, HSL.lightness));
					break;
			}
			// Trigger color picker change event for custom callbacks
			$picker.trigger('change');
		}

//---------------------- Set color format

		$formatInput.on('change', function() {
			updateColorInput();
		});

//---------------------- Set color

		$colorInput.on('change', function() {
			// Get the color values in HSL format
			var HSL;
			switch ($formatInput.val()) {
				case 'HSL':
					var values = $(this).val().match(/\d+/g);
					HSL = {
						hue			: values[0],
						saturation	: values[1],
						lightness	: values[2]
					};
					break;
				case 'RGB':
					var values = $(this).val().match(/\d+/g);
					HSL = RGBToHSL(values[0], values[1], values[2]);
					break;
				case 'Hex':
					HSL = hexToHSL($(this).val());
					break;
			}
			// Set the lightness
			$lightnessInput.val(HSL.lightness);
			setLightness(HSL.lightness);
			// Place the pin
			$pin.css({
				left	: HSL.hue / 360 * 100 + '%',
				top		: HSL.saturation + '%'
			});
			// Trigger color picker change event for custom callbacks
			$picker.trigger('change');
		});

//---------------------- Set lightness

//---------- Set the lightness spectrum overlay

		function setLightness(lightness) {
			var color,
				alpha;
			if (lightness <= 50) {
				color = '0, 0, 0';
				alpha = 1 - lightness / 100 * 2;
			} else {
				color = '255, 255, 255';
				alpha = lightness / 100 * 2 - 1;
			}
			// Apply lightness to the spectrum
			$lightnessFilter.css('background-color', 'rgba(' + color + ', ' + alpha + ')');
		}

//---------- Lightness input interaction

		$lightnessInput.on('change', function() {
			setLightness($(this).val());
			updateColorInput();
		});

//---------------------- Set hue, saturation via pin

//---------- Move the pin

		var movePin = function(event) {
			var	bounds	= $spectrum[0].getBoundingClientRect(),
				x		= event.clientX - bounds.left,
				y		= event.clientY - bounds.top;
			// Prevent dragging pin outside spectrum area horizontally
			if (x < 0) x = 0;
			else if (x > bounds.width) x = bounds.width;
			// Prevent dragging pin outside spectrum area vertically
			if (y < 0) y = 0;
			else if (y > bounds.height) y = bounds.height;
			// Place the pin
			$pin.css({
				left	: x / bounds.width * 100 + '%',
				top		: y / bounds.height * 100 + '%'
			});
			// Output new color value
			updateColorInput();
		};

//---------- Pin interaction

		$spectrum.on('mousedown', function(event) {
			event.preventDefault();
			movePin(event);
			$spectrum.addClass('active');
			$(document).on('mousemove', movePin);
		});

		$(document).on('mouseup', function() {
			$spectrum.removeClass('active');
			$(document).off('mousemove', movePin);
		});

		$spectrum.on('touchmove touchstart', movePin);

//---------------------- Output color preview

		$picker.on('change', function() {
			$colorInput.css('background-color', $colorInput.val()).toggleClass('dark', $lightnessInput.val() <= 50);
		});

//---------------------- Initialize this color picker

		$colorInput.trigger('change');
	});
});