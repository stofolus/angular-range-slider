angular.module('chasselberg.slider', [])
    .directive('slider', SliderDirective);

function SliderDirective() {
    var directive = {
        restrict: 'EA',
        scope: {
            model: '=',
            min: '@',
            max: '@',
            step: '@'
        },
        link: linkFunction,
        template: '<div class="ch-slider" tabindex="0">' +
            '<div class="ch-slider-bar">' +
            '<span class="ch-slider-fill"></span>' +
            '<span class="ch-slider-handle" ' +
            'role="slider" ' +
            'aria-valuemin="{{ min }}" ' +
            'aria-valuemax="{{ max }}" ' +
            'aria-valuenow="{{ model }}" ' +
            'aria-orientation="horizontal" ' +
            '></span>' +
            '</div>' +
            '</div>'
    };
    return directive;

    function linkFunction($scope, $element, attributes) {
        var $slider = angular.element($element[0].querySelector('.ch-slider'));
        var $bar = angular.element($element[0].querySelector('.ch-slider-bar'));
        var $handle = angular.element($element[0].querySelector('.ch-slider-handle'));
        var $fill = angular.element($element[0].querySelector('.ch-slider-fill'));

        init();

        function init() {
            $scope.min = ($scope.min === undefined) ? 0 : $scope.min;
            $scope.max = ($scope.max === undefined) ? 100 : $scope.max;
            $scope.step = ($scope.step === undefined) ? 1 : $scope.step;
            $scope.model = ($scope.model === undefined) ? ($scope.max - $scope.min) / 2 : $scope.model;

            setupEvents();
            setupKeyboardEvents();
            setupWatches();

        }

        function setupEvents() {
            setupDragEvents();
            setupTouchEvents();
        }

        function setupDragEvents() {
            var isActive = false;
            $handle.on('touchstart', function(event) {
                if($scope.disabled !== true) {
                    isActive = true;
                    angular.element(window).on('touchmove', touchMove);
                    angular.element(window).on('touchend', touchEnd);
                }
            });

            function touchMove(event) {
                if (isActive) {
                    event.preventDefault();
                    calcPosition(event);
                }
            }

            function touchEnd(event) {
                if (isActive) {
                    isActive = false;
                    angular.element(window).off('touchmove', touchMove);
                    angular.element(window).off('touchend', touchEnd);
                }
            }
        }

        function setupTouchEvents() {
            var isActive = false;
            $handle.on('mousedown', function(event) {
                if($scope.disabled !== true) {
                    isActive = true;
                    angular.element(window).on('mousemove', dragMove);
                    angular.element(window).on('mouseup', dragEnd);
                }
            });

            function dragMove(event) {
                if (isActive) {
                    event.preventDefault();
                    calcPosition(event);
                }
            }

            function dragEnd(event) {
                if (isActive) {
                    isActive = false;
                    angular.element(window).off('mousemove', dragMove);
                    angular.element(window).off('mouseup', dragEnd);
                }
            }
        }

        function setupKeyboardEvents() {

            $slider.on('keydown', handleKeys);

            var Keys = {
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                PAGEUP: 33,
                PAGEDOWN: 34,
                HOME: 36,
                END: 35
            };

            function handleKeys(event) {
                switch (event.keyCode) {
                    case Keys.UP:
                    case Keys.RIGHT:
                        setValue($scope.model + $scope.step, true, true);
                        break;
                    case Keys.DOWN:
                    case Keys.LEFT:
                        setValue($scope.model - $scope.step, true, true);
                        break;
                    case Keys.PAGEUP:
                    setValue($scope.model + ($scope.step * 10), true, true);
                    break;
                    case Keys.PAGEDOWN:
                    setValue($scope.model - ($scope.step * 10), true, true);
                    break;
                    case Keys.HOME:
                        setValue($scope.min, true, true);
                        break;
                    case Keys.END:
                        setValue($scope.max, true, true);
                        break;
                }
            }
        }

        function setupWatches() {
            $scope.$watch(function() {
                return $scope.model;
            }, function(value) {
                setValue(value, false);
            });

            attributes.$observe('min', function(value) {
                $scope.min = (value === undefined || value === '' || isNaN(value)) ? 0 : value;
                update();
            });
            attributes.$observe('max', function(value) {
                $scope.max = (value === undefined || value === '' || isNaN(value)) ? 100 : value;
                update();
            });
            attributes.$observe('step', function(value) {
                $scope.step = (value === undefined || value === '' || isNaN(value)) ? 1 : value;
                update();
            });

            function update() {
                setValue($scope.model);
            }
        }

        function calcPosition(event) {
            var pageX;
            // Touch events seem to behave differently across devices. This is mostly untested though
            if (event.type === 'touchstart' || event.type === 'touchmove') {
                var touch = event.changedTouches[0] || event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                pageX = touch.pageX;
            } else {
                pageX = event.pageX;
            }
            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                barWidth = $bar[0].getBoundingClientRect().width,
                barOffset = (($bar[0].getBoundingClientRect().left + document.body.scrollLeft) - pageX),
                handlePosition = Math.abs(barOffset),
                value;

            if (barOffset > 0) {
                handlePosition = $scope.min;
                value = handlePosition;
            } else {
                var offsetPercentage = percent(handlePosition, barWidth);
                value = (($scope.max - $scope.min) * offsetPercentage) + parseFloat($scope.min);
            }
            setValue(value, true, true);

        }

        function setValue(value, normalize, forceDigest) {

            value = parseFloat(value);

            normalize = (normalize === undefined) ? true : normalize;
            forceDigest = (forceDigest === undefined) ? false : forceDigest;

            if (normalize) {
                value = roundToInterval(value, $scope.step);
            }

            if (value < $scope.min) {
                value = $scope.min;
            } else if (value > $scope.max) {
                value = $scope.max;
            }

            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                percentage = percent(value - $scope.min, $scope.max - $scope.min) * 100;

            if (percentage < 0) {
                percentage = 0;
            } else if (percentage > 100) {
                percentage = 100;
            }

            $handle.css('left', 'calc(' + percentage + '% - ' + halfOfHandle + 'px)');
            $fill.css('width', 'calc(' + percentage + '% - ' + halfOfHandle + 'px)');
            if (normalize) {
                $scope.model = value;
                if (forceDigest) {
                    $scope.$apply();
                }
            }
        }

        function percent(frac, num) {
            return (frac / num);
        }

        function roundToInterval(number, interval) {
            return Math.round(number / interval) * interval;
        }
    }




}
