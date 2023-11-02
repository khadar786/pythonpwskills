function renderMaths(elements) {
    $.each(elements, function(index, item) {
        var script = document.createElement("script");
        script.type = "math/tex";
        var latex = $(item).text();
        MathJax.HTML.setScript(script, latex);
        $(item).replaceWith(script);
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    setTimeout(function() {
        $('.math').find('span').css('border-left-color', 'transparent'); //this is to remove unwanted right border after math elements
    }, 1000);

}
var TestApp = angular.module('AdaptiveTestApp', ['ngSanitize']);
TestApp.controller('AdaptiveTestCtrl', function($scope, $http, $filter, $timeout) {
    $scope.loadspinner = '<i class="fas fa-circle-notch fa-spin" style="font-size:20px"></i>';
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.API_URL = site_url + 'api/DiagnosticService.php';
    $scope.course_id = course_id;
    $scope.subject_id = subject_id;
    $scope.chapter_id = chapter_id;
    $scope.topic_id = topic_id;
    $scope.user_id = user_id;
    $scope.flag = ($scope.topic_id > 0) ? 'T' : 'C';
    $scope.site_url = site_url;
    $scope.totals = { "count": 0, "correct": 0, "skipped": 0, "scored": 0, "missed": 0, "total_time": 0, "total_attempt": 0, "total_accuracy": 0, "attempted_all": 0 };
    $scope.questionList = [];
    $scope.question = null; //current question
    $scope.question_options = {};
    $scope.question_index = null;
    $scope.qindex = 0;
    $scope.selectedOption = null;
    $scope.isOptionsEnabled = false;
    $scope.iserror = false;
    $scope.qloading = false;
    $scope.qsubmit = false;
    $scope.finishTest = false;
    $scope.qview = false;
    $scope.qinstruction = false;
    $scope.test_id = 0;
    $scope.test_config_id = 0;
    $scope.chapter_score = 0;
    $scope.user_level = 0;
    $scope.resume_total_score = 0;
    $scope.is_level_complete = false;
    $scope.current_level = 0;
    $scope.nextdisable = false;
    $scope.radiodisable = false;
    $scope.user_level_status = '';
    $scope.view_solution = false;
    $scope.quit_box = false;
    $scope.btn_skip = false;
    $scope.bottleneck=false;
    $scope.questions_end_range=-10;
    $scope.current_q_level=0;
    $scope.finishTestBlock = false;
    $scope.is_adp_level=0;
    $scope.test_layout = false;
    $scope.test_is_completed = 0;

    //Start Test
    $scope.Math = window.Math;
    $scope.process_success_width = 0;
    $scope.process_danger_width = 0;
    $scope.timer = new Timer();
    $scope.chapter_test_type = true;


    $scope.timer.addEventListener('secondsUpdated', function(e) {
        //var current_time=$scope.timer.getTotalTimeValues().seconds;
        var timestr = $scope.timer.getTimeValues().toString();
        var current_percentage = Math.round($scope.timer.getTotalTimeValues().seconds / $scope.qAllotedTime_orginal * 100);
        $("#timeval").html(timestr);
        var success_per = 60;
        if (current_percentage <= success_per) {
            $scope.process_success_width = 0;
            $scope.process_success_width = current_percentage;
        } else {
            $scope.process_danger_width = 0;
            $scope.process_danger_width = (current_percentage - success_per);
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$apply(function() { $scope.totals.timer = timestr });
    });

    $scope.timer.addEventListener('reset', function(e) {
        $("#timeval").html($scope.timer.getTimeValues().toString());
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    });

    $scope.timer.addEventListener('targetAchieved', function(e) {
        //$('#startValuesAndTargetExample .progress_bar').html('COMPLETE!!');
        //console.log('#####');
        if ($scope.qsubmit == false) {
            $scope.skipQ();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }

    });

    $scope.ShowInstructions = function() {
        $scope.test_layout = true;
        $scope.qinstruction = true;
        $scope.chapter_test_type = false;
        $('#TopicResultModal').modal('hide');
    }
    $scope.showPracticeCondition = function() {
        $('#TopicResultModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    
    //LoadConfig
    $scope.loadConfig = function() {
        var params = $.param({ "action": "loadconfig", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "topic_id": $scope.topic_id, "flag": $scope.flag, "user_id": $scope.user_id });
        $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.question_index = parseInt(data.index_value);
            $scope.test_id = parseInt(data.test_id);
            $scope.is_completed = parseInt(data.is_completed);
            //console.log($scope.question_index);
            
            //$scope.chapter_test_type = false;
            /*if($scope.user_level_status==1){
                $scope.qinstruction = false;
            }else{
                $scope.qinstruction = true;
            }*/
        });
    }

    //Start Test
    $scope.startTest = function() {
        $scope.qinstruction = false;
        $scope.tabloader = true;
        $scope.loadQuestion();
    }

    //Load Question
    $scope.loadQuestion = function() {
        $scope.qview = false;
        var params = $.param({ "action": "loadquestion", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "topic_id": $scope.topic_id, "test_id": $scope.test_id, "user_id": $scope.user_id });
        $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.bottleneck=data.bottleneck;
           // $scope.adaptive_actions = data.adaptive_actions;
            //$scope.questions_end_range=data.questions_end_range;
           // $scope.current_q_level=data.current_q_level;
            if(data.bottleneck==false){
                $scope.iserror = false;
                enableoptions();
                $scope.question_index += 1;
                console.log($scope.question_index);
                $scope.test_config_id = parseInt(data.test_config_id);
                $scope.qindex = ($scope.question_index - 1);
                $scope.question = data.question;
                $scope.question.index_value = $scope.question_index;
                $scope.question.isAttempted = false;
                $scope.question.isSkipped = false;
                $scope.question.userScore = 0;
                $scope.question.userAnswer = '';
                //$scope.question.start_time = $scope.timer.getTotalTimeValues().secondTenths;  // multiply by 100 to get in milliseconds
                //$scope.question.end_time = $scope.timer.getTotalTimeValues().secondTenths+1;
                $scope.question.timeTaken = 0;
                $scope.question_options = data.options;
                $scope.questionList.push($scope.question);
                //console.log($scope.dec($scope.question.answer));
                //$scope.totals.count = $scope.questionList.length;
                $scope.tabloader = false;
                $scope.resulttabloader = false;
                $scope.qpause = false;
                $scope.process_success_width = 0;
                $scope.process_danger_width = 0;
                $scope.question.allotedTime = 30;
                $scope.qTotal_Time = ($scope.question.allotedTime);
                $scope.qAllotedTime_orginal = parseInt($scope.qTotal_Time) * 60; //in secs
                $scope.qAllotedTime = parseInt($scope.qTotal_Time) * 60; //in secs
                $scope.timer.start({ precision: 'seconds', startValues: { seconds: 0 }, target: { seconds: $scope.qAllotedTime } });
                //var timestr = $scope.timer.getTimeValues().toString();
                //console.log(timestr);
                //$("#timeval").html(timestr);

                console.log($scope.dec($scope.question.answer));
                renderQuestion();
                $scope.qview = true;
                $scope.test_layout = true;
           }else{
               $scope.tabloader = false;
           }

           if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
           }
        });
    };

    $scope.hhmmss = function(secs) {
        secs = Math.round(secs);
        var minutes = Math.floor(secs / 60);
        var seconds = secs % 60;
        var hours = Math.floor(minutes / 60)
        minutes = minutes % 60;
        return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + "";
    }

    function pad(str) {
        return ("0" + str).slice(-2);
    }

    function renderQuestion() //not the exact meaning but updates view
    {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        setTimeout(function() {
            // $(".latex").latex();
            var elements = $(".latex");
            renderMaths(elements);
        }, 100);
    }

    //Skip Question
    $scope.skipQ = function() {
        $scope.tabloader = true;
        if ($scope.btn_skip == true) {
            return false;
        }
        $scope.btn_skip = true;

        $scope.timer.pause();
        var total_time = $scope.timer.getTotalTimeValues().seconds;
        $scope.question.timeTaken = (total_time * 1000);

        $scope.question.isAttempted = false;
        $scope.question.isSkipped = true;
        if ($scope.updateTotalQuestionsStatus()) {
            var params = $.param({ "action": "savequestion", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "test_id": $scope.test_id, "question": angular.toJson($scope.question), "totals": $scope.totals, "topic_id": $scope.topic_id, "flag": $scope.flag, "user_id": $scope.user_id });
            $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.test_id = response.test_id;
                $scope.tabloader = true;
                $scope.timer.reset();
                $scope.btn_skip = false;
                $scope.loadQuestion();
            });
        }
    }

    //Submit Question
    $scope.submitQNew = function() {
        $scope.tabloader = true;
        if ($scope.btn_skip == true) {
            return false;
        }
        $scope.btn_skip = true;

        $scope.timer.pause();
        var total_time = $scope.timer.getTotalTimeValues().seconds;
        $scope.question.timeTaken = (total_time * 1000);
        if ($scope.selectedOption.option_index == $scope.dec($scope.question.answer)) {
            $scope.question.userScore = $scope.question.score;
        } else {
            $scope.question.userScore = 0;
        }
        $scope.question.isAttempted = true;
        $scope.question.isSkipped = false;
        if ($scope.updateTotalQuestionsStatus()) {
            var params = $.param({ "action": "savequestion", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "test_id": $scope.test_id, "question": angular.toJson($scope.question), "totals": $scope.totals, "topic_id": $scope.topic_id, "user_id": $scope.user_id,"test_config_id":$scope.test_config_id });
            $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.test_id = response.test_id;
                $scope.test_is_completed = response.is_completed;
                console.log($scope.test_is_completed);
                $scope.timer.reset();
                $scope.btn_skip = false;
                if($scope.test_is_completed == 0){
                    $scope.tabloader = true;
                    $scope.loadQuestion();
                }else{
                    $scope.qview = false;
                    $scope.tabloader = false;
                }
            });
        }
    }
    $scope.submitQ = function() {
        //Calculate Time
        $scope.timer.pause();
        var total_time = $scope.timer.getTotalTimeValues().seconds;
        $scope.question.timeTaken = (total_time * 1000);

        $scope.qview = false;
        $scope.qsubmit = true;
        $scope.nextdisable = true;
        $scope.qpause = true;
        $('#next_loader').html($scope.loadspinner);
        //$scope.loadspinner

        if ($scope.selectedOption.option_index == $scope.dec($scope.question.answer)) {
            //optclass= 'correct';
            $('#rcont_' + $scope.selectedOption.id).addClass('rcont');
            $('#test_options_' + $scope.selectedOption.id).addClass('crt_testoptions');
            $('#strong_' + $scope.selectedOption.id).addClass('crt_strong');
            $scope.question.userScore = $scope.question.score;
        } else {
            //optclass= 'wrong';
            //removeClass().
            $('#rcont_' + $scope.selectedOption.id).addClass('rcont');
            $('#test_options_' + $scope.selectedOption.id).addClass('wrg_testoptions');
            $('#strong_' + $scope.selectedOption.id).addClass('wrg_strong');

            angular.forEach($scope.question_options, function(value, key) {
                if ($scope.dec($scope.question.answer) == value.option_index) {
                    //$('#view_'+value.id).removeClass().addClass('correct');
                    $('#rcont_' + value.id).addClass('rcont');
                    $('#test_options_' + value.id).addClass('wrg_crt_testoptions');
                    $('#strong_' + value.id).addClass('wrg_crt_strong');
                    return;
                }
            });
        }

        $scope.question.isAttempted = true;
        ///$('#view_'+$scope.selectedOption.id).removeClass().addClass(optclass);

        if ($scope.updateTotalQuestionsStatus()) {
            var params = $.param({ "action": "savequestion", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id,"topic_id": $scope.topic_id, "test_id": $scope.test_id, "question": angular.toJson($scope.question), "totals": $scope.totals, "topic_id": $scope.topic_id, "flag": $scope.flag, "user_id": $scope.user_id });
            $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.test_id = response.test_id;
                $scope.is_level_complete = response.is_level_complete;
                $scope.user_level_status = response.user_levels_completed;
                $scope.current_level = response.current_level;
                $scope.nextdisable = false;
                $('#next_loader').html('');
                if(response.is_level_complete==true){
                    $scope.tabloader = true;
                    $scope.qsubmit = false;
                    $scope.qview = false;
                    $timeout(function() {
                     $scope.tabloader=false;
                    }, 500);
                }
                /*if(response.is_level_complete==true){
                    $("#restartConfetti").trigger("click");
                    $scope.award_data={};
                    $scope.award_data=response.award_info;
                    $("#award_info").modal({
                        backdrop: 'static',
                        keyboard: false  // to prevent closing with Esc button (if you want this too)
                    });
                    $("#startConfetti").trigger("click");
                    $timeout(function() {
                      $("#stopConfetti").trigger("click");
                      $scope.resetConfig();
                    }, 5000);
                }*/
                //console.log(response);
            });
        }

        disableoptions();
    }

    //Set Selected Option
    $scope.setSelectedOption = function(event, option) {
        event.stopPropagation();
        $scope.isOptionsEnabled = false;
        var optclass = "";
        $scope.selectedOption = option;
        $scope.question.userAnswer = $scope.selectedOption.option_index;

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Next Question
    $scope.nextQ = function() {
        $scope.qsubmit = false;
        $scope.qview = true;
        $scope.tabloader = true;
        $scope.timer.reset();
        $scope.loadQuestion();
    }

    //Finish Test
    $scope.finishTest = function() {
        $("#award_info").modal('hide');
        // $('#PauseTestID').modal('hide');
        $scope.qview = false;
        $scope.qsubmit = false;
        $scope.is_level_complete=false;
        $scope.resulttabloader = true;
        $scope.user_level_status=0;
        var params = $.param({ "action": "finishtest", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "test_id": $scope.test_id, "totals": $scope.totals, "questions": angular.toJson($scope.questionList), "topic_id": $scope.topic_id, "flag": $scope.flag, "user_id": $scope.user_id });
        $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(response, status, headers, config) {
            var res = response;
            $scope.finishTestBlock = true;
            $scope.resulttabloader = false;
            $scope.chapter_score = res.chapter_score;
            $scope.user_level = res.user_level;
            $scope.average_speed = res.average_speed;
            $scope.tot_spent_time = res.tot_spent_time;
            $scope.coverage = res.coverage;
            $scope.user_level_status = res.user_levels_completed;
        });
    }

    //Update Questions
    $scope.updateTotalQuestionsStatus = function() {
        $scope.resume_total_score = 0;
        if ($scope.question.isAttempted == false)
            $scope.totals.skipped += 1;

        if ($scope.question.userScore > 0) {
            $scope.totals.scored += $scope.question.userScore;
            $scope.totals.correct += 1;
        }

        if ($scope.question.userScore <= 0 && $scope.question.isAttempted == true){
            $scope.totals.missed += 1;
            //$scope.totals.missed += 0;
        }

        //if($scope.question.isAttempted==true)
        $scope.totals.total_time += $scope.question.timeTaken;

        //$scope.totals.total_attempt=($scope.totals.missed+$scope.totals.correct+$scope.totals.skipped);
        $scope.totals.attempted_all = ($scope.totals.missed + $scope.totals.correct + $scope.totals.skipped);
        $scope.totals.total_attempt = ($scope.totals.missed + $scope.totals.correct);

        $scope.totals.total_accuracy = Math.round(($scope.totals.correct / $scope.totals.total_attempt) * 100);
        //$scope.resume_total_score=($scope.totals.scored-$scope.totals.missed);
        $scope.resume_total_score = $scope.totals.scored;


        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        return true;
    }

    //View Solution
    $scope.viewSolution = function() {
        /*$("#SolutionID").modal({
              backdrop: 'static',
              keyboard: false  // to prevent closing with Esc button (if you want this too)
         });*/
        $scope.view_solution = true;
        $scope.quit_box = false;

        $timeout(function() {
            $('#answer_box').css('margin-bottom', '0px');
        }, 100);
        renderQuestion();

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    //Close Solution
    $scope.closeSolution = function() {
        //$('#SolutionID').modal('hide');
        $('#answer_box').css('margin-bottom', '-400px');
        $timeout(function() {
            $scope.view_solution = false;
            $scope.quit_box = false;
        }, 500);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Pause Test
    $scope.pauseTest = function() {
        $scope.timer.pause();
        $scope.qpause = true;
        $scope.view_solution = false;
        $scope.quit_box = true;

        $timeout(function() {
            $('#quit_box').css('margin-bottom', '0px');
        }, 100);
        /*$("#PauseTestID").modal({
             backdrop: 'static',
             keyboard: false  // to prevent closing with Esc button (if you want this too)
         });*/
    }

    //Resume Test
    $scope.resumeTest = function(resume_status) {
        $scope.resume_status = '';
        $scope.resume_status = resume_status;

        //$('#PauseTestID').modal('hide');
        $scope.timer.start();
        $scope.qpause = false;
        $('#quit_box').css('margin-bottom', '-400px');
        $timeout(function() {
            $scope.view_solution = false;
            $scope.quit_box = false;

            if ($scope.resume_status == 'finish') {
                $scope.finishTest();
            }

        }, 500);

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Cloase Session Paused
    $scope.closeSessionPaused = function() {
        //$('#PauseTestID').modal('hide');
        $scope.timer.start();
        $('#quit_box').css('margin-bottom', '-400px');
        $timeout(function() {
            $scope.view_solution = false;
            $scope.quit_box = false;
        }, 500);

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    $scope.updatestats = function() {
        var skipped = 0;
        var scored = 0;
        var missed = 0;
        var correct = 0;
        var timer = 0;
        for (var i = 0; i < $scope.questionList.length; i++) {
            if ($scope.questionList[i].isAttempted == false) skipped += 1;
            if ($scope.questionList[i].userScore > 0) {
                scored += $scope.questionList[i].userScore;
                correct += 1;
            }
            if ($scope.questionList[i].userScore <= 0 && $scope.questionList[i].isAttempted == true) missed += 1;

            timer += $scope.question.timeTaken;
        };
        $scope.totals.skipped = skipped;
        $scope.totals.scored = scored;
        $scope.totals.missed = missed;
        $scope.totals.correct = correct;
        $scope.totals.total_attempt = (missed + correct);
        $scope.totals.total_time = timer;
        $scope.totals.total_accuracy = Math.round(($scope.totals.correct / $scope.totals.total_attempt) * 100);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.apply();
    }

    $scope.updateQuestionList = function() {
        for (var i = 0; i < $scope.questionList.length; i++) {
            if ($scope.questionList[i].id == $scope.question.id) {
                $scope.questionList[i] = $scope.question;
                break;
            }
        };
        $scope.updatestats();
    }

    //Enable Options
    function enableoptions() {
        $scope.isOptionsEnabled = true;
        $(".options-list").find('li').each(function(index, item) {
            $(item).css({ "background": "#ffffff" });
        });
    }

    //Disable Options
    function disableoptions() {
        $scope.isOptionsEnabled = false;
        $(".options-list").find('li').each(function(index, item) {
            $(item).css({ "background": "#fcfcfc" });
        });

    }

    //Encrpt
    $scope.enc = function(v) {
        return Base64.encode(v);
    }

    //Decrypt
    $scope.dec = function(v) {
        return Base64.decode(v);
    }

    //Continue Test
    $scope.continueTest = function() {
        $scope.totals = { "count": 0, "correct": 0, "skipped": 0, "scored": 0, "missed": 0, "total_time": 0, "total_attempt": 0, "total_accuracy": 0, "attempted_all": 0 };
        $scope.questionList = [];
        $scope.question = null; //current question
        $scope.question_options = {};
        $scope.qindex = 0;
        $scope.selectedOption = null;
        $scope.isOptionsEnabled = false;
        $scope.iserror = false;
        $scope.qloading = false;
        $scope.qsubmit = false;
        $scope.finishTestBlock = false;
        $scope.qview = false;
        $scope.qinstruction = false;
        $scope.test_id = 0;
        $scope.chapter_score = 0;
        $scope.user_chapter_level = 0;
        $scope.resume_total_score = 0;
        $scope.is_level_complete = false;
        $scope.current_level = 0;
        $scope.nextdisable = false;
        $scope.radiodisable = false;
        $scope.view_solution = false;
        $scope.quit_box = false;
        //Timer
        $scope.process_success_width = 0;
        $scope.process_danger_width = 0;
        $scope.timer.reset();

        var params = $.param({ "action": "loadconfig", "course_id": $scope.course_id, "subject_id": $scope.subject_id, "chapter_id": $scope.chapter_id, "topic_id": $scope.topic_id, "flag": $scope.flag, "user_id": $scope.user_id });
        $http({ method: 'POST', url: $scope.API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.question_index = parseInt(data.index_value);
            $scope.user_level = data.user_levels_completed;
            $scope.startTest();
        });


    }

    $scope.tryAgain=function(){
        this.tabloader=true;
        var params=$.param({"action":"fixissue",
                            "course_id":$scope.course_id,
                            "subject_id":$scope.subject_id,
                            "chapter_id":$scope.chapter_id,
                            "topic_id":$scope.topic_id,
                            "flag":$scope.flag,
                            "user_id":$scope.user_id});
        $http({method:'POST',url:$scope.API_URL,data:params})
        .success(function(data,status,headers,config) {
            $scope.tabloader=false;
        })
        .error(function(response){
            $scope.tabloader=false;
        });

        if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
           $scope.apply();
        }
    }

    $scope.loadConfig();

});