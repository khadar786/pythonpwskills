//Custom Test App
var API_URL='api/CustomTestService.php';
var _validations = [];
_formEl = KTUtil.getById('addevent');
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id=course_id=subject_id='';
var AddEvent;
(function($) {
AddEvent={
	init:function() {
	},
	importExcel:function(){
	}
} 

$(document).ready(function($){ 
	Scheduler.init(); 
	//Scheduler.getScheduleList();
});
})(jQuery);