(function() {
  angular.module('fixtable', []);

  angular.module('fixtable').directive('fixtable', [
    '$timeout', 'fixtableDefaultOptions', function($timeout, fixtableDefaultOptions) {
      return {
        link: function(scope, element, attrs) {
          var fixtable, key, value;
          fixtable = new Fixtable(element);
          for (key in fixtableDefaultOptions) {
            value = fixtableDefaultOptions[key];
            if (!Object.prototype.hasOwnProperty.call(scope.options, key)) {
              scope.options[key] = value;
            }
          }
          $timeout(function() {
            return fixtable._circulateStyles();
          });
          scope.$parent.$watchCollection(scope.options.data, function(newData) {
            scope.data = newData;
            return $timeout(function() {
              var col, i, j, len, ref;
              ref = scope.options.columns;
              for (i = j = 0, len = ref.length; j < len; i = ++j) {
                col = ref[i];
                if (col.width) {
                  fixtable._setColumnWidth(i + 1, col.width);
                }
              }
              fixtable._setHeaderHeight();
              return fixtable._setFooterHeight();
            });
          });
          scope.$watch('options.pagingOptions', function(opt) {
            if (!opt) {
              return;
            }
            scope.totalPages = Math.ceil(opt.totalItems / opt.pageSize) || 1;
            scope.totalPagesOoM = Math.floor(Math.log10(scope.totalPages) + 1 || 1);
            if (opt.currentPage > scope.totalPages) {
              opt.currentPage = scope.totalPages;
            }
            return scope.$parent[scope.options.pagingOptions.callback](opt);
          }, true);
          scope.nextPage = function() {
            return scope.pagingOptions.currentPage += 1;
          };
          scope.prevPage = function() {
            return scope.pagingOptions.currentPage -= 1;
          };
          return scope.parent = scope.$parent;
        },
        replace: true,
        restrict: 'E',
        scope: {
          options: '='
        },
        templateUrl: 'fixtable/templates/fixtable.html'
      };
    }
  ]);

  angular.module('fixtable').provider('fixtableDefaultOptions', function() {
    this.defaultOptions = {};
    this.$get = function() {
      return this.defaultOptions;
    };
    this.setDefaultOptions = function(options) {
      return this.defaultOptions = options;
    };
    return null;
  });

}).call(this);

//# sourceMappingURL=fixtable-angular.js.map
