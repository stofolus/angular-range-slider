# Angular-range-slider

An Angular range slider with accessibility. It only supports horizontal mode with one handle. As for now I'm not going to implement vertical mode or two handles as I don't need them.

This should work in IE9+ (And ofc any real browser like Chrome or FF). Also tested on iOS and Android 4.4 & 6

## Demo
[On CodePen](http://codepen.io/stofolus/pen/NxrmyM)

## Dependencies
Angular

## What's working:
* Model binding
* Min
* Max
* Step
* Dragging the handle
* Touch supported dragging
* Clicking the bar to goto value
* No need to redraw on hide/show or resize
* Aria attributes for a11y
* Keyboard support for a11y

## Usage
### Javascript

Include the script on the site
```html
<script src="./distribute/slider.js"></script>
```

Add the `chasselberg.slider` module to your Angular app
```javascript
    angular.module('your.ng.app', ['chasselberg.slider']);
```
Add sliders to your views
```html
    <slider model="sliderValue" step="2" min="0" max="100"></slider>
```

### SCSS
Include the `slider.scss` in your main SCSS file using
```scss
    @import "slider.scss"
```
You can define the following variables BEFORE you include `slider.scss`
```scss
$ch-slider-bar-height: 10px;
$ch-slider-bar-radius: 10px;
$ch-slider-bar-color: grey;

$ch-slider-handle-height: 20px;
$ch-slider-handle-width: 20px;
$ch-slider-handle-color: blue;
$ch-slider-handle-radius: 9999px;

$ch-slider-fill-color: green;
$ch-slider-disabled-color: grey;
$ch-slider-disabled-fill-color: black;
```

### CSS
If you don't want to use the SCSS file you can instead include the css file in your HTML
```html
    <link href="./distribute/slider.css" rel="stylesheet">
```
