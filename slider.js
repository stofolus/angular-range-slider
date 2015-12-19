angular.module('chasselberg.slider', [])
    .directive('slider', SliderDirective);

function SliderDirective() {
    var directive = {
        restrict: 'EA',
        scope: {},
        link: linkFunction,
        template: '<div class="ch-slider">' +
            '<div class="ch-slider-bar">' +
            '<span class="ch-slider-handle"></span>' +
            '<span class="ch-slider-fill></span>"' +
            '</div>' +
            '</div>'
    };
    return directive;

    function linkFunction($scope, $element) {
        var $bar = angular.element($element[0].querySelector('.ch-slider-bar'));
        var $handle = angular.element($element[0].querySelector('.ch-slider-handle'));

        handleWatcher();


        function handleWatcher() {
            var isActive = false;
            $handle.on('mousedown', function() {
                isActive = true;
            });
            angular.element(window).on('mouseup', function() {
                if (isActive) {
                    isActive = false;
                }
            });
            angular.element(window).on('mousemove', function(event) {
                if (isActive) {
                    console.log('MouseMove!');
                    calcPosition(event);
                }
            });
        }

        function calcPosition(event) {
            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                barWidth = $bar[0].getBoundingClientRect().width,
                barOffset = (($bar[0].getBoundingClientRect().left + document.body.scrollLeft) - event.pageX),
                handlePosition = Math.abs(barOffset);
                if(handlePosition < 0 || barOffset > 0) {
                    handlePosition = 0;
                }
                if(handlePosition > barWidth) {
                    handlePosition = barWidth;
                }
                console.log(barOffset);
                console.log(handlePosition);
                handlePosition = handlePosition - halfOfHandle;
                console.log(handlePosition);
                $handle.css('left', handlePosition + 'px');

        }
    };




};
