var DTReportApp=angular.module('DTReport',['ngSanitize']);
DTReportApp.controller('DTReportCtrl',function($scope,$http,$filter,$timeout){
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.Config=Config;
    $scope.test_id='';
    $scope.view_report=false;
    $scope.loader=true;
    //Services
    $scope.API_URL="api/Service.php";

    $scope.tests=[];
    $scope.user_test_data={};
    $scope.getUserReport=function(){
      $scope.loader=true;
        var params=$.param({"action":"DiagnosticReport", 
                            "user_id":$scope.Config.user_id,
                            "user_test_id":$scope.Config.user_test_id,
                            "questionType":$scope.Config.questionType
                          });
        $http({method:'POST',url:$scope.API_URL,data:params})
        .success(function(data,status,headers,config) {
            $scope.user_test_data=data.user_test_data;
            //$scope.topic_recommendations=data.topic_recommendations;
            $scope.loader=false;
            if($scope.$root.$$phase!='$apply' && $scope.$root.$$phase != '$digest'){
              $scope.$apply();
            }
        }).error(function(data, status, headers, config){
            $scope.loader=false;    
        });
    }
    $scope.formatToRound = function(value){
        var RoundOut = Math.round(value*100)/100; 
          return RoundOut;
      };
    $scope.mmss = function(secs) {
          secs = Math.round(secs);
          var minutes = Math.floor(secs / 60);
          var seconds = secs%60;
          var hours = Math.floor(minutes/60)
          minutes = minutes%60;
          return pad(minutes)+' <span class="font-size-sm">Min</span> '+pad(seconds)+' <span class="font-size-sm">Sec</span>';
    }
    function pad(str) {
        return ("0"+str).slice(-2);
    }

    $scope.format_Marks = function(mymarks){
        var marks = parseInt(mymarks);
        return (marks>0)?marks:0;
    }
    $scope.SearchConfig = {
        "caste":"",
        "working_with":"",
    };
    

    $scope.getUserReport();
    

});