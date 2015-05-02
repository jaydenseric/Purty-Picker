# Purty Picker

A super lightweight visual HSL, RGB and hex color picker with a responsive, touch-friendly and customizable UI. Compatible with [jQuery](https://github.com/jquery/jquery) or [Zepto](https://github.com/madrobby/zepto).

## Demo

Try out `demo.html` [via RawGit](http://rawgit.com/jaydenseric/Purty-Picker/master/demo.html).

<img src="screenshots.png" alt="Screenshots of Purty Picker in Safari" width="314" />

## Features

- Small file-size (~4kb minified) with < 300 lines of source JS ([Spectrum](https://github.com/bgrins/spectrum/blob/master/spectrum.js) exceeds 2000 lines). Easy to understand and customize.
- Compact design with native inputs. The color input also serves as a preview (text color automatically inverts for legibility).
- Fluidly responsive.
- Touch friendly.
- "Retina" quality CSS based UI.
- Semantic class and file names (i.e. `.color-picker` not `.purty-picker`).
- Markup is easily tweaked as it isn't JS generated.
- Automatic initialization.
- Multiple pickers may be used on a page.

## Usage

1. Take a look at [demo.html](https://github.com/jaydenseric/purty-picker/blob/master/demo.html) to see example markup with default styles. Add the `.color-picker` markup to your page, making sure to:
    - Set a default `.color` input value (CSS valid HSL, RGB or hex).
    - Mark the relevant color `.format` option as `selected`.
2. Add [color-picker.css](https://github.com/jaydenseric/purty-picker/blob/master/color-picker.css) to the page.
3. Add [color-picker.js](https://github.com/jaydenseric/purty-picker/blob/master/color-picker.js) to the page for it to automatically find and enable every `.color-picker`.

### Customization

Tweak the markup as much as you like, just keep the core classnames on the core components.

Core styles are clearly commented in [color-picker.scss](https://github.com/jaydenseric/purty-picker/blob/master/color-picker.scss) (which compiles to [color-picker.css](https://github.com/jaydenseric/purty-picker/blob/master/color-picker.css)) so you know what you need to create your own skin.

## Browser Support

For modern browsers (IE10+ and recent versions of Chrome, Safari, Firefox), mostly due to the use of CSS3 linear gradients. Support for older browsers should be possible with a few modifications.

## Dependencies

Requires [jQuery](https://github.com/jquery/jquery) or [Zepto](https://github.com/madrobby/zepto) with core and event modules.

## Todo

- Validation for incorrect color input values.
- On-demand initialization for dynamically inserted color pickers.
