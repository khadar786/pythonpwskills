var dualListBox = '';
var selectedCampuses= [];
var campuses=[];

//Custom Test App
var CustomApp= angular.module('CustomTestCtrlApp',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);
CustomApp.controller('CustomTestCtrl',function($scope,$http,$timeout){
	$scope.customlists=[];
	$scope.courses=[];
	$scope.user_options=[{'title':'Teacher','value':'Teacher'},{'title':'Self','value':'Self'}];
$scope.status_options=[{'title':'Approved','value':'1'},{'title':'Pending','value':'0'}];
$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
$scope.loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
$scope.tot_qcnt=0;
$scope.pagination = {
        current: 1
};
$scope.range=10;
$scope.search_status=0;

//URLS
$scope.customtest_list_url="getCustomTestList.php";
$scope.courses_url="getCoursesList.php";
$scope.students_url="getAssignedStudentsList.php";

var API="api/Adminservice.php";
var notify_options={
        icon: 'glyphicon glyphicon-warning-sign',
        title:'Error',
        message:'',
        type:'danger',
        spacing: 10,
        z_index: 9999,
        timer: 1000,
      };

//Custom Test List
$scope.getCustomTestList=function(pageNumber){
	
	if($scope.search_status==0)
	$scope.tabloader=true;

	if(!$.isEmptyObject($scope.libraryTemp)){
      if(angular.isDefined($scope.searchText))
        searchText=$scope.searchText;
      else
        searchText="";

      if(angular.isDefined($scope.course_id))
        course_id=$scope.course_id;
      else
        course_id="";

      var params = $.param({'page':pageNumber,'range':$scope.range,'search':searchText,'course_id':course_id,'class_id':$scope.mentor_classes,'section_id':$scope.mentor_sections});
	}else{
	  if(angular.isDefined($scope.searchText))
        searchText=$scope.searchText;
      else
        searchText="";

      if(angular.isDefined($scope.course_id))
        course_id=$scope.course_id;
      else
        course_id="";
		var params = $.param({'page':pageNumber,'range':$scope.range,'search':searchText,'course_id':course_id,'class_id':$scope.mentor_classes,'section_id':$scope.mentor_sections});
	}

	$http({method:'POST',url: $scope.customtest_list_url,data: params}).success(function(response, status, headers, config) {
		$scope.customlists=response.customlists;
		$scope.totalItems = response.total;
		$scope.pagination.current=pageNumber;
		$scope.start_from=response.start_from;
		$timeout(function(){$scope.tabloader=false;},1000);
		
          //console.log($scope.mocklists[0]);
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
          }
	});
	
};
$scope.getSections = function()
{
	$scope.loadCourseSections();
	$scope.getList();
}
$scope.loadCourseSections = function(){
	//+"&user_id="+user_id
	$http.get("getSectionsList.php?class_id="+$scope.mentor_classes)
	.then(function (response) {
		console.log(response.data);
		$scope.mentor_sections = '';
		$scope.MentorSections = response.data.sections;
		$scope.getList();
	}
	);
}
//Searching based on institute or course
 $scope.searchDB = function(){
	 //alert($scope.searchText);
	 	var course,searchText;
		$scope.search_status=0;
		if(angular.isDefined($scope.courseid))
			course=$scope.courseid;
		else
			course="";
		
		if(angular.isDefined($scope.searchText))
			searchText=$scope.searchText;
		else
			searchText="";
			
    //if($scope.searchText.length >= 1 || $scope.courseid!=""){
	 if(searchText.length >= 1 || course!="" || searchText.length <= 1){
		  if($.isEmptyObject($scope.libraryTemp)){
			  $scope.libraryTemp = $scope.data;
			  $scope.totalItemsTemp = $scope.totalItems;
			  $scope.data = {};
		  }
		  $scope.search_status=1;
		  $scope.getCustomTestList(1);
	  }else{
		  if(! $.isEmptyObject($scope.libraryTemp)){
			  $scope.data = $scope.libraryTemp ;
			  $scope.totalItems = $scope.totalItemsTemp;
			  $scope.libraryTemp = {};
		  }
	  }
};

$scope.pageChanged=function(pageNumber){
  //console.log(pageNumber);
  //$scope.pagination.current=pageNumber;
  $scope.getCustomTestList(pageNumber);
};

//Get Range
$scope.getList=function(){
	//console.log($scope.range);
	console.log($scope.course_id);
	$scope.getCustomTestList(1);

}
//Get Subject Class
$scope.getSubjectClass=function(subject){
  //console.log(subject);
  var str='';
  if(subject.questions_size==subject.subject_qcnt){
     str='label label-success';
  }else{
     str='label label-danger';
  }

  return str;
};
//Date difference
$scope.getDateDifference=function(index){
  var current_date = Date.parse(Date())/ 1000;
  var start_date = Date.parse($scope.customlists[index].start_date) / 1000;
  var check_start="";
  if(current_date > start_date && $scope.customlists[index].test_status==1){
    check_start="btn btn-success py-0 btn-sm";
    $scope.customlists[index].del_status=true;
  }else{
  	if($scope.customlists[index].test_status==1){
  		check_start="btn btn-primary py-0 btn-sm";
    	$scope.customlists[index].del_status=false;
  	}else{
  		check_start='';
  	}
    
  }

  return check_start;
};
//Edit Test
$scope.editTest=function(index_key){
  $scope.updindex_key=index_key;
  $scope.editmocktest=$scope.customlists[index_key];
  $scope.start_date_new= $scope.editmocktest.start_date;
  $scope.end_date_new= $scope.editmocktest.end_date;
  $('#start_date_new').val($scope.editmocktest.start_date);
  $('#end_date_new').val($scope.editmocktest.end_date);
  var current_date = Date.parse(Date())/ 1000;
  var start_date = Date.parse($scope.editmocktest.start_date) / 1000;
  
  if(current_date > start_date){
    $scope.disabled_status=true;
  }else{
     $scope.disabled_status=false;
  }
  
  	jQuery('#start_date_new').datetimepicker({
	  format:'Y-m-d H:i',
	  minDate:0,
  	onShow:function( ct ){
	   this.setOptions({
	    maxDate:jQuery('#end_date_new').val()?jQuery('#end_date_new').val():false
	   })
	   setDates();
	  },
	  timepicker:true,
	  step:5,
	  minTime:0
	});

 	var datetime= jQuery('#start_date_new').val();
    var endd=datetime.split(' ')[0];

    var thirtyMinutes = 5 * 60 * 1000; // convert 5 minutes to milliseconds
	var date1 = new Date(datetime);
	var date2 = new Date(date1.getTime() + thirtyMinutes);
	//console.log(date1);
	var hrs = date2.getHours();
	var mins = date2.getMinutes();
	//minDate:endd
    jQuery('#end_date_new').datetimepicker({
    	format:'Y-m-d H:i',
		  onShow:function( ct ){
		   this.setOptions({
		    minDate:0, // 0 days offset = today
		   })
		  },
		  timepicker:true,
		  step:5,
    	//minTime:hrs+":"+mins
    });
 /* $('#start_date_new').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
      todayHighlight: true,
	    autoclose: true,
	    pickerPosition: 'bottom-left',
  });
  $('#end_date_new').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
      todayHighlight: true,
	    autoclose: true,
	    pickerPosition: 'bottom-left',
	    useCurrent: false

  });


	$('#start_date_new').on('change.datetimepicker', function (e) {
		$('#end_date_new').datetimepicker('minDate', e.date);
	});
	$('#end_date_new').on('change.datetimepicker', function (e) {
		$('#start_date_new').datetimepicker('maxDate', e.date);
	});

  
   	$('#start_date_new').datetimepicker('minDate', moment().format('yyyy-mm-dd hh:ii'));
   $('#end_date_new').datetimepicker('minDate',$('#start_date_new').val());*/
  
  //$('#start_date_new').data("DateTimePicker").minDate(moment().format('YYYY-MM-DD'));

  /*$('#end_date_new').data("DateTimePicker").minDate($('#start_date_new').val());

  $("#start_date_new").on("dp.change", function (e) {
        $('#end_date_new').data("DateTimePicker").minDate(e.date);
  		$('#end_date_new').attr('disabled',false);
  		$scope.start_date_new= $('#start_date_new').val();
  		$scope.end_date_new= $('#end_date_new').val();
   });
   $("#end_date_new").on("dp.change", function (e) {
  		$('#end_date_new').data("DateTimePicker").minDate($('#start_date_new').val());
        $('#start_date_new').data("DateTimePicker").maxDate(e.date);
        $scope.start_date_new= $('#start_date_new').val();
 		 $scope.end_date_new= $('#end_date_new').val();
    });*/

  //$scope.mocklists[index]
  $("#sub_form").modal({
    backdrop: 'static',
    keyboard: false  // to prevent closing with Esc button (if you want this too)
  });

  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
         $scope.$apply();
  }
};

//Update MockTest
$scope.updateMockTest=function(index_value){
  $scope.submitted=true;
  if($scope.updForm.$valid) {
  	//console.log($scope.start_date_new);
  	//console.log(index_value);
  	$('#row_'+index_value).addClass('danger');
  	var testinfo= $.param({'tid':$scope.customlists[index_value].id,'start_date':$scope.start_date_new,'end_date':$scope.end_date_new,'index':index_value,'action':'upd_date'});
  	$http({method:'POST',url: "updateCustomTest.php",data: testinfo}).success(function(response, status, headers, config) {
		  $('#row_'+index_value).addClass('danger');
          $scope.customlists[response.index_value].start_date=response.test_info.start_date;
          $scope.customlists[response.index_value].end_date=response.test_info.end_date;
          $scope.date_msg=response.message;
          //console.log($scope.mocklists[response.index_value]);
          $timeout(function(){$('#row_'+response.index_value).removeClass('danger success');
          	$scope.date_msg='';
          	$("#sub_form").modal('toggle');
      	  },1000);
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
          }
	});
      
  }
  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
  }
};

$scope.loadAllClasses=function(){
	$http.get("load_all_classes.php")
	.then(function (response) {
		$scope.MentorClasses = response.data;
		//$scope.mentor_classes = $scope.MentorClasses[0].id;
		$scope.mentor_classes = '';
	}
	);
}

//Copy Paper
$scope.CopyPaper=function(index_key){
	selectedCampuses=[];
  $scope.copy_index_key=index_key;
  $scope.copy_mocktest=$scope.customlists[index_key];
	$("#CopyPaper").modal({
		backdrop: 'static',
		keyboard: false  // to prevent closing with Esc button (if you want this too)
	});

	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		$scope.$apply();
	}
}


//Copy Paper To Multiple Campus
$scope.CopyPaperMultipleCampus=async function(index_key){
  // Dual Listbox
  /*$('.selected_campuses').each(function () {
    var $scam_this = $(this);
    $scam_this.empty();
  });*/

  

  $scope.copy_index_key=index_key;
  $scope.copy_mocktest=$scope.customlists[index_key];
  
  let refreshResult=await refreshDualListBox();
  //console.log(refreshResult);
  if(refreshResult){
    $scope.fetchCampusDetails();
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
      $scope.$apply();
    }

  }
    
}

$scope.copyTestMultipleCampuses=function(){
  //console.log('####');
  let copy_mocktest=$scope.copy_mocktest;
  var title=$('#copyPaperTitle').val();

  if(title==""){
    notify_options.title='error';
    notify_options.message='`<strong>Title<strong>` required';
    notify_options.type='danger';
    $scope.notifyAlerts();
    return;
  }

  var campusids = [];
  selectedCampuses.forEach((item, index) => {
      campusids.push(item);
  });

  if(campusids.length==0){
    notify_options.title='error';
    notify_options.message='Please select `<strong>campuses<strong>`';
    notify_options.type='danger';
    $scope.notifyAlerts();
    return;
  }

  $scope.copySubmitted=true;
  //console.log($scope.copy_mocktest);
  //###############
  var params=$.param({'action':'copyTest',
                      'campus_id':campus_id,
                      'title':title,
                      'campusids':campusids,
                      'tid':$scope.copy_mocktest.id,
                      'user_id':user_id,
                      'copy_index_key':$scope.copy_index_key
                    });
  $http({method:'POST',url:API,data:params})
  .success(function(response, status, headers, config) {
    let copy_completed_campus=response.copy_completed_campus;
    $scope.copySubmitted=false;
    $("#MCCopyPaper").modal('hide');

    let customHtml='';
    customHtml+=`<table class="table table-bordered"><thead class="thead-light"><tr><th>${copy_mocktest.title} copied successfully in below campus</th></tr></thead>`;
    customHtml+=`<tbody>`;

    for(var i=0;i<copy_completed_campus.length;i++){
       customHtml+=`<tr><td>${copy_completed_campus[i].campus_name}</td></tr>`;
    }

    customHtml+=`</tbody>`;
    customHtml+=`</table>`;

    Swal.fire({
      title: copy_mocktest.title+' Test Copy',
      html:customHtml,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    }).then((result) => {

      if(result.value) {
         
      }
    });

    if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
     $scope.$apply();
    }
  }).error(function(response){
    $scope.copySubmitted=false;
    if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
     $scope.$apply();
    }
  });
}

$scope.fetchCampusDetails=function(){
    var params=$.param({'action':'campuslist','campus_id':campus_id});
    $http({method:'POST',url:API,data:params})
    .success(function(response, status, headers, config) {
      campuses = [];
      if (response.campuslist.length > 0) {
          campuses = response.campuslist;
          dualListBox.selected = [];
          dualListBox.available = [];
          dualListBox.options = "";
          dualListBox._splitOptions($('#selected_campuses')[0].options);
          dualListBox.redraw();
          for(var i = 0; i < campuses.length; i++) {
              //console.log(campuses[i]);
              dualListBox._addOption({
                  'text': campuses[i].campus_name,
                  'value': campuses[i].campus_id
              });
          }
          dualListBox.updateAvailableListbox();

         $("#MCCopyPaper").modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
          });

          if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
          }
      }

      
    });

  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
  }
}

function refreshDualListBox(){
      return new Promise((resolve,reject)=>{
        console.log(dualListBox);
        if(dualListBox!=""){
          dualListBox.selected = [];
          dualListBox.available = [];
          dualListBox.options = "";
          dualListBox._splitOptions($('#selected_campuses')[0].options);
          dualListBox.redraw();
          dualListBox.updateAvailableListbox();
        }

        setTimeout(()=>{
          resolve(true);
        },300);

      });
}

$scope.sort = function(keyname){
    $scope.sortBy = keyname;   //set the sortBy to the param passed
    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
}

$scope.AssignedStudents=function(index_key){
  	$scope.assigned_mocktest=$scope.customlists[index_key];
  	$scope.StudentsperPage=10;
  	$scope.getStudentsDetails(1);

	$("#AssignedStudents").modal({
		backdrop: 'static',
		keyboard: false  // to prevent closing with Esc button (if you want this too)
	});

	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		$scope.$apply();
	}
}

$scope.getStudentsDetails = function(pageNumber) {
    var params = $.param({ 'page':pageNumber,course_id:$scope.assigned_mocktest.course_id,test_id: $scope.assigned_mocktest.id});
    $http({ method: 'POST', url: $scope.students_url, data: params }).success(function(response, status, headers, config) {
        console.log(response);
        $scope.students = response.students;
        $scope.total_students = response.total_students;
    });
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
    }
}
$scope.copyMockTest=function(index_value){
  $scope.submitted=true;
  $('#copytest').attr('disabled',true);
  $scope.cloader = true;
  if($scope.copyForm.$valid) {
  	//console.log($scope.start_date_new);
  	//console.log(index_value);
  	$('#row_'+index_value).addClass('danger');
	  var test_title = $scope.customlists[index_value].title+" Copy";
  	var testinfo= $.param({'tid':$scope.customlists[index_value].id,'title':test_title,'index':index_value,'action':'copy',campus_id:campus_id});
    $http({method:'POST',url: "copyCustomTest.php",data: testinfo}).success(function(response, status, headers, config) {
      $('#row_'+index_value).addClass('danger');
          //console.log($scope.mocklists[response.index_value]);
      $timeout(function(){
        $('#row_'+response.index_value).removeClass('danger success');
        $("#CopyPaper").modal('toggle');
      	$scope.getCustomTestList(1);
      	$('#copytest').attr('disabled',false);
      	$scope.cloader = false;
      },1000);
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
       $scope.$apply();
      }
    });
  }
  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
  }
};

$scope.generateNewTest=function(){
  $scope.submitted=true;
  if($scope.generateForm.$valid) {
      $('#generateNewTest').attr('disabled',true);
      $scope.cloader = true;
      var testinfo= $.param({'action':'generateTest','title':$scope.auto_title,'course_id':$scope.auto_course_id,'template_difficulty':$scope.template_difficulty});
      $http({method:'POST',url: "autoGenerateTestScript.php",data: testinfo}).success(function(response, status, headers, config) {
      $timeout(function(){

        console.log(response.error);
        if(response.error == true){
          $("#generate_respose").html('<div class="alert alert-danger" role="alert">'+response.message+'</div>');
          $timeout(function(){
            $("#generate_respose").html('');
          },2000);
        }else{
          $("#generate_respose").html('<div class="alert alert-success" role="alert">'+response.message+'</div>');
          $timeout(function(){
            $("#generateTest").modal('toggle');
            $scope.getCustomTestList(1);
          },2000);
          
        }
        $('#generateNewTest').attr('disabled',false);
       
        $scope.cloader = false;
      },1000);
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
       $scope.$apply();
      }
    });
  }
  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
    $scope.$apply();
  }
};
$scope.generateTest = function(){
  $("#generate_respose").html('');
  $("#generateTest").modal({
    backdrop: 'static',
    keyboard: false  // to prevent closing with Esc button (if you want this too)
  });
  $("#generateForm").trigger('reset')
}
//Get Courses
$scope.getCourses=function(){
//$http({method: 'POST', url: $scope.courses_url, data: params}).success(function(response, status, headers, config) {
var params = $.param({'ct_id':''});
$http({method: 'POST', url: $scope.courses_url, data: params}).success(function(response, status, headers, config) {
  //Courses
  $scope.courses=response.courses;
  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
          $scope.$apply();
  }
  
});
};
$scope.actionsPop=function(index_key){
    $scope.actions_mocktest=$scope.customlists[index_key];
    console.log($scope.actions_mocktest);
  $("#actionsPop").modal({
    backdrop: 'static',
    keyboard: false  // to prevent closing with Esc button (if you want this too)
  });

  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
    $scope.$apply();
  }
}

$scope.notifyAlerts=function(){
  $.notify({
        // options
        icon: 'glyphicon glyphicon-warning-sign',
        title: notify_options.title,
        message: notify_options.message 
      },{
        // settings
        element: 'body',
        position: null,
        type: notify_options.type,
        allow_dismiss:notify_options.allow_dismiss,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
          from: "top",
          align: "right"
        },
        offset: 20,
        spacing: notify_options.spacing,
        z_index: notify_options.z_index,
        timer: notify_options.timer,
        mouse_over: null,
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });
}

$scope.getCourses();
$scope.loadAllClasses();
$scope.getCustomTestList(1);
});

 function tValidate(e) {
    var keyCode = e.keyCode || e.which;
    //Regex for Valid Characters i.e. Alphabets and Numbers.
    var regex = /^[A-Za-z0-9 ]+$/;
    //Validate TextBox value against the Regex.
    var isValid = regex.test(String.fromCharCode(keyCode));

    return isValid;
}

$(document).ready(function ($) {
  var listBoxes = $(".dual-listbox");
  //dualListBox='';
  listBoxes.each(function () {
        var $this = $(this);
        // get titles
        var availableTitle = ($this.attr("data-available-title") != null) ? $this.attr("data-available-title") : "Available options";
        var selectedTitle = ($this.attr("data-selected-title") != null) ? $this.attr("data-selected-title") : "Selected options";

        // get button labels
        var addLabel = ($this.attr("data-add") != null) ? $this.attr("data-add") : "Add";
        var removeLabel = ($this.attr("data-remove") != null) ? $this.attr("data-remove") : "Remove";
        var addAllLabel = ($this.attr("data-add-all") != null) ? $this.attr("data-add-all") : "Add All";
        var removeAllLabel = ($this.attr("data-remove-all") != null) ? $this.attr("data-remove-all") : "Remove All";

        // get options
        var options = [];
        $this.children("option").each(function () {
            var value = $(this).val();
            var label = $(this).text();
            options.push({
                text: label,
                value: value
            });
        });

        // get search option
        var search = ($this.attr("data-search") != null) ? $this.attr("data-search") : "";

        // init dual listbox
        dualListBox = new DualListbox('#selected_campuses', {
            addEvent: function (value) {
                //console.log(value);
                selectedCampuses.push(value);
                //console.log(selected_attendees);
            },
            removeEvent: function (value) {
                //console.log(value);
                let index = selectedCampuses.indexOf(value);

                if (index > -1) {
                    selectedCampuses.splice(index, 1);
                }
                //console.log(selected_attendees);
            },
            availableTitle: availableTitle,
            selectedTitle: selectedTitle,
            addButtonText: addLabel,
            removeButtonText: removeLabel,
            addAllButtonText: addAllLabel,
            removeAllButtonText: removeAllLabel,
            options: options,
        });

        if (search == "false") {
            dualListBox.search.classList.add("dual-listbox__search--hidden");
        }
    });
});
        