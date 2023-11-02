//Custom Test App
var loader_fa='<i class="fas fa-spinner fa-spin" style="font-size:15px"></i>';
var API_URL='api/Service.php';
var _validation_h='';
var _validation_w='';
var addevent='';
_formEl = KTUtil.getById('addevent');
//var class_id='';
//var course_id='';
var subject_id='';
var section_id='';
var teacher_id='';

var AddEvent;
var frmvalid=false;
(function($) {
AddEvent={
	init:function() {
		$('#eid').val('7');
		addevent=KTUtil.getById('editevent');
		_validation_h=FormValidation.formValidation(addevent,
			{
				fields: {
					event_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		);

		_validation_w=FormValidation.formValidation(addevent,
			{
				fields: {
					eid: {
						validators: {
							notEmpty: {
								message: 'Event is required'
							}
						}
					},
					class_id: {
						validators: {
							notEmpty: {
								message: 'Class is required'
							}
						}
					},
					section_id: {
						validators: {
							notEmpty: {
								message: 'Section is required'
							}
						}
					},
					stream_id: {
						validators: {
							notEmpty: {
								message: 'Stream is required'
							}
						}
					},
					course_id: {
						validators: {
							notEmpty: {
								message: 'Course is required'
							}
						}
					},
					subject_id: {
						validators: {
							notEmpty: {
								message: 'Subject is required'
							}
						}
					},
					event_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					start_time: {
						validators: {
							notEmpty: {
								message: 'Start Time is required'
							}
						}
					},
					end_time: {
						validators: {
							notEmpty: {
								message: 'End Time is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		);


		$('#addeventbtn').on('click',function(e){
			e.preventDefault();
			frmvalid=false;
			var day_type=addevent.querySelector('[name="day_type"]').value;
			if(day_type=='W'){
				var startTime = new Date().setHours(AddEvent.GetHours(addevent.querySelector('[name="start_time"]').value), AddEvent.GetMinutes(addevent.querySelector('[name="start_time"]').value), 0);
			    var endTime = new Date(startTime)
			    endTime = endTime.setHours(AddEvent.GetHours(addevent.querySelector('[name="end_time"]').value), AddEvent.GetMinutes(addevent.querySelector('[name="end_time"]').value), 0);

			    var error='';
			    if (startTime > endTime) {
    				error="Start Time is greater than end time";
			    }

			    if(startTime == endTime) {
			        error="Start Time equals end time";
			    }
			    // if(startTime < endTime) {
			    // }

			    if(error!=''){
			    	Swal.fire({
					  icon: 'error',
					  title: 'Please fix below error',
					  text: error
					});
			    	return;
			    }

				//console.log('###');
				//AddEvent.fieldValidator();
				_validation_h.disableValidator('event_date');
				_validation_w.enableValidator('event_date');
				_validation_w.validate().then(function(status){
					if(status=='Valid'){

						document.getElementById("addeventbtn").disabled=true;
						$('#loader').html(loader_fa);
						var formData = new FormData();
						//formData.append('cd_id', addevent.querySelector('[name="cd_id"]').value);
						formData.append('day_type', addevent.querySelector('[name="day_type"]').value);
						formData.append('eid', addevent.querySelector('[name="eid"]').value);
						formData.append('class_id', addevent.querySelector('[name="class_id"]').value);
						formData.append('section_id', addevent.querySelector('[name="section_id"]').value);
						formData.append('stream', addevent.querySelector('[name="stream"]').value);
						formData.append('course_id', addevent.querySelector('[name="course_id"]').value);
						formData.append('subject_id', addevent.querySelector('[name="subject_id"]').value);
						formData.append('start_time', addevent.querySelector('[name="start_time"]').value);
						formData.append('end_time', addevent.querySelector('[name="end_time"]').value);
						formData.append('event_date', addevent.querySelector('[name="event_date"]').value);
						formData.append('action','updateevent');
						formData.append('cid',cid);
						axios({
							  method: 'post',
							  url:API_URL,
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
						}).then(function(response){
								document.getElementById("addeventbtn").disabled=false;
								if(response.data.upd_status){
									Swal.fire({
									  icon: 'success',
									  title: 'Edit Event',
									  text: 'Event updated successfully'
									});
									$('#addevent').trigger("reset");
               					}else{
               						Swal.fire({
									  icon: 'error',
									  title: 'Edit Event',
									  text: response.data.message
									});
               					}
               					$('#loader').html('');
            			});
					}
				});
			}else{
				//AddEvent.disableFieldValidator();
				_validation_w.disableValidator('event_date');
				_validation_h.enableValidator('event_date');
				_validation_h.validate().then(function(status){
					if(status=='Valid'){
						document.getElementById("addeventbtn").disabled=true;
						$('#loader').html(loader_fa);
						var formData = new FormData();
						formData.append('day_type', addevent.querySelector('[name="day_type"]').value);
						formData.append('event_date', addevent.querySelector('[name="event_date"]').value);
						formData.append('action','updateevent');
						formData.append('cid',cid);
						axios({
							  method: 'post',
							  url:API_URL,
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
						}).then(function(response){
               					document.getElementById("addeventbtn").disabled=false;
								if(response.data.upd_status){
									Swal.fire({
									  icon: 'success',
									  title: 'Edit Event',
									  text: 'Event updated successfully'
									});
									$('#addevent').trigger("reset");
               					}else{
               						Swal.fire({
									  icon: 'error',
									  title: 'Edit Event',
									  text: response.data.message
									});
               					}

               					$('#loader').html('');
            			});
					}
				});
			}

		});

			var dateToday = new Date();
  			var today = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate());
			// Initialize Plugins
			$('#event_date').datepicker({
			 startDate: today,
			 todayHighlight: true,
			 templates: {
			  leftArrow: '<i class="la la-angle-left"></i>',
			  rightArrow: '<i class="la la-angle-right"></i>'
			 },
			 format: 'dd-mm-yyyy',
			}).on('changeDate', function(e) {
			  //console.log(_validation_h);
			 // Revalidate field
			 //_validation_h.revalidateField('date');
			});

			// Timepicker
			$('#start_time').timepicker({
				 minuteStep: 15,
				 showSeconds: false,
				 showMeridian: true,
				 showInputs:true
			}).on('changeTime.timepicker', function(e) {
			    // console.log('The time is ' + e.time.value);
			    // console.log('The hour is ' + e.time.hours);
			    // console.log('The minute is ' + e.time.minutes);
			    // console.log('The meridian is ' + e.time.meridian);
			    $('#end_time').timepicker('setTime',e.time.value);
  			});

			$('#end_time').timepicker({
				 showSeconds: false,
				 showMeridian: true,
				 showInputs:true
			});

			 /*$('#start_time').on('changeTime', function() {
			 	  console.log($(this).val());
                  $('#end_time').timepicker('option', 'minTime', $(this).val());
             });*/
	},
	GetHours:function(d) {
	    var h = parseInt(d.split(':')[0]);
	    if (d.split(':')[1].split(' ')[1] == "PM") {
	        h = h + 12;
	    }
	    return h;
	},
	GetMinutes:function(d) {
	    return parseInt(d.split(':')[1].split(' ')[0]);
	},
	disableFieldValidator:function(dtype){
		var fields=(dtype=='W')?wfields:hfields;
		for(var i=0;i<fields.length;i++){
			//console.log(fields[i]);
			_validation_w.disableValidator(fields[i]);
		}
	},
	fieldValidator:function(dtype){
		var fields=(dtype=='W')?wfields:hfields;
		for(var i=0;i<fields.length;i++){
			//console.log(fields[i]);
			_validation_w.enableValidator(fields[i]);
		}
	},
	changeDayType:function(){
		//wfield,cmfield
		var day_type=addevent.querySelector('[name="day_type"]').value;
		if(day_type=='H'){
			$('.wfield').hide();
		}else{
			$('.wfield').show();
		}
	},
	getSections:function(cls_id){
		class_id='';
		if(cls_id!=""){
			class_id=cls_id;
			jQuery.post(API_URL,{action:"usersections",user_id:user_id,level:level,class_id:class_id,course_id:course_id})
			  .done(function( data ) {
			    	//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var sections=data.sections;
					jQuery('#section_id option[value!=""]').remove();
					for (var i=0;i<sections.length;i++) {
						jQuery('#section_id').append('<option value="'+sections[i].section_id+'">Section '+sections[i].section_name+'</option>');
					};
			  });
		}else{
			jQuery('#section_id option[value!=""]').remove();
			jQuery('#subject_id option[value!=""]').remove();
		}
	},
	/*getSections:function(cls_id){
		class_id='';
		if(cls_id!=""){
			class_id=cls_id;
			jQuery.post(API_URL,{action:"sections",class_id:class_id})
			  .done(function( data ) {
			    	//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var sections=data.sections;
					jQuery('#section_id option[value!=""]').remove();
					for (var i=0;i<sections.length;i++) {
						jQuery('#section_id').append('<option value="'+sections[i].section_id+'">Section '+sections[i].section_name+'</option>');
					};
			  });
		}else{
			jQuery('#section_id option[value!=""]').remove();
		}
	},*/
	getStream:function(sec_id){
		section_id='';
		if(sec_id!=""){
			section_id=sec_id;
			jQuery.post(API_URL,{action:"streams",section_id:section_id})
			  .done(function( data ) {
			    	var stream_info=data.stream_info;
					jQuery('#stream').val("");
					jQuery('#stream_id').val("");

					jQuery('#stream').val(stream_info.stream_name);
					jQuery('#stream_id').val(stream_info.stream_id);

			  });
		}else{
			jQuery('#stream').val("");
			jQuery('#stream_id').val("");
		}
	},
	getCourses:function(cls_id){
		class_id='';
		if(cls_id!=""){
			  jQuery('#subject_id option[value!=""]').remove();
			  class_id=cls_id;
			  jQuery.post(API_URL,{action:"courses",class_id:class_id})
			  .done(function( data ) {
			    	//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var courses=data.courses;
					jQuery('#course_id option[value!=""]').remove();
					for (var i=0;i<courses.length;i++) {
						jQuery('#course_id').append('<option value="'+courses[i].course_id+'">'+courses[i].course_name+'</option>');
					};
			  });
		}else{
			jQuery('#course_id option[value!=""]').remove();
		}
	},
	getSubjects:function(sec_id){
		if(sec_id!=""){
			  jQuery.post(API_URL,{action:"usersubjects",user_id:user_id,level:level,class_id:class_id,section_id:section_id,course_id:course_id})
			  .done(function( data ) {
			    	var subjects=data.subjects;
					jQuery('#subject_id option[value!=""]').remove();
					for (var i=0;i<subjects.length;i++) {
						jQuery('#subject_id').append('<option value="'+subjects[i].subject_id+'">'+subjects[i].subject+'</option>');
					};
			  });
		}else{
			jQuery('#subject_id option[value!=""]').remove();
		}
	},
	/*getSubjects:function(cid){
		course_id='';
		if(cid!=""){
			  course_id=cid;
			  console.log(cid);
			  jQuery.post(API_URL,{action:"subjects",class_id:class_id,course_id:course_id})
			  .done(function( data ) {
			    	//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var subjects=data.subjects;
					jQuery('#subject_id option[value!=""]').remove();
					for (var i=0;i<subjects.length;i++) {
						jQuery('#subject_id').append('<option value="'+subjects[i].subject_id+'">'+subjects[i].subject+'</option>');
					};
			  });
		}else{
			jQuery('#subject_id option[value!=""]').remove();
		}
	},*/
	getSubjectTeachers:function(sid){
		subject_id='';
		if(subject_id!=""){
			//class_id,section_id,subject_id
			jQuery.post(API_URL,{action:"teachers",class_id:class_id,section_id:section_id,subject_id:subject_id})
			  .done(function( data ) {
			  		var teachers=data.teachers;
			    	/*//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var subjects=data.subjects;
					jQuery('#subject_id option[value!=""]').remove();
					for (var i=0;i<subjects.length;i++) {
						jQuery('#subject_id').append('<option value="'+subjects[i].subject_id+'">'+subjects[i].subject+'</option>');
					};*/
			  });
		}else{
			jQuery('#teacher_id option[value!=""]').remove();
		}
	}
} 

$(document).ready(function($){
	AddEvent.init(); 
});
})(jQuery);

