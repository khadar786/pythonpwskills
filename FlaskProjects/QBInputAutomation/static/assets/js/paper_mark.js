var app=angular.module('myApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('PaperMarkCtrl',function($scope,$http,$timeout,$compile,$sce){
	//console.log('###');
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.API='api/OSM.php';
	$scope.questions=[];
	$scope.sheets=[];
	$scope.pquestions=[];
	$scope.pqids=[];
	$scope.pqids_str="";
	$scope.testdetails={};
	$scope.Config={};
	$scope.qindex=-10;
	$scope.loader=false;
	$scope.ctlr_id='kt_body';
	$scope.max_marks=5;
	$scope.qinfo={};
	$scope.sinfo={};
	$scope.testconfig={};
	$scope.qscore='';
	//$scope.marks_list=[0.5,'1','2','3','4','5','6','7','8','9','10'];
	$scope.marks_list=[];
	$scope.marks='';
	$scope.qcomment='';
	$scope.valid_btn=true;

	$scope.notify_options={
      	icon: 'glyphicon glyphicon-warning-sign',
      	title:'Error',
      	message:'',
      	type:'danger',
      	spacing: 10,
      	z_index: 9999,
      	timer: 1000,
      };

	$scope.init=function(){
		$scope.loader=true;
		$scope.Config={
			user_id:user_id,
			test_id:test_id,
			utid:utid
		};

		var params=$.param({"action":"loadQues","user_id":$scope.Config.user_id,"test_id":$scope.Config.test_id,"utid":$scope.Config.utid});
		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
			$scope.testdetails=data.testdetails;
			$scope.questions=data.questions;
			$scope.sheets=data.sheets;
			$scope.pquestions=data.pquestions;
			$scope.pqids=data.pqids;
			$scope.testconfig=data.testconfig;

			$timeout(function(){
				$('div.page-image').first().addClass('currentPage');
				$(".page-image").hover(function(){
					$('div.page-image').removeClass('currentPage');
				    $(this).addClass('currentPage');
				});
				$scope.updateQuestions();
			},1000);
			$scope.loader=false;		
		});
	}

	$scope.updateQuestions=function(){
		//console.log();
		for(var i=0;i<$scope.questions.length;i++){
			if($scope.questions[i].is_marked==1 && $scope.questions[i].is_selected==false){
				$scope.questions[i].is_selected=true;
				//console.log($scope.questions[i]);
				var qcmt='';
				if($scope.questions[i].commentip!=''){
					qcmt='commentip';
				}
				var qno=$scope.questions[i].qno;
				var qclip="<span class='qclip "+qcmt+"' id='btn_"+i+"' data-qno='"+(i+1)+"' data-qindex='"+i+"' data-st-index='"+$scope.questions[i].sheet_index+"' data-st-id='"+$scope.questions[i].sheet_id+"' ng-click='btnQClick("+i+","+$scope.questions[i].sheet_index+")' style='position: absolute; left: "+$scope.questions[i].x_position+"; top: "+$scope.questions[i].y_position+";'><b>Q"+qno+"</b><span id='qmark_"+i+"' class='qmark'>"+$scope.questions[i].marks+"</span><span class='qclip-del' ng-click='delQ("+i+","+$scope.questions[i].sheet_indexx+")'><i class='fas fa-times'></i></span></span>";
				$(".qclip").removeClass('selectedq');
				angular.element($('#imagediv'+$scope.questions[i].sheet_index)).prepend($compile($(qclip).draggable().addClass('selectedq'))($scope));
				$('#btn-q'+(i+1)).attr('disabled','disabled');
			}else if($scope.questions[i].is_selected==true){
				$('#btn_'+i).css("left",$scope.questions[i].x_position);
				$('#btn_'+i).css("top",$scope.questions[i].y_position);
			}else{
				if($scope.questions[i].is_choice=='Y' && $scope.questions[i].marks>0){
					$('#btn-q'+(i+1)).attr('disabled','disabled');
				}
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            		$scope.$apply();
        	}
		}
	}

	$scope.qClick=function(qindex){
		if($scope.questions[qindex].is_marked==1 && $scope.questions[qindex].is_selected==false){
			return;
		}

		$scope.qindex=qindex;
		$scope.questions[$scope.qindex].qindex=qindex;
		$scope.questions[$scope.qindex].is_selected=true;
		$scope.questions[$scope.qindex].sheet_index=null;
		$scope.questions[$scope.qindex].sheet_id=null;
		var id=$('#btn-q'+($scope.qindex+1)).attr('data-qno');
		var currentPage=$(".page-image.currentPage");
		var sheet_index=currentPage.attr('data-sheet-index');
		$scope.sindex=sheet_index;
		var sheet_id=currentPage.attr('data-sheet-id');

		$scope.questions[$scope.qindex].sheet_index=sheet_index;
		$scope.questions[$scope.qindex].sheet_id=sheet_id;

		var qno=$scope.questions[$scope.qindex].qno;
		//console.log($scope.questions[$scope.qindex]);
		var pimage=currentPage.first();
		var qclip="<span class='qclip' id='btn_"+$scope.qindex+"' data-qno='"+id+"' data-qindex='"+$scope.qindex+"' data-st-index='"+$scope.sindex+"' data-st-id='"+sheet_id+"' ng-click='btnQClick("+$scope.qindex+","+$scope.sindex+")' style='position:absolute;'><b>Q"+qno+"</b><span class='qmark' style='display:none;' id='qmark_"+$scope.qindex+"'></span><span class='qclip-del' ng-click='delQ("+$scope.qindex+","+$scope.sindex+")'><i class='fas fa-times'></i></span></span>";
		$(".qclip").removeClass('selectedq');
		//$(pimage).prepend($(qclip).addClass('selectedq'));
		//$(pimage).prepend($(qclip).draggable().addClass('selectedq'));
		angular.element($(pimage)).prepend($compile($(qclip).draggable().addClass('selectedq'))($scope));
		$compile(document.getElementById($(pimage)))($scope);
		$('#btn-q'+($scope.qindex+1)).attr('disabled','disabled');
		//$compile(document.getElementById('pageimges'))($scope);
		$scope.updateComment(qindex,sheet_index);
		$scope.updateQuestions();
		if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
	}

	$scope.btnQClick=function(qindex,sindex){
		$scope.qinfo={};
		$scope.sinfo={};
		$scope.qinfo=$scope.questions[qindex];
		$scope.sinfo=$scope.sheets[sindex];
		$scope.marks=($scope.qinfo.marks>0)?$scope.qinfo.marks:'';
		$scope.qcomment=$scope.qinfo.qcomment;

		$scope.marks_list=[];
		//Prepare Mark List
		for(var m=0;m<=$scope.qinfo.qmarks;m+=0.5){
			$scope.marks_list.push({value:m});
		}
		$scope.valid_btn=false;
		if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
	}

	$scope.delQ=function(qindex,sindex){
		$scope.qinfo={};
		$scope.qinfo=$scope.questions[qindex];
		if($scope.qinfo.is_marked==1){
			Swal.fire({
			  title: 'Are you sure?',
			  html:"You want to delete this <b>Q"+($scope.qinfo.qno)+"</b> !",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
			  if(result.value) {
			  	$scope.loader=true;
			  	$scope.deleteConfirm();
			  }else{
			  	$scope.loader=false;
			  }
			});
		}else{
			$scope.loader=true;
			$('#btn_'+$scope.qinfo.qindex).remove();
			$('#btn-q'+($scope.qinfo.qindex+1)).removeAttr('disabled');
			$scope.questions[$scope.qinfo.qindex].marks='';
			$scope.marks='';
			$scope.loader=false;
		}
	}

	$scope.deleteConfirm=function(){
		var params=$.param({"action":"deleteQues",
						"user_id":$scope.Config.user_id,
						"test_id":$scope.Config.test_id,
						"utid":$scope.Config.utid,
						"id":$scope.questions[$scope.qinfo.qindex].id
					});

		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
			$scope.questions[$scope.qinfo.qindex].is_marked=data.is_marked;
			$scope.questions[$scope.qinfo.qindex].is_selected=false;
			$scope.questions[$scope.qinfo.qindex].marks='';
			$scope.questions[$scope.qinfo.qindex].qis_selected='N';
			$scope.testdetails=data.testdetails;
			$('#btn_'+$scope.qinfo.qindex).remove();
			$('#btn-q'+($scope.qinfo.qindex+1)).removeAttr('disabled');
			$scope.marks='';
			$scope.loader=false;
			Swal.fire(
			      'Deleted!',
			      'Your Q'+($scope.qinfo.qno)+' has been deleted.',
			      'success'
			    )
			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}		
		});
	}

	$scope.updateComment=function(qindex,sindex){
		$scope.qinfo={};
		$scope.sinfo={};
		$scope.qinfo=$scope.questions[qindex];
		$scope.sinfo=$scope.sheets[sindex];
		$scope.marks=($scope.qinfo.marks>0)?$scope.qinfo.marks:'';
		//console.log($scope.marks+'');
		$scope.qcomment=$scope.qinfo.qcomment;

		$scope.marks_list=[];
		//Prepare Mark List
		for(var m=0;m<=$scope.qinfo.qmarks;m+=0.5){
			$scope.marks_list.push({value:m});
		}

		$scope.valid_btn=false;
		if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
	}

	$scope.marksList=function(qmarks){
		$scope.pmarks_list=[];
		//Prepare Mark List
		for(var m=0;m<=qmarks;m+=0.5){
			$scope.pmarks_list.push({value:m});
		}

		return $scope.pmarks_list;
	}

	//Mark
	$scope.validateAllot=function(){
		//console.log($scope.qinfo);
		var btn=$scope.qinfo.qindex;
		var error='';
		if($scope.marks==''){
			error+='<p style="color:red;">Q'+($scope.qinfo.qno)+' Marks is required</p>';
		}

		var marks=parseFloat($scope.marks);
		var qmarks=parseFloat($scope.qinfo.qmarks);

		if(marks>$scope.qinfo.qmarks){
			error+='<p style="color:red;">Q'+($scope.qinfo.qno)+' Marks should be less than or equall to max marks</p>';
		}

		/*if($scope.qcomment=="" || $scope.qcomment=='undefined'){
			error+='<p style="color:red;">Q'+($scope.qinfo.qno)+' Comment is required</p>';
		}*/

		if(error!=''){
			Swal.fire({
			  icon: 'error',
			  title: 'Please fix below error',
			  html: error
			});
			return;
		}

		$scope.marks=parseFloat($scope.marks);
		$scope.loader=true;
		$('#btn_'+btn).addClass('commentip');
		//console.log();
		var x=$('#btn_'+btn).css("left");
		var y=$('#btn_'+btn).css("top");
		var sheet_index=$('#btn_'+btn).attr('data-st-index');
		var sheet_id=$('#btn_'+btn).attr('data-st-id');

		$scope.questions[$scope.qinfo.qindex].x_position=x;
		$scope.questions[$scope.qinfo.qindex].y_position=y;
		$scope.questions[$scope.qinfo.qindex].marks=$scope.marks;
		$scope.questions[$scope.qinfo.qindex].qcomment=$scope.qcomment;
		$scope.questions[$scope.qinfo.qindex].sheet_index=sheet_index;
		$scope.questions[$scope.qinfo.qindex].sheet_id=sheet_id;	

		var params=$.param({"action":"updateQues",
							"user_id":$scope.Config.user_id,
							"test_id":$scope.Config.test_id,
							"utid":$scope.Config.utid,
							"id":$scope.questions[$scope.qinfo.qindex].id,
							"marks":$scope.questions[$scope.qinfo.qindex].marks,
							"qcomment":$scope.questions[$scope.qinfo.qindex].qcomment,
							"x_position":$scope.questions[$scope.qinfo.qindex].x_position,
							"y_position":$scope.questions[$scope.qinfo.qindex].y_position,
							"sheet_index":$scope.questions[$scope.qinfo.qindex].sheet_index,
							"sheet_id":$scope.questions[$scope.qinfo.qindex].sheet_id,
							"is_choice":$scope.questions[$scope.qinfo.qindex].is_choice,
							"is_selected":$scope.questions[$scope.qinfo.qindex].is_selected
						});
		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
			$scope.questions[$scope.qinfo.qindex].is_marked=data.is_marked;
			$scope.testdetails=data.testdetails;
			$('#qmark_'+$scope.qinfo.qindex).html(parseFloat($scope.questions[$scope.qinfo.qindex].marks)).show();
			$scope.loader=false;

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}		
		});
	}

	$scope.confirmToSubmitPaper=function(){
		$scope.loader=true;
		$scope.pqloader=false;
		if($scope.pqids.length>0){
			var params=$.param({"action":"loadChoiceQues",
							"user_id":$scope.Config.user_id,
							"test_id":$scope.Config.test_id,
							"utid":$scope.Config.utid,
							"pqids":$scope.pqids
						});

			$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
						$scope.pquestions=data.pquestions;
						$scope.loader=false;
						$('#choiceqfrm').modal('show');
						if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            					$scope.$apply();
        				}
			});

		}else{
			$scope.loader=false;
			$('#choiceqfrm').modal('show');
			//$scope.submitPaPer();
		}
	}

	$scope.selectQuestion=function(pindex,cindex){
		$scope.pindex=null;
		$scope.cindex=null;
		$scope.pindex=pindex;
		$scope.cindex=cindex;

		for(var i=0;i<$scope.pquestions[pindex].choiceq.length;i++){
			$scope.pquestions[pindex].choiceq[i].is_selected='N';
		}

		$scope.pquestions[pindex].choiceq[cindex].is_selected='Y';
	}

	$scope.saveSelectedQ=function(pindex,cindex){
		$scope.nq_err='';
		$scope.pindex=null;
		$scope.cindex=null;
		$scope.pindex=pindex;
		$scope.cindex=cindex;

		$scope.pquestion={};
		$scope.pquestion=$scope.pquestions[pindex].choiceq[cindex];

		if($scope.pquestion.x_position=="" || $scope.pquestion.y_position==""){
			$scope.nq_err+="Evaluate the question and pin the question on the sheet at respective position<br>";
		}

		if($scope.pquestion.marks=="" || $scope.pquestion.marks==null){
			$scope.nq_err+="Marks is required<br>";
		}

		var marks=parseFloat($scope.pquestion.marks);
		var qmarks=parseFloat($scope.pquestion.qmarks);

		if(marks>qmarks){
			error+='<p style="color:red;">Q'+($scope.pquestion.qno)+' Marks should be less than or equall to max marks</p>';
		}

		/*if($scope.pquestion.qcomment=="" || $scope.pquestion.qcomment==null){
			$scope.nq_err+="Comment is required<br>";
		}*/

		if($scope.nq_err!=""){
			$scope.notify_options.type='danger';
			$scope.notify_options.title=$scope.pquestion.qno+' '+'Error';
			$scope.notify_options.message=$scope.nq_err;
			$scope.notifyAlerts();
			return;
		}

	   $scope.pqloader=true;
	   var params=$.param({"action":"saveChoiceQ",
						"user_id":$scope.Config.user_id,
						"test_id":$scope.Config.test_id,
						"utid":$scope.Config.utid,
						"id":$scope.pquestion.id,
						"qid":$scope.pquestion.question_id,
						"pid":$scope.pquestion.parent_id,
						"is_choice":$scope.pquestion.is_choice,
						"pindex":$scope.pindex,
						"cindex":$scope.cindex,
						"marks":$scope.pquestion.marks,
						"qcomment":$scope.pquestion.qcomment,
						"is_selected":$scope.pquestion.is_selected,
						"x_position":$scope.pquestion.x_position,
						"y_position":$scope.pquestion.y_position,
						"sheet_index":$scope.pquestion.sheet_index,
						"sheet_id":$scope.pquestion.sheet_id
					});

		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
					$scope.testdetails=data.testdetails;
					$scope.pqloader=false;
					if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        					$scope.$apply();
    				}
		});

	}

	$scope.submitChoiceQPaPer=function(){
		$('#choiceqfrm').modal('hide');
		var params=$.param({"action":"finishtest",
						"user_id":$scope.Config.user_id,
						"test_id":$scope.Config.test_id,
						"utid":$scope.Config.utid,
						"is_test_finished":0,
						"mark_for_review":($scope.testdetails.mark_for_review)?1:0
					});
		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
			$scope.testdetails=data.testdetails;
			/*$scope.loader=false;
			if($scope.testdetails.is_test_finished==1){
				Swal.fire(
			      'Submited!',
			      $scope.testdetails.sheet_folder+' paper has been submited.',
			      'success'
			    )
			}*/

			$scope.notify_options.type='success';
			$scope.notify_options.title='Mark Paper -'+$scope.testdetails.sheet_folder;
			$scope.notify_options.message='Saved successfully';
			$scope.notifyAlerts();

			$scope.loader=false;
			//$scope.cardExpand($scope.testdetails.is_test_finished);
			$scope.reloadQuestions();
			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}		
		});
	}

	$scope.reloadQuestions=function(){
		$scope.loader=true;
		$scope.Config={
			user_id:user_id,
			test_id:test_id,
			utid:utid
		};

		var params=$.param({"action":"reloadQues","user_id":$scope.Config.user_id,"test_id":$scope.Config.test_id,"utid":$scope.Config.utid});
		$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
			$scope.questions=data.questions;
			$timeout(function(){
				$('div.page-image').first().addClass('currentPage');
				$(".page-image").hover(function(){
					$('div.page-image').removeClass('currentPage');
				    $(this).addClass('currentPage');
				});
				$scope.updateQuestions();
			},1000);
			$scope.loader=false;		
		});
	}

	$scope.submitPaPer=function(){
		//console.log($scope.testdetails);

		if($scope.testdetails.is_test_finished==0){
			var msg="You want to submit the <b>"+$scope.testdetails.sheet_folder+"</b> test!";
			var is_test_finished=1;
		}else{
			var msg="You want to reset the <b>"+$scope.testdetails.sheet_folder+"</b> test!";
			var is_test_finished=0;
		}

		Swal.fire({
		  title: 'Are you sure?',
		  html:msg,
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Confirm'
		}).then((result) => {

		  if(result.value) {
		  	$scope.loader=true;
			var params=$.param({"action":"finishtest",
							"user_id":$scope.Config.user_id,
							"test_id":$scope.Config.test_id,
							"utid":$scope.Config.utid,
							"is_test_finished":is_test_finished,
							"mark_for_review":1
						});
			$http({method:'POST',url:$scope.API,data:params}).success(function(data,status,headers,config){
				$scope.testdetails=data.testdetails;
				$scope.loader=false;
				

				if($scope.testdetails.is_test_finished==1){
					Swal.fire(
				      'Submited!',
				      $scope.testdetails.sheet_folder+' paper has been submited.',
				      'success'
				    )
				}else{
					Swal.fire(
				      'Updated!',
				      $scope.testdetails.sheet_folder+' paper has been reset.',
				      'success'
				    )
				}
				$scope.loader=false;
				//$scope.cardExpand($scope.testdetails.is_test_finished);

				if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	            	$scope.$apply();
	        	}		
			});
		  }else{
		  	$scope.loader=false;
		  }

		});
	}

	$scope.trustSrc = function(src) {
  		var newsrc='descriptive_papers/'+src;
    	return $sce.trustAsResourceUrl(newsrc);
  	}

	$scope.notifyAlerts=function(){
		$.notify({
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: $scope.notify_options.title,
				message: $scope.notify_options.message 
			},{
				// settings
				element: 'body',
				position: null,
				type: $scope.notify_options.type,
				allow_dismiss:$scope.notify_options.allow_dismiss,
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

	$scope.checkQMarks=function(value){
		var rmarks='-';
		if(value.is_choice=='Y' && parseFloat(value.marks)>0){
			rmarks=value.marks;
		}

		return rmarks;
	}

	$scope.cardExpand=function(finishtest){
		var card = new KTCard('kt_card_1');
		var card2 = new KTCard('kt_card_2');


		if(finishtest==1){
			card.collapse();
			card2.collapse();
		}else{
			card.expand();
			card2.expand();
		}
	}

	$scope.selectSheet=function(sindex){
		//$('div.page-image').removeClass('currentPage');
		//$('#imagediv'+sindex).addClass('currentPage');
		//console.log('#imagediv'+sindex);
	}

	//Show Questions
	$scope.showQues=function(){
		$('#paperQ').modal({
			keyboard: false,
			show:true
		});

		setTimeout(function(){            
            var elements =$(".latex");
            renderMaths(elements);
        },100);
	}

	function renderMaths(elements)
  	{
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

	$scope.init();
});

function allowNumerORDecimal(evt, element) {
		  var charCode = (evt.which) ? evt.which : event.keyCode
		  if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
		    return false;
		  else {
		    var len = $(element).val().length;
		    var index = $(element).val().indexOf('.');
		    if (index > 0 && charCode == 46) {
		      return false;
		    }
		    if (index > 0) {
		      var CharAfterdot = (len + 1) - index;
		      if (CharAfterdot > 3) {
		        return false;
		      }
		    }

		  }
		  return true;
}

function onlyNumbers(event) {
	var charCode = (event.which) ? event.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57)){ return false;}
	else{return true;}
}

function btnClick(){
	//console.log('####');
	//angular.element('kt_body').scope().btnQClick();
}