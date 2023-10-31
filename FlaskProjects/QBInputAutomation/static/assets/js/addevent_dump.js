//Custom Test App
var loader_fa='<i class="fas fa-spinner fa-spin" style="font-size:15px"></i>';
var API_URL='api/Service.php';
var _validation_h='';
var _validation_w='';
var addevent='';
_formEl = KTUtil.getById('addevent');
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id='';
var course_id='';
var subject_id='';
var section_id='';
var teacher_id='';

var AddEvent;
var frmvalid=false;
(function($) {
AddEvent={
	init:function() {
		
		addevent=KTUtil.getById('addevent');
		_validation_h=FormValidation.formValidation(addevent,
			{
				fields: {
					cd_id: {
						validators: {
							notEmpty: {
								message: 'Calendar ID is required'
							}
						}
					},
					details: {
						validators: {
							notEmpty: {
								message: 'Details is required'
							}
						}
					},
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
					cd_id: {
						validators: {
							notEmpty: {
								message: 'Calendar ID is required'
							}
						}
					},
					eid: {
						validators: {
							notEmpty: {
								message: 'Event is required'
							}
						}
					},
					details: {
						validators: {
							notEmpty: {
								message: 'Details is required'
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
				//console.log('###');
				//AddEvent.fieldValidator();
				_validation_h.disableValidator('cd_id');
				_validation_h.disableValidator('details');
				_validation_h.disableValidator('event_date');
				_validation_w.enableValidator('cd_id');
				_validation_w.enableValidator('details');
				_validation_w.enableValidator('event_date');
				_validation_w.validate().then(function(status){
					if(status=='Valid'){
						document.getElementById("addeventbtn").disabled=true;
						$('#loader').html(loader_fa);
						var formData = new FormData();
						formData.append('cd_id', addevent.querySelector('[name="cd_id"]').value);
						formData.append('day_type', addevent.querySelector('[name="day_type"]').value);
						formData.append('eid', addevent.querySelector('[name="eid"]').value);
						formData.append('act_id', addevent.querySelector('[name="act_id"]').value);
						formData.append('class_id', addevent.querySelector('[name="class_id"]').value);
						formData.append('section_id', addevent.querySelector('[name="section_id"]').value);
						formData.append('stream', addevent.querySelector('[name="stream"]').value);
						formData.append('course_id', addevent.querySelector('[name="course_id"]').value);
						formData.append('subject_id', addevent.querySelector('[name="subject_id"]').value);
						//formData.append('teacher_id', addevent.querySelector('[name="teacher_id"]').value);
						formData.append('start_time', addevent.querySelector('[name="start_time"]').value);
						formData.append('end_time', addevent.querySelector('[name="end_time"]').value);
						formData.append('details', addevent.querySelector('[name="details"]').value);
						formData.append('event_date', addevent.querySelector('[name="event_date"]').value);
						formData.append('action','addevent');

						axios({
							  method: 'post',
							  url:API_URL,
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
						}).then(function(response){
								document.getElementById("addeventbtn").disabled=false;
								if(response.data.cid>0){
									Swal.fire({
									  position: 'top-end',
									  icon: 'success',
									  title: 'Event added successfully',
									  showConfirmButton: false,
									  timer: 1500
									});
			               			/*Swal.fire({
							        	title: '<strong>Please fix the following issues:</strong>',
						                icon: "success",
						                html:edata,
						                buttonsStyling: false,
						                confirmButtonText: "Ok, got it!",
										customClass: {
											confirmButton: "btn font-weight-bold btn-light"
										}
						            }).then(function() {
										//KTUtil.scrollTop();
									});*/
									$('#addevent').trigger("reset");
               					}else{
               						Swal.fire({
									  position: 'top-end',
									  icon: 'error',
									  title: 'something went wrong pls try again!',
									  showConfirmButton: false,
									  timer: 1500
									});
               					}
               					$('#loader').html('');
               					//console.log(response.data);
               					/*if(response.data.status){
               						//console.log('####');
               						//form.resetForm(true);
               						$('#fileupload').trigger("reset");
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').show();
               						$('#alert_box').addClass('alert-success');
               						$('#alert_title').html('Success!');
               						$('#alert_msg').html('scheduler prepared successfully!');
               						$("#kt_datatable").KTDatatable("reload");
               					}else{
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').addClass('alert-danger');
               						$('#alert_title').html('Failure!');
               						$('#alert_msg').html('please try again!');
               					}
               					$('#loader').html('');*/
            			});
					}
				});
			}else{
				//AddEvent.disableFieldValidator();
				_validation_w.disableValidator('cd_id');
				_validation_w.disableValidator('details');
				_validation_w.disableValidator('event_date');
				_validation_h.enableValidator('cd_id');
				_validation_h.enableValidator('details');
				_validation_h.enableValidator('event_date');
				_validation_h.validate().then(function(status){
					if(status=='Valid'){
						document.getElementById("addeventbtn").disabled=true;
						$('#loader').html(loader_fa);
						var formData = new FormData();
						formData.append('cd_id', addevent.querySelector('[name="cd_id"]').value);
						formData.append('day_type', addevent.querySelector('[name="day_type"]').value);
						formData.append('details', addevent.querySelector('[name="details"]').value);
						formData.append('event_date', addevent.querySelector('[name="event_date"]').value);
						formData.append('action','addevent');
						axios({
							  method: 'post',
							  url:API_URL,
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
						}).then(function(response){
               					document.getElementById("addeventbtn").disabled=false;
								if(response.data.cid>0){
									Swal.fire({
									  position: 'top-end',
									  icon: 'success',
									  title: 'Event added successfully',
									  showConfirmButton: false,
									  timer: 1500
									});
			               			/*Swal.fire({
							        	title: '<strong>Please fix the following issues:</strong>',
						                icon: "success",
						                html:edata,
						                buttonsStyling: false,
						                confirmButtonText: "Ok, got it!",
										customClass: {
											confirmButton: "btn font-weight-bold btn-light"
										}
						            }).then(function() {
										//KTUtil.scrollTop();
									});*/
									$('#addevent').trigger("reset");
               					}else{
               						Swal.fire({
									  position: 'top-end',
									  icon: 'error',
									  title: 'something went wrong pls try again!',
									  showConfirmButton: false,
									  timer: 1500
									});
               					}

               					
               					$('#loader').html('');

               					/*if(response.data.status){
               						//console.log('####');
               						//form.resetForm(true);
               						$('#fileupload').trigger("reset");
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').show();
               						$('#alert_box').addClass('alert-success');
               						$('#alert_title').html('Success!');
               						$('#alert_msg').html('scheduler prepared successfully!');
               						$("#kt_datatable").KTDatatable("reload");
               					}else{
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').addClass('alert-danger');
               						$('#alert_title').html('Failure!');
               						$('#alert_msg').html('please try again!');
               					}
               					$('#loader').html('');*/
            			});
					}
				});
			}

		});

			// Initialize Plugins
			$('#event_date').datepicker({
			 todayHighlight: true,
			 templates: {
			  leftArrow: '<i class="la la-angle-left"></i>',
			  rightArrow: '<i class="la la-angle-right"></i>'
			 },
			 format: 'dd-mm-yyyy'
			}).on('changeDate', function(e) {
			  //console.log(_validation_h);
			 // Revalidate field
			 //_validation_h.revalidateField('date');
			});

			// Timepicker
			$('#start_time,#end_time').timepicker({
				 minuteStep: 1,
				 showSeconds: false,
				 showMeridian: true
			});

			$('#start_time').change(function() {
			 // Revalidate field
			 //_validation_h.revalidateField('start_time');
			});

			$('#end_time').change(function() {
			 // Revalidate field
			 //_validation_h.revalidateField('end_time');
			});
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
		//console.log(dtype);
		/*var day_type=addevent.querySelector('[name="day_type"]').value;
		if(day_type=='W'){
			AddEvent.fieldValidator(day_type);
			AddEvent.disableFieldValidator('H');
		}else{
			AddEvent.fieldValidator(day_type);
			AddEvent.disableFieldValidator('W');
		}*/
	},
	getSections:function(cls_id){
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
	},
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
	getSubjects:function(cid){
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
	},
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

