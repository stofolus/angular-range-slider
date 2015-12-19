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
            '<span class="ch-slider-handle"></span>' +
            '<span class="ch-slider-fill></span>"' +
            '</div>' +
            '</div>'
    };
    return directive;

    function linkFunction($scope, $element) {
        var $bar = angular.element($element[0].querySelector('.ch-slider-bar'));
        var $handle = angular.element($element[0].querySelector('.ch-slider-handle'));
        $scope.min = ($scope.min === undefined) ? 0 : $scope.min;
        $scope.max = ($scope.max === undefined) ? 100 : $scope.max;
        $scope.step = ($scope.step === undefined) ? 1 : $scope.step;

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
                    event.preventDefault();
                    calcPosition(event);
                }
            });
        }

        function calcPosition(event) {
            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                barWidth = $bar[0].getBoundingClientRect().width,
                barOffset = (($bar[0].getBoundingClientRect().left + document.body.scrollLeft) - event.pageX),
                handlePosition = Math.abs(barOffset);

            if (barOffset > 0) {
                handlePosition = $scope.min;
            }

            var offsetPercentage = percent(handlePosition, barWidth),
                value = ($scope.max - $scope.min) * offsetPercentage;

            setValue(value);

        }

        function setValue(value) {

            value = roundToInterval(value, $scope.step);

            if (value < $scope.min) {
                value = $scope.min;
            } else if (value > $scope.max) {
                value = $scope.max;
            }

            var halfOfHandle = $handle[0].getBoundingClientRect().width / 2,
                percentage = percent(value, $scope.max - $scope.min) * 100;

            $handle.css('left', 'calc(' + percentage + '% - ' + halfOfHandle + 'px)');
            $scope.model = value;
            $scope.$apply();
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
