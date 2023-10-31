var UserCourse;
(function($) {
	UserCourse={
		init:function() {
			jQuery.post(API_URL,{action:"teacher_subjects",user_id:user_id,level:level,class_id:class_id,course_id:course_id})
			  .done(function( data ) {
			    	var mls_subjects=data.mls_subjects;
					jQuery('#mls_id option[value!=""]').remove();
					for (var i=0;i<mls_subjects.length;i++) {
						jQuery('#mls_id').append('<option value="'+mls_subjects[i].mls_id+'">'+mls_subjects[i].course_name+' '+mls_subjects[i].subject_name+' - '+mls_subjects[i].current_class+'</option>');
					}

					if(i==mls_subjects.length){
						$('#mls_id').val(data.mls_id);
						course_id=data.course_id;
						class_id=data.class_id;
						mls_id=data.mls_id;		
					}
			  });
		},
		changeCourse:function(mls_id,page){
			if(page=='tevent'){
				jQuery('#class_id option[value!=""]').remove();
				jQuery('#section_id option[value!=""]').remove();
				jQuery('#stream').val("");
				jQuery('#stream_id').val("");
				jQuery('#subject_id option[value!=""]').remove();
			}

			jQuery.post(API_URL,{action:"changecourse",user_id:user_id,mls_id:mls_id})
			  .done(function( data ) {
					$('#mls_id').val(data.mls_id);
					course_id=data.course_id;
					class_id=data.class_id;
					mls_id=data.mls_id;
					if(page=='tevent'){
						window.location.replace('teacher-add-event');
					}else if(page=='scheduler'){
						window.location.replace('scheduler');
					}else if(page=='tcalendar'){
						window.location.replace('teacher-calendar');
					}
						
			  });
		}
	}
	$(document).ready(function($){
		UserCourse.init(); 
	});
})(jQuery);