//Custom Test App
var loader_fa='<i class="fas fa-spinner fa-spin" style="font-size:15px"></i>';
var API_URL='api/Service.php';
var _validation_h='';
var _validation_w='';
var addevent='';
_formEl = KTUtil.getById('addevent');
var class_id='';
var course_id='';
var subject_id='';
var section_id='';
//var teacher_id='';
var subjects={};

var AddEvent;
var frmvalid=false;
(function($) {
AddEvent={
	init:function() {
		$('#eid').val('7');
		if(teacher_id!=''){
			AddEvent.getTeacherSubjects(teacher_id);
		}
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
					},
					teacher_id: {
						validators: {
							notEmpty: {
								message: 'Teacher is required'
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
    				error="Start Time is greater than end time<br>";
			    }

			    if(startTime == endTime) {
			        error="Start Time equals end time<br>";
			    }
			    // if(startTime < endTime) {
			    // }

			    if(jQuery.isEmptyObject(subjects)){
			    	error+="Teacher is required<br>";
			    }

			    if(subjects.length>0){
			    	var is_sub_selected=false;
			    	var is_cls_selected=false;
			    	var sec_cnt=0;
			    	var cnt=0;
			    	var subject_valid=[];
			    	for(var i=0;i<subjects.length;i++){
			    		if(subjects[i].is_sub_selected){
			    			is_sub_selected=true;
			    		}

			    		if(subjects[i].is_cls_selected){
			    			is_cls_selected=true;
			    		}

			    		if(is_sub_selected==true && is_cls_selected==true){
			    			for(var j=0;j<subjects[i].sections.length;j++){
			    				if(subjects[i].sections[j].is_sec_selected){
			    					sec_cnt++;
			    				}
			    			}
			    		}

			    		
			    		if(is_sub_selected==false || is_cls_selected==false || sec_cnt==0){
			    			sub_error="Select subject,class & sections<br>";
					    	subject_valid.push({
				    						  	is_sub_selected:is_sub_selected,
				    						  	is_cls_selected:is_cls_selected,
				    						  	sec_cnt:sec_cnt,
				    						  	error:sub_error
				    						  });
			    		}
			    		cnt++;
			    	}

			    	if(cnt==subject_valid.length){
			    		error+="Select subject,class & sections<br>";
			    	}
			    }

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
						//formData.append('class_id', addevent.querySelector('[name="class_id"]').value);
						//formData.append('section_id', addevent.querySelector('[name="section_id"]').value);
						//formData.append('stream', addevent.querySelector('[name="stream"]').value);
						//formData.append('course_id', addevent.querySelector('[name="course_id"]').value);
						//formData.append('subject_id', addevent.querySelector('[name="subject_id"]').value);
						formData.append('start_time', addevent.querySelector('[name="start_time"]').value);
						formData.append('end_time', addevent.querySelector('[name="end_time"]').value);
						formData.append('event_date', addevent.querySelector('[name="event_date"]').value);
						formData.append('teacher_id', addevent.querySelector('[name="teacher_id"]').value);
						formData.append('subjects', JSON.stringify(subjects));
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
	getTeacherSubjects:function(tid){
		teacher_id='';
		subjects={};
		if(tid!=''){
			teacher_id=tid;
			$('#pmain').addClass('overlay-block rounded');
			$('#pqloader').show();
			  jQuery.post(API_URL,{action:"teachersubjects",teacher_id:teacher_id,cid:cid})
			  .done(function( data ) {
			    	subjects=data.subjects;
			    	$('#loader').html(loader_fa);
			    	$('#cls_sec').empty();
			    	var subject_html='';
			    	for(var i=0;i<subjects.length;i++){
			    		//Div start
			    		subject_html+='<div class="form-group row wfield">';
			    		if(subjects[i].is_sub_selected && subjects[i].is_cls_selected){
			    			subject_html+='<label class="checkbox checkbox-primary mb-4" style="margin-left:12px;"><input type="checkbox" id="sid_'+i+'" name="sid_'+i+'" value="'+subjects[i].subject_id+'" onclick="AddEvent.selectSubject('+i+');" checked/> <strong>'+subjects[i].subject+'</strong> ('+subjects[i].course+') <span></span></label>';
			    		}else{
			    			subject_html+='<label class="checkbox checkbox-primary mb-4" style="margin-left:12px;"><input type="checkbox" id="sid_'+i+'" name="sid_'+i+'" value="'+subjects[i].subject_id+'" onclick="AddEvent.selectSubject('+i+');"/> <strong>'+subjects[i].subject+'</strong> ('+subjects[i].course+') <span></span></label>';
			    		}
			    		
			    		subject_html+='<div class="col-lg-6">';
			    		if(subjects[i].is_cls_selected){
			    		subject_html+='<label class="checkbox checkbox-primary mb-4"><input type="checkbox" id="clsid_'+i+'" name="clsid_'+i+'" value="'+subjects[i].class_id+'" onclick="AddEvent.selectClass('+i+');" checked/> '+subjects[i].class_name+' <span></span></label>';
			    		}else{
			    			subject_html+='<label class="checkbox checkbox-primary mb-4"><input type="checkbox" id="clsid_'+i+'" name="clsid_'+i+'" value="'+subjects[i].class_id+'" onclick="AddEvent.selectClass('+i+');"/> '+subjects[i].class_name+' <span></span></label>';
			    		}

			    		subject_html+='<div class="checkbox-inline">';
			    		for(var j=0;j<subjects[i].sections.length;j++){
			    			var section=subjects[i].sections[j];
			    			if((subjects[i].is_sub_selected && subjects[i].is_cls_selected) && section.is_sec_selected){
			    				subject_html+='<label class="checkbox checkbox-primary"><input type="checkbox" id="secid_'+i+'_'+j+'" name="secid_'+i+'_'+j+'" value="'+section.section_id+'" onclick="AddEvent.selectSection('+i+','+j+');" checked/> '+section.section_name+' ('+section.stream_name+')<span></span></label>';
			    			}else{
			    				subject_html+='<label class="checkbox checkbox-primary"><input type="checkbox" id="secid_'+i+'_'+j+'" name="secid_'+i+'_'+j+'" value="'+section.section_id+'" onclick="AddEvent.selectSection('+i+','+j+');"/> '+section.section_name+' ('+section.stream_name+')<span></span></label>';
			    			}
			    			
			    		}
			    		subject_html+='</div>';
			    		subject_html+='</div>';
			    		subject_html+='</div>';
			    		//Div end
			    		subject_html+='<div class="separator separator-dashed mt-4 mb-4"></div>';
			    	}
					$('#cls_sec').append(subject_html);
					$('#loader').html('');
					$('#pmain').removeClass('overlay-block rounded');
					$('#pqloader').hide();
			  });
		}else{
			$('#cls_sec').empty();
			//jQuery('#subject_id option[value!=""]').remove();
			$('#pmain').removeClass('overlay-block rounded');
			$('#pqloader').hide();
		}
		
	},
	selectSubject:function(sindex){
		if($('#sid_'+sindex).prop('checked') == true){
		    subjects[sindex].is_sub_selected=true;
		}else{
			subjects[sindex].is_sub_selected=false;

			//Uncheck the class and sections
			$('#clsid_'+sindex).prop('checked',false);
			AddEvent.unselectSections(sindex);
		}
	},
	selectClass:function(sindex){
		if($('#clsid_'+sindex).prop('checked') == true){
		    subjects[sindex].is_cls_selected=true;
		}else{
			subjects[sindex].is_cls_selected=false;
			AddEvent.unselectSections(sindex);
		}
	},
	selectSection:function(sindex,sec_index){
		if($('#secid_'+sindex+'_'+sec_index).prop('checked') == true){
		    subjects[sindex].sections[sec_index].is_sec_selected=true;
		}else{
			subjects[sindex].sections[sec_index].is_sec_selected=false;
		}
	},
	unselectSections:function(sindex){
		for(var j=0;j<subjects[sindex].sections.length;j++){
			$('#secid_'+sindex+'_'+j).prop('checked',false);
		}
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

