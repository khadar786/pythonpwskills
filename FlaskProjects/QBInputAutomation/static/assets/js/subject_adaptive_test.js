//TODO: instead of qindex use questionids[qindex]
var testdata=null;
/*********************important : time diff *******************************/
var now = (function() {
	var performance = window.performance || {};
		performance.now = (function() {	return performance.now||performance.webkitNow||performance.msNow||performance.oNow||performance.mozNow||function(){return new Date().getTime(); };})();
	var time =  Math.round(performance.now());	//using performance gives bugs :(
		// console.log("time:"+time);
		return time;
});

function renderMaths(elements){
	$.each(elements,function(index,item){
		var script = document.createElement("script"); script.type = "math/tex";        
		var latex = $(item).text();         
		MathJax.HTML.setScript(script,latex);        
		$(item).replaceWith(script);	        
	});
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);		
	setTimeout(function() { 
		$('.math').find('span').css('border-left-color','transparent'); //this is to remove unwanted right border after math elements
	},1000);		
}

var TestApp = angular.module('TestApp', ['ngSanitize','sun.scrollable']);
TestApp.controller('TestCtrl',function($scope, $http, $filter, $timeout){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.start_exam=false;
    $scope.continue_exam=false;
    $scope.qloader=false;
    $scope.user_test_data={};
    $scope.topic_recommendations={};
    $scope.qreview=[];
    //Services
    $scope.API_URL="api/PracticeTestService.php";

    $scope.init=function(){
        $scope.general_ins=true;
    	$scope.start_exam=true;
        $scope.user_id=Config.user_id;
        $scope.is_written_test=Config.is_written_test;
        $scope.user_test_id=Config.user_test_id;
        $scope.Config=Config;

        $scope.Math=window.Math;
        $scope.tid=$scope.Config.tid;
        $scope.start_block=-1;
        $scope.nqs=$scope.Config.testSize;
        var nm = parseInt($scope.Config.negativeMarks);
        $scope.default_score=$scope.Config.default_score;
        $scope.negative_mark = nm; //NegativeMarks

        $scope.questionids=[];
        $scope.qindex_list=[];
        $scope.qdataids=[];
        $scope.questions={};
        $scope.paragraph="";
        $scope.opts = [];
        $scope.start_time = now();
        $scope.end_time = now();
        $scope.total_time = 0;
        $scope.total_score = 0;
        $scope.time_taken = 0;
        $scope.attempted_total = 0;
        $scope.attempted_correct = 0;
        $scope.finished = false;
        $scope.finishbtn = false;
        $scope.total_q=0;

        return false;
        
        var params=$.param({"testSize":$scope.Config.testSize,
        					"course_id":$scope.Config.course_id,
        					"tid":$scope.Config.tid,
        					"mtest_id":$scope.Config.mtest_id,
        					"passage_tagging_id":$scope.Config.passage_tagging_id,
        					"action":"rwloadqidsfromconfig"
        					});
       	$http({method: 'POST', url: $scope.API_URL,data:params})
        .success(function(data, status, headers, config) {
        	$scope.start_exam=false;
        	$scope.questionids=data;
        	if($scope.questionids.length==0)
            {
                //no question ids returned from server
                // console.log('no questions found,ng-inspect');
                window.loaction='student-dashboard';
            }

            //Load question based on question type
            $scope.nqs=$scope.questionids.length;

            var btn = $(".startbtn").get(0);
            $(btn).attr('disabled','disabled');
            $(btn).css({'cursor':'wait'});
            $(btn).html('<i class="fa fa-spinner fa-pulse fa-fw" aria-hidden="true"></i> Loading... ');

            var loadQrequests=[];
            for(var i=0;i<$scope.questionids.length;i++)
            {
            	$scope.qindex_list.push(i);
            	loadQrequests.push($scope.loadAQ(i));
            }

        }).error(function(data, status, headers, config){
                
        });

    }

    $scope.loadAQ = function(ind){
			return $.post($scope.API_URL,{ 
					action: "rwloadquestion", 
					"index":ind,
					"testid":$scope.Config.user_test_id,
					"id":$scope.questionids[ind]
				},function(res){				
				//load from server ****!!!IMPORTANT!!!****
				var qdata=res.data;
				qdata["answer"]=qdata.answer;
				qdata["index"]=parseInt(qdata.index);						
				qdata["time_taken"]=qdata.solving_time_diff;
				qdata["score_actual"]=qdata.user_score;
				qdata["solving_time"]=0;
				qdata["selected_option"]=qdata.user_answer;	
				qdata["start_time"]=now();																
				qdata["end_time"]=now();
				qdata["type_of_question_id"]=qdata.type_of_question_id;
				qdata["is_attempted"]=0;
				qdata.question=qdata.question;
				$scope.questions[ind]=qdata;
				console.log('qindex -'+ind);
		 		var ans = $scope.questions[ind].answer;
         		console.log("Q"+(ind+1)+" answer" , ans, $scope.dec(ans));
				if((ind+1)==$scope.Config.testSize){
                    $scope.loadPassage();
				}
			});
		}

	$scope.loadPassage=function(){
		var params=$.param({"link_id":$scope.Config.link_id,
        					"passage_tagging_id":$scope.Config.passage_tagging_id,
        					"action":"rwpassage"
        					});
		$http({method: 'POST', url: $scope.API_URL,data:params})
        .success(function(data, status, headers, config) {
        	$scope.paragraph=data.pdata.paragraph;
			var btn = $(".startbtn").get(0);
            $(btn).removeAttr('disabled');
            $(btn).css({'cursor':'pointer'});
            $(btn).html('<i class="fa fa-flag-checkered" aria-hidden="true"></i> Start ');
        }).error(function(data, status, headers, config){
           	var btn = $(".startbtn").get(0);
            $(btn).removeAttr('disabled');
            $(btn).css({'cursor':'pointer'});
            $(btn).html('<i class="fa fa-flag-checkered" aria-hidden="true"></i> Start ');     
        });
	}

	$scope.startTest=function(){
		//if($scope.questionids.length==0) return;
		$scope.qloader=true;
        $scope.general_ins=false;
		$scope.start_block=1;
		
		$timeout(function(){
			renderQuestion();
			$scope.qloader=false;
		},500);
	}

	$scope.setAnswer=function(ele,qindex){
		$scope.qindex=qindex;
		console.log($scope.qindex);
		if($scope.questions[$scope.qindex].selected_option==ele.value.option_index) 
		{
			return;		
		}			
		$scope.questions[$scope.qindex].selected_option = ele.value.option_index;
		$scope.questions[$scope.qindex].is_attempted=1;

		if($scope.pre_end_time!=undefined)
			$scope.questions[$scope.qindex].start_time=$scope.pre_end_time;

		if($scope.questions[$scope.qindex]!=undefined) {    
            if($scope.questions[$scope.qindex].selected_option=='')
            {
                if($scope.pre_end_time!=undefined)
                $scope.questions[$scope.qindex].start_time=$scope.pre_end_time;
                
                $scope.questions[$scope.qindex].end_time = now();
                $scope.questions[$scope.qindex].solving_time = Math.round($scope.questions[$scope.qindex].end_time - $scope.questions[$scope.qindex].start_time);
                $scope.questions[$scope.qindex].time_taken = parseInt($scope.questions[$scope.qindex].time_taken) + $scope.questions[$scope.qindex].solving_time;
                
                $scope.pre_end_time=$scope.questions[$scope.qindex].end_time;
            }
        }

    	$scope.questions[$scope.qindex].end_time = now();
		$scope.questions[$scope.qindex].solving_time = Math.round($scope.questions[$scope.qindex].end_time - $scope.questions[$scope.qindex].start_time);
		$scope.questions[$scope.qindex].time_taken = parseInt($scope.questions[$scope.qindex].time_taken) + parseInt($scope.questions[$scope.qindex].solving_time);

		$scope.pre_end_time=$scope.questions[$scope.qindex].end_time;
		if($scope.questions[$scope.qindex].selected_option == $scope.dec($scope.questions[$scope.qindex].answer)){	
			//correct answers = answer.split(","); $.inArray(selected_option,answers)!==-1
			if($scope.Config.questionType=='MT' || $scope.Config.questionType=='PT'){
				$scope.questions[$scope.qindex].score_actual = parseFloat($scope.questions[$scope.qindex].score);
			}else{
				$scope.questions[$scope.qindex].score_actual = parseFloat($scope.Config.marks_per_question);
			}				
		}else {
			if($scope.negative_mark>0)	//wrong answer, and -ve marks
			{
				$scope.questions[$scope.qindex].score_actual = -1 * $scope.negative_mark; 
				$scope.total_negative_score += $scope.negative_mark;
			}
			else
			{
				$scope.questions[$scope.qindex].score_actual = 0;	//wrong answer, but no -ve marks
			}
		}

		$scope.showFinishbtn();
	}

	$scope.showFinishbtn=function(){
		var attempted=$.map($scope.questions,function(q, i){ 
                //console.log(n);
                //console.log(i);
                if(q.is_attempted==1){
                    return 1;
                }
            }).length;
		
		if(attempted==$scope.Config.testSize){
			$scope.finishbtn=true;
		}
	}

	$scope.finishTest=function(){
		$scope.qloader=true;
		var params=$.param({"tid":$scope.Config.tid,
    						 "mtest_id":$scope.Config.mtest_id,
    						 "passage_tagging_id":$scope.Config.passage_tagging_id,
    						 "link_id":$scope.Config.link_id,
    						 "subject_id":$scope.Config.subject_id,
    						 "categories":$scope.Config.categories,
    						 "topic_ids":$scope.Config.topic_ids,
    						 "course_id":$scope.Config.course_id,
    						 "marks_per_question":$scope.Config.marks_per_question,
    						 "user_id":$scope.Config.user_id,
    						 "title":$scope.Config.title,
    						 "subject":$scope.Config.subject,
    						 "tag_name":$scope.Config.tag_name,
    						 "questiontype":$scope.Config.questionType,
    						 "testsize":$scope.Config.testSize,
    						 "default_score":$scope.Config.default_score,
    						 "questions":JSON.stringify($scope.questions),
    						 "action":"rwfinishtest"
    						});
		$http({method:'POST',url:$scope.API_URL,data:params}).success(function(data,status,headers,config){
			if(data.is_test_finished){
				$scope.user_test_data=data.user_test_data;
			 	$scope.qreview=data.qreview;
			 	$scope.topic_recommendations=data.topic_recommendations;
		 		for(var i=0;i<$scope.qreview.length;i++){
				 	  $scope.qreview[i]={
		              "attempted" :   parseInt($scope.qreview[i].is_attempted),
		              "score"   :   parseInt($scope.qreview[i].user_score),
		              "time"    :   parseInt($scope.qreview[i].solving_time_diff),
		              "timestr" :   $scope.hhmmss(parseInt($scope.qreview[i].solving_time_diff)/1000),
		              "uanswer" :   $scope.qreview[i].user_answer,           
		              "id"    :   parseInt($scope.qreview[i].question_id),
		              "solving_time" : $scope.qreview[i].solving_time,
		              "correct_perc" : $scope.qreview[i].correct_answer_perc,
		              "question" : $scope.qreview[i].question,  
		              "options" : $scope.qreview[i].options,
		              "correct_answer":$scope.qreview[i].answer,
		              "category" : $scope.qreview[i].category,
		              "solution_status" : parseInt($scope.qreview[i].solution_status),
		              "solution" : $scope.qreview[i].solution,
		              "question_sol" : $scope.qreview[i].question_sol,
					  "solution_type" : $scope.qreview[i].solution_type,
		              "qchoice_type" :$scope.qreview[i].qchoice_type               
		              };
		 		}
		 		$scope.start_block=-10;
	    		$scope.finished=true;
	    		$scope.qloader=false;
	    		setTimeout(function(){                      
	            	var elements = $(".latex");
	            	renderMaths(elements);
	    		},1000);

	    		if($scope.$root.$$phase!='$apply' && $scope.$root.$$phase != '$digest'){
						$scope.$apply();
				}
			}
		}).error(function(data, status, headers, config){
		});
	}

	$scope.viewQSolution=function(qid,kindex){
    	$scope.kindex=kindex;
    	$scope.qsolution=$scope.qreview[kindex];
    	$('#view_qsolution').modal('show');

		setTimeout(function(){                      
        	var elements = $(".latex");
        	renderMaths(elements);
		},500);

    	if($scope.$root.$$phase!='$apply' && $scope.$root.$$phase != '$digest'){
			$scope.$apply();
		}
    }

    var keyboardConfig={allowedChars : new Array("+","-")}; 
    $scope.onlyNumbers=function(event,id)
    {
    	//$scope.check_answred_count();

    	var code = (event.which) ? event.which : event.keyCode;
         if((code > 47 && code < 58) || code==46 || code==45 || code==8 || code==37){
           //console.log(event.target.value);
           var qvalue = document.getElementById("q_"+id+"_id");
           var answer = qvalue.value;

          for(var i=0;i<keyboardConfig.allowedChars.length;i++){
            if(answer.indexOf(keyboardConfig.allowedChars[i])>0){
              event.preventDefault();
              return false;
            }

            if(answer.split(keyboardConfig.allowedChars[i]).length>2){
              event.preventDefault();
              return false;
            }
          }

          if(answer.indexOf('.') > -1){
            var afterDot = answer.split(".");
            //console.log(afterDot.length);
            if(afterDot.length>2){
              event.preventDefault();
              return false;
            }
          }

           return true;
         }else{
            event.preventDefault();
         }
    }
    
    $scope.format_Options = function(v){
        var vdata = v;
        var res = vdata.split(",");
        if(res.length>1){
          var end_data = res.pop();
          var resultData = "and "+end_data;
          var start_data = res.toString();
          return start_data+" "+resultData;
        }
        else { return vdata;}
    }

	function enc(v)
	{
		return Base64.encode(v);
	}

	function dec(v)
	{
		return Base64.decode(v);
	}

	$scope.dec = function(v){
		var d = Base64.decode(v);
		if(d.length>1)
			d = Base64.decode(d);
		return d;
	}

	$scope.decFormatOptions = function(v){
		var vdata = Base64.decode(v);
		var res = vdata;
		//var res = vdata.split(",");
		if(res.length>1){
			var end_data = res.pop();
			var resultData = "and "+end_data;
			var start_data = res.toString();
			return start_data+" "+resultData;
		}
		else { return vdata;}
		//return formatOptions(vdata);
	}

	$scope.formatOptions = function(v){
		var vdata = v;
		//var res = vdata.split(",");
		var res = vdata;
		if(res.length>1){
			var end_data = res.pop();
			var resultData = "and "+end_data;
			var start_data = res.toString();
			return start_data+" "+resultData;
		}
		else { return vdata;}
	}

	function renderQuestion() //not the exact meaning but updates view
    {   
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
         /*var ans = $scope.questions[$scope.qindex].answer;
         if($scope.questions[$scope.qindex].qchoice_type=='N'){
         	console.log("answer" , ans, $scope.dec(ans));
         }else{
         	console.log("answer" , ans, $scope.dec(ans));
         }*/
        setTimeout(function(){                      
                // $(".latex").latex();
                var elements = $(".latex");
                renderMaths(elements);
        },100);                         
    }

    $scope.hhmmss = function(secs) {
          secs = Math.round(secs);
          var minutes = Math.floor(secs / 60);
          var seconds = secs%60;
          var hours = Math.floor(minutes/60)
          minutes = minutes%60;
          return pad(hours)+":"+pad(minutes)+":"+pad(seconds)+"";
    }

    function pad(str) {
        return ("0"+str).slice(-2);
    }
    
    $scope.init();
});