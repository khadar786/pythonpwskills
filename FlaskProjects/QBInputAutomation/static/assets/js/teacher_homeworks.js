var TeacherHomework;
var API_URL='api/OSM.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var datatable='';
(function($){
  TeacherHomework={
  	init:function(){
  		$('#subject_id').val(subject_id+'_'+class_id);
  		TeacherHomework.getSubjectTests(subject_id);
  	},
  	getTestTypeSubjects:function(tt_id){
  		if($('#subject_id').val()!=""){
  		  var subject_cls=$('#subject_id').val().split('_');
  		  subject_id=subject_cls[0];
  		  class_id=subject_cls[1];
		  jQuery.post(API_URL,{action:"testlist",subject_id:subject_id,class_id:class_id,"test_type_id":$('#test_type_id').val()})
		  .done(function( data ) {
		    	var testlist=data.testlist;
				jQuery('#test_id option[value!=""]').remove();
				for (var i=0;i<testlist.length;i++) {
					jQuery('#test_id').append('<option value="'+testlist[i].id+'">'+testlist[i].title+'</option>');
				};

				if(testlist.length>0){
				  $('#test_id').val(testlist[0].id);
				  TeacherHomework.testPapersSummary(testlist[0].id);
				}else{
					$('#papers_pending').text(0);
		    		$('#papers_done').text(0);
				}

				TeacherHomework.loadStudents();
		  });
  		}else{
  			jQuery('#test_id option[value!=""]').remove();
  			$('#papers_pending').text(0);
		    $('#papers_done').text(0);
  		}
  	},
  	getSubjectTests:function(sid){
  		if(sid!=''){
  		  var subject_cls=$('#subject_id').val().split('_');
  		  subject_id=subject_cls[0];
  		  class_id=subject_cls[1];
		  jQuery.post(API_URL,{action:"testlist",subject_id:subject_id,class_id:class_id})
		  .done(function( data ) {
		    	var testlist=data.testlist;
				jQuery('#test_id option[value!=""]').remove();
				for (var i=0;i<testlist.length;i++) {
					jQuery('#test_id').append('<option value="'+testlist[i].id+'">'+testlist[i].title+' ('+testlist[i].cnt+') '+'</option>');
				};

				if(testlist.length>0){
				  $('#test_id').val(testlist[0].id);
				  TeacherHomework.testPapersSummary(testlist[0].id);
				}else{
					$('#papers_pending').text(0);
		    		$('#papers_done').text(0);
				}

				TeacherHomework.loadStudents();

		  });
  		}else{
  			jQuery('#test_id option[value!=""]').remove();
  			$('#papers_pending').text(0);
		    $('#papers_done').text(0);
  		}
  	},
  	loadStudents:function(){
  		if(datatable!=''){
  			datatable.destroy();
  		}

	  var subject_cls=$('#subject_id').val().split('_');
	  subject_id=subject_cls[0];
	  class_id=subject_cls[1];

  		datatable=$('#kt_datatable').KTDatatable({
				// datasource definition
				data: {
					type: 'remote',
					source: {
						read: {
							url:API_URL,
							params:{action:'descriptivetestusers',
									subject_id:subject_id,
									class_id:class_id,
									test_type_id:$('#test_type_id').val(),
									test_id:$('#test_id').val()
								},
						},
					},

					pageSize: 20, // display 20 records per page
					serverPaging: true,
					serverFiltering: true,
					serverSorting: true,
					saveState:false
				},

				// layout definition
				layout: {
					scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
					footer: false, // display/hide footer
				},

				translate:{
					records:{
						processing:'Please wait...',
						noRecords:'No records found'
					}
				},

				// column sorting
				sortable: true,
				pagination: true,

				search: {
					input: $('#kt_subheader_search_form'),
					delay: 400,
					key: 'generalSearch'
				},

				// columns definition
				columns:[
					{
						field: 'user_id',
						title: '#',
						sortable: 'asc',
						width: 40,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.user_id +'</span>';
						}
					},
					{
						field: 'email',
						title: 'Roll no',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.email +'</span>';
						}
					},
					{
						field: 'first_name',
						title: 'Name',
						width: 200,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.first_name +'</span>';
						}
					},
					{
						field: 'score',
						title: 'Marks',
						width: 200,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var btn='';
							if(data.is_uploaded){
								if(data.is_test_finished==1){
									btn='<span class="font-weight-bolder">'+data.score +'</span>';
								}else{
									btn='<span class="font-weight-bolder">----</span>';
								}
							}else{
								btn='<span class="font-weight-bolder">----</span>';
							}

							return btn;
						}
					},
					{
						field: 'class_name',
						title: 'Class & Section',
						width: 150,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.class_name+' - '+data.section_name+'</span>';
						}
					},
					{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						width: 150,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							var btn='';
							if(data.is_uploaded){
								if(data.is_test_finished==1){
									btn='<span class=""><button type="button" class="btn btn-success font-weight-bold mr-2 mt-2 mb-2 py-1">Marked</button></span>';
								}else{

									var btn_text='Mark';
									if(data.mark_for_review==1){
										btn_text='Marks for Review';
									}

									btn+='<a href="paper-marking-'+data.utid+'" class="btn btn-info font-weight-bold mr-2 mt-2 mb-2 py-1">'+btn_text+'</a>';

									if(data.mark_for_review==1){
										btn+='<a href="javascript:void(0);" class="btn btn-sm btn-danger font-weight-bold mr-2 mt-2 mb-2 py-1" id="utid_'+data.utid+'" data-uname="'+data.first_name+'" data-rollno="'+data.email+'"  data-user_id="'+data.user_id+'" data-test_id="'+data.test_id+'" onclick="TeacherHomework.confirmReview('+data.utid+');">Confirm Review</a>';
									}
								}
							}else{
								btn='<span class=""><button type="button" class="btn btn-warning font-weight-bold mr-2 mt-2 mb-2 py-1">Pending</button></span>';
							}

						  	return btn;
						}
					}
				]
			});
  	},
  	testPapersSummary:function(test_id){
  		if(test_id!=""){
  		  var subject_cls=$('#subject_id').val().split('_');
  		  subject_id=subject_cls[0];
  		  class_id=subject_cls[1];
  		  jQuery.post(API_URL,{action:"paper_summary",subject_id:subject_id,class_id:class_id,test_id:$('#test_id').val()})
		  .done(function( data ) {
		    	$('#papers_pending').text(data.papers_pending);
		    	$('#papers_done').text(data.papers_done);
		  });
  		}else{
  			$('#papers_pending').text(0);
		    $('#papers_done').text(0);
  		}
  		  
  	},
  	confirmReview:function(utid){
  		var utid=utid;
  		var uname=$('#utid_'+utid).attr('data-uname');
  		var rollno=$('#utid_'+utid).attr('data-rollno');
  		var user_id=$('#utid_'+utid).attr('data-user_id');
  		var test_id=$('#utid_'+utid).attr('data-test_id');

  		Swal.fire({
		  title: 'Confirm review ?',
		  html:''+uname+' ('+rollno+') ',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Confirm'
		}).then((result) => {

		  if(result.value) {
		  	  params={
		  	  	action:"finishtest",
		  	  	user_id:user_id,
		  	  	test_id:test_id,
		  	  	utid:utid,
		  	  	is_test_finished:1,
		  	  	mark_for_review:1
		  	  }

			  jQuery.post(API_URL,params)
			  .done(function( data ) {
			    	TeacherHomework.loadStudents();
			  });
		  }
		});
  	},
  	resetTableData:function(){

  	}
  }
  $(document).ready(function($){ 
		TeacherHomework.init(); 
  });
})(jQuery);