angular.module('chasselberg.slider', [])
    .directive('slider', SliderDirective);

function SliderDirective() {
    var directive = {
        restrict: 'EA',
        scope: {
            model: '=',
            min: '=',
            max: '=',
            step: '='
        },
        link: linkFunction,
        template: '<div class="ch-slider">' +
            '<div class="ch-slider-bar">' +
            '<span class="ch-slider-handle" ' +
            'role="slider" ' +
            'aria-valuemin="{{ min }}" ' +
            'aria-valuemax="{{ max }}" ' +
            'aria-valuenow="{{ model }}" ' +
            'aria-orientation="horizontal" ' +
            '></span>' +
            '<span class="ch-slider-fill></span>"' +
            '</div>' +
            '</div>'
    };
    return directive;

    function linkFunction($scope, $element) {
        var $bar = angular.element($element[0].querySelector('.ch-slider-bar'));
        var $handle = angular.element($element[0].querySelector('.ch-slider-handle'));

        init();

        function init() {
            $scope.min = ($scope.min === undefined) ? 0 : $scope.min;
            $scope.max = ($scope.max === undefined) ? 100 : $scope.max;
            $scope.step = ($scope.step === undefined) ? 1 : $scope.step;
            $scope.model = ($scope.model === undefined) ? ($scope.max - $scope.min) / 2 : $scope.model;

            setupEvents();
            setupWatches();

        }


        function setupEvents() {
            var isActive = false;
            $handle.on('mousedown', function() {
                isActive = true;
                angular.element(window).on('mousemove', move);
                angular.element(window).on('mouseup', end);
            });

            function move(event) {
                if (isActive) {
                    event.preventDefault();
                    calcPosition(event);
                }
            }

            function end(event) {
                if (isActive) {
                    isActive = false;
                    angular.element(window).off('mousemove', move);
                    angular.element(window).off('mouseup', end);
                }
            }
        }

        function setupWatches() {
            $scope.$watch(function() {
                return $scope.model;
            }, function(value) {
                setValue(value, false);
            });

            $scope.$watch(function() {
                return $scope.min;
            }, updateEverything);
            $scope.$watch(function() {
                return $scope.max;
            }, updateEverything);
            $scope.$watch(function() {
                return $scope.step;
            }, updateEverything);

            function updateEverything() {
                setValue($scope.model);
            }
        }

        function calcPosition(event) {
            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                barWidth = $bar[0].getBoundingClientRect().width,
                barOffset = (($bar[0].getBoundingClientRect().left + document.body.scrollLeft) - event.pageX),
                handlePosition = Math.abs(barOffset);

            if (barOffset > 0) {
                handlePosition = $scope.min;
                value = handlePosition;
            } else {
                var offsetPercentage = percent(handlePosition, barWidth),
                    value = (($scope.max - $scope.min) * offsetPercentage) + parseFloat($scope.min);
            }

            console.log(value);
            setValue(value, true, true);

        }

        function setValue(value, normalize, forceDigest) {
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

            if(percentage < 0) {
                percentage = 0;
            } else if(percentage > 100) {
                percentage = 100;
            }

            $handle.css('left', 'calc(' + percentage + '% - ' + halfOfHandle + 'px)');
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
            if (number > 0)
                return Math.ceil(number / interval) * interval;
            else if (number < 0)
                return Math.floor(number / interval) * interval;
            else
                return number;
        }
    };




};
