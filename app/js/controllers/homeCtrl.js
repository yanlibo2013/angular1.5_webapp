define(['app'], function (app) {
    app.controller('HomeCtrl', ['$scope', function ($scope) {
        //初试话todos list
        $scope.todos = [{
            name: "北京",
            done: false
        }, {
            name: "上海",
            done: true
        }];

        //获取数组元素个数
        $scope.total = $scope.todos.length;


        //已选中元素的个数
        $scope.remaining = function () {
            var count = 0;
            angular.forEach($scope.todos, function (todo) {
                count += todo.done ? 1 : 0;
            });
            return count;
        }

        //添加元素
        $scope.addTodo = function () {
            if ($scope.newTodo == null || $scope.newTodo == "") {
                alert("请输入城市的名称!");
                return;
            }
            $scope.todos.push({
                name: $scope.newTodo,
                done: false
            });
            $scope.newTodo = "";
            updateTotal();
        }

        //删除元素
        $scope.archive = function () {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) {
                    $scope.todos.push(todo);
                }
            });
            updateTotal();
        }

        //动态更新
        var updateTotal = function () {
            $scope.total = $scope.todos.length;
        }
    }]);

    return app;
});