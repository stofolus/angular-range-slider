# Angular-range-slider
**This package is completely untested! If you find any bugs please report them to me**

An Angular range slider with accessibility. It only supports horizontal mode with one handle. As for now I'm not going to implement vertical mode or two handles as I don't need them.

This should work in IE9+ (And ofc any real browser like Chrome or FF)

## Demo
[On CodePen](http://codepen.io/anon/pen/gPrVRX)

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

## What's left:
* SASS support

## Usage
Add the `chasselberg.slider` module to your Angular app
```javascript
    angular.module('ch.examples.slider', ['chasselberg.slider']);
```
Add sliders to your views
```html
    <slider model="sliderValue" step="2" min="0" max="100"></slider>
```
