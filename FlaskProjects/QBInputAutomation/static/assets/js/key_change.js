var API="api/Adminservice.php";
var KeyUpdateApp=angular.module('KeyUpdate',['ui.bootstrap','ngSanitize']);
KeyUpdateApp.controller('KeyUpdateCtrl',function($scope,$http,$timeout){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.loader=false;
	$scope.notify_options={
        icon: 'glyphicon glyphicon-warning-sign',
        title:'Error',
        message:'',
        type:'danger',
        spacing: 10,
        z_index: 9999,
        timer: 1000,
    };

    // /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/
    // numberRegex.test('121220.22');
    //'Pi equals to 3.14'.match(numberRegexG);

    $scope.qList=[];
    $scope.qSList=[];
    $scope.campusList=[];
    $scope.fetchAllCampus=function(){
    	$scope.loader=true;
    	var params=$.param({action:'allcampus',
    						campus_id:userInfo.campus_id,
    						user_id:userInfo.user_id,
    						level:userInfo.level,
    						course_id:userInfo.course_id,
                            sadmin_tid:testconfig.sadmin_tid
    					   });
    	$http({method:'POST',url:API,data:params})
		.success(function(response, status, headers, config) {
		 	$scope.campusList=response.campuslist;
			$scope.fetchQuestionList();
			if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
		        $scope.$apply();
		    }
		 }).error(function(data, status, headers, config) {
		    console.log('error');
		    $scope.loader = false;
		 });
    }

    $scope.fetchQuestionList=function(){
    	$scope.loader=true;
    	var params=$.param({action:'fetchqids',
    						campus_id:userInfo.campus_id,
    						user_id:userInfo.user_id,
    						level:userInfo.level,
    						course_id:userInfo.course_id,
                            sadmin_tid:testconfig.sadmin_tid,
                            test_id:testconfig.test_id
    					   });
		$http({method:'POST',url:API,data:params})
		.success(function(response, status, headers, config) {
		 	$scope.qList=response.questions;
		 	$scope.qSList=response.questions;

			$scope.loader=false;
			if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
		        $scope.$apply();
		    }
		 }).error(function(data, status, headers, config) {
		    console.log('error');
		    $scope.loader = false;
		 });
    };

    $scope.updateQuestionOption=function(qkey,update_option){
    	//console.log(update_option);
    	if(update_option!=""){
    		if(update_option=="keychange"){
    			$scope.qSList[qkey]['is_keychange']=true;
    			$scope.qSList[qkey]['is_addscore']=false;
    		}else if(update_option=="addscore"){
    			$scope.qSList[qkey]['is_keychange']=false;
    			$scope.qSList[qkey]['is_addscore']=true;
    		}
            $scope.qSList[qkey]['new_answer']=$('#qoption_'+$scope.qSList[qkey].id).val();
            $scope.qSList[qkey]['update_option']=update_option;
    	}else{
    		$scope.qSList[qkey]['is_keychange']=false;
    		$scope.qSList[qkey]['is_addscore']=false;
    		$scope.qSList[qkey]['update_option']="";
            $scope.qSList[qkey]['new_answer']="";
    	}

        //console.log($scope.qSList[qkey]);
		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.searchQuestions=function(qsearch){
    	if(qsearch!="" && typeof qsearch!='undefined'){
    		//console.log(qsearch);
	    	$scope.qList=[];
	    	//console.log(qsearch);
	    	let qnos=qsearch.split(",");
	    	//console.log(qnos.includes('1'));
	    	$scope.qSList.forEach((value,key)=>{
	    		//console.log(value);
	    		if(qnos.includes(value.qno.toString())){
	    			//console.log(value.id);
	    			$scope.qList.push({...value});
	    		}
	    	});
    	}else{
    		$scope.notify_options.type = 'danger';
            $scope.notify_options.title = 'Error';
            $scope.notify_options.message = "Invalid input.";
            $scope.notifyAlerts();
    	}
    	
		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.resetQuestions=function(){
    	$scope.qsearch="";
    	$scope.qList=[];
    	$scope.qList=$scope.qSList;
    }

    let selectedQuestions=[];
    let Questions=[];
    $scope.updateKey=function(){
    	selectedQuestions=[];
        Questions=[];
    	$scope.qSList.forEach((value,key)=>{
    		if(value.update_option=="keychange" 
    		|| value.update_option=="addscore"){
    			selectedQuestions.push({...value});
    		}
    	});

        //console.log(selectedQuestions);
    	if(selectedQuestions.length==0){
    		$scope.notify_options.type = 'danger';
            $scope.notify_options.title = 'Error';
            $scope.notify_options.message = "Please update the key or add score.";
            $scope.notifyAlerts();
    		return;
    	}

        /*Questions.push({
                id:value.id,
                subject_id:value.subject_id,
                chapter_id:value.chapter_id,
                topic_id:value.topic_id,
                qtype:value.qtype,
                type_of_question_id:value.type_of_question_id,
                qchoice_type:value.qchoice_type,
                answer:value.answer,
                key:value.key,
                qno:value.qno,
                is_keychange:value.is_keychange,
                is_addscore:value.is_addscore,
                update_option:value.update_option,
                new_answer:value.new_answer
            });*/
        selectedQuestions.forEach((value,key)=>{
            Questions.push({
                id:value.id,
                qchoice_type:value.qchoice_type,
                numerical_type:value.numerical_type,
                answer:value.answer,
                new_answer:value.new_answer,
                key:value.key,
                qno:value.qno,
                update_option:value.update_option
            });
        });

    	$scope.showPreview=true;
    	$('#confirmId').modal('show');

		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.doProcess=async function(){
        $scope.showPreview=false;

        $scope.isConfirm=true;
    	$scope.modalLoader=true;

        for(let i=0;i<$scope.campusList.length;i++){
            const result=await $scope.updateTestScore(i);
            //console.log(i);
            //console.log(result);
            $scope.campusList[result.ckey].status=true;
            if((i+1)==$scope.campusList.length){
                $scope.updateTestQuestions();
            }
        }

		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.updateTestScore=function(ckey){
        return new Promise((resolve,reject)=>{
            //resolve($scope.campusList[ckey]);

            var params=$.param({action:'updateTestScore',
                           ckey:ckey,
                           ...$scope.campusList[ckey],
                           selectedQuestions:JSON.stringify(Questions)
                           });
            $http({method:'POST',url:API,data:params})
            .success(function(response, status, headers, config) {
                resolve({ckey:response.ckey,finished:response.finished}); 
                if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
                    $scope.$apply();
                }
             }).error(function(data, status, headers, config) {
                reject($scope.campusList[ckey]);
             });

        });
    }

    $scope.updateTestQuestions=function(){
            var params=$.param({action:'updateTestQuestions',
                                selectedQuestions:JSON.stringify(Questions)
                               });
            $http({method:'POST',url:API,data:params})
            .success(function(response, status, headers, config) {
                
                $scope.modalLoader=false;
                $scope.showPreview=true;
                if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
                    $scope.$apply();
                }
             }).error(function(data, status, headers, config) {
                $scope.modalLoader=false;
                $scope.showPreview=true;
             });
    }

    $scope.refreshModal=function(){
        //$scope.showPreview=false;
        //$scope.isConfirm=false;
        //$scope.fetchAllCampus();
        window.location.replace("key-change-"+testconfig.test_id+"-"+userInfo.course_id);
    }

    $scope.previewKey=function(){
        selectedQuestions=[];
    	$scope.qSList.forEach((value,key)=>{
    		if(value.update_option=="keychange" 
    		|| value.update_option=="addscore"){
    			selectedQuestions.push({...value});
    		}
    	});

    	if(selectedQuestions.length==0){
    		$scope.notify_options.type = 'danger';
            $scope.notify_options.title = 'Error';
            $scope.notify_options.message = "Please update the key or add score.";
            $scope.notifyAlerts();
    		return;
    	}

        $('#campusList').modal('show');
		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.notifyAlerts = function() {
        $.notify({
            // options
            icon: 'glyphicon glyphicon-warning-sign',
            title: $scope.notify_options.title,
            message: $scope.notify_options.message
        }, {
            // settings
            element: 'body',
            position: null,
            type: $scope.notify_options.type,
            allow_dismiss: $scope.notify_options.allow_dismiss,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: $scope.notify_options.spacing,
            z_index: $scope.notify_options.z_index,
            timer: $scope.notify_options.timer,
            mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        });
    }

    $scope.checkValue=function(event){
        var charCode = (event.which) ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)){ return false;}
    else{return true;}
        //$scope.keyval = event.keyCode;
       var numberRegex =/^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/
    // numberRegex.test('121220.22');
        //console.log(event.target.value);
        if(!numberRegex.test(event.target.value)){
            return;
        }
    }

    var keyboardConfig={allowedChars : new Array("+","-")};
    $scope.onlyNumbers = function(event,id) {
        console.log(id);
         var code = (event.which) ? event.which : event.keyCode;
         //var code = event.keyCode;
         if((code > 47 && code < 58) || code==46 || code==45 || code==8 || code==37){
           //console.log(event.target.value);
           var qvalue = document.getElementById("qoption_"+id);
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

    $scope.fetchAllCampus();
});


function onlyNumbersOld(evt) {
    /*var charCode = (event.which) ? event.which : event.keyCode
    console.log(charCode);
    if (charCode > 31 && (charCode < 48 || charCode > 57)){ return false;}
    else{return true;}*/
    let iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}