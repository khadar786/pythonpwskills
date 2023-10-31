var SheetUpload;
var API_URL='api/OSM.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var form='';
var user={};
let course_id='';
let subject_id='';
let test_type_id='';
let test_id='';
let class_id='';
let section_id='';
var datatable='';
(function($){
	SheetUpload={
		init:function(){
			
			//Test list
			datatable=$('#kt_datatable').KTDatatable({
				// datasource definition
				data: {
					type: 'remote',
					source: {
						read: {
							url:API_URL,
							params:{action:'descriptivelist',
									course_id:$('#course_id').val(),
									subject_id:$('#subject_id').val(),
									test_type_id:$('#test_type_id').val(),
									test_id:$('#test_id').val(),
									class_id:$('#class_id').val(),
									section_id:$('#section_id').val()
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
						width: 75,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							//user={};
							//user=data;
							var id=1;
							if(data.ut_tid>0){
							var btn='\<span class="">\<button type="button" class="btn btn-success font-weight-bold mr-2 mt-2 mb-2 py-1" data-toggle="modal" data-target="#">\Done\</button>\</span>';
							}else{
							var btn='\<span class="" id="user_'+data.user_id+'" data-uid="'+data.user_id+'" data-name="'+data.first_name+'" data-rollno="'+data.email+'">\<button type="button" class="btn btn-info font-weight-bold mr-2 mt-2 mb-2 py-1" onclick="SheetUpload.uploadSheets({user_id:'+data.user_id+'});">\Upload\</button></span>';
							}
						  return btn;
						}
					}
				]
			});
		},
		uploadSheets:function(user){
			var user_id=uname=rollno='';
			user_id=user.user_id;
			uname=$('#user_'+user_id).attr('data-name');
			rollno=$('#user_'+user_id).attr('data-rollno');
			$('#title').text(uname+' ('+user_id+')');
			var test_id=$('#test_id').val();
			form=KTUtil.getById('fileupload');
			const validateUploadFile=function(){
				return {
					validate: function(input) {
						const value = input.value;
						let filename=value.replace("C:\\fakepath\\", "");
						let extention=filename.toLowerCase().split('.').pop();
						//console.log(extention);

						//if(extention=='zip' || extention=='pdf'){
						if(extention=='zip'){
							return {
			                    valid: true,
			                };
						}else{
							return {
		                    	valid: false,
		                	};
						}

						//console.log(filename+'######');
						return {
		                    valid: true,
		                };
					},
				};
			};

			FormValidation.validators.checkFile=validateUploadFile;

			validation = FormValidation.formValidation(form,
			{
						fields: {
							uploadfile: {
								validators: {
									notEmpty: {
										message: 'File is required'
									},
									checkFile: {
			                            message: 'The selected file should be zip'
			                        },
								}
							},
						},
						plugins: {
							trigger: new FormValidation.plugins.Trigger(),
							bootstrap: new FormValidation.plugins.Bootstrap()
						}
				}
			)

			$('#submit').on('click',function(e){
				e.preventDefault();
				validation.validate().then(function(status){
					if(status=='Valid'){
						document.getElementById("submit").disabled=true;
						$('#submit').addClass('spinner spinner-white spinner-right');
						var formData = new FormData();
						var uploadFiles=form.querySelector('[name="uploadfile"]').files;
						formData.append('uploadfile', uploadFiles[0]);
						formData.append('user_id',user_id);
						formData.append('test_id',test_id);
						axios({
							  method: 'post',
							  url: 'extract_sheets.php',
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
							}).then(function(response){
								document.getElementById("submit").disabled=false;
								$('#submit').removeClass('spinner spinner-white spinner-right');
								if(response.data.utest_id>0){
									$("#kt_datatable").KTDatatable("reload");
									var title='Success';
									var message=uname+ '('+rollno+') test data submitted successfully';
									var type='success';

									validation.resetField('uploadfile',true);
									validation.resetForm('reset',true);
									$('#upload').modal('hide');
								}else{
									var title='Error';
									var message=uname+ '('+rollno+') test data submition fail';
									var type='danger';
								}
								SheetUpload.notificationAlert(title,message,type);
							});
					}
				});
			});

			$('#closebtn,#closebtn2').on('click',function(e){
				e.preventDefault();
				validation.resetField('uploadfile',true);
				validation.resetForm('reset',true);
			});
			//document.getElementById("fileupload").reset();
			$('#upload').modal('show');
			//$('#fileupload').trigger("reset");
		},
		notificationAlert:function(title,message,type){
			$.notify({
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: title,
				message: message 
			},{
				// settings
				element: 'body',
				position: null,
				type: type,
				allow_dismiss:true,
				newest_on_top: false,
				showProgressbar: false,
				placement: {
					from: "top",
					align: "right"
				},
				offset: 20,
				spacing: 10,
				z_index: 9999,
				timer: 1000,
				mouse_over: null,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				}
			});
		},
		getSubjects:function(cid){
			if(cid!=""){
				  course_id=cid;
				  jQuery.post(API_URL,{action:"subjects",course_id:course_id})
				  .done(function( data ) {
				    	var subjects=data.subjects;
						jQuery('#subject_id option[value!=""]').remove();
						for (var i=0;i<subjects.length;i++) {
							console.log(subjects[i]);
							jQuery('#subject_id').append('<option value="'+subjects[i].subject_id+'">'+subjects[i].subject+'</option>');
						};
				  });

			}else{
				jQuery('#subject_id option[value!=""]').remove();
				jQuery('#test_id option[value!=""]').remove();
				jQuery('#section_id option[value!=""]').remove();
				jQuery('#class_id option[value!=""]').remove();
				SheetUpload.resetDataTable();
			}
		},
		getSubjectTests:function(sid){
			if(sid!=""){
				  subject_id=sid;
				  jQuery.post(API_URL,{action:"testlist",course_id:course_id,subject_id:subject_id})
				  .done(function( data ) {
				    	var testlist=data.testlist;
						jQuery('#test_id option[value!=""]').remove();
						for (var i=0;i<testlist.length;i++) {
							jQuery('#test_id').append('<option value="'+testlist[i].id+'">'+testlist[i].title+'('+testlist[i].test_type+')</option>');
						};
				  });

			}else{
				jQuery('#test_id option[value!=""]').remove();
				jQuery('#class_id option[value!=""]').remove();
				SheetUpload.resetDataTable();
			}
			
		},
		getTestsBasedOnTestType:function(ttid){
			if(ttid!=""){
				test_type_id=ttid;
				jQuery('#test_id option[value!=""]').remove();
				jQuery.post(API_URL,{action:"testlist",course_id:course_id,subject_id:subject_id,test_type_id:ttid})
				.done(function( data ) {
				    	var testlist=data.testlist;
						jQuery('#test_id option[value!=""]').remove();
						for (var i=0;i<testlist.length;i++) {
							jQuery('#test_id').append('<option value="'+testlist[i].id+'">'+testlist[i].title+'('+testlist[i].test_type+')</option>');
						};
				 });
			}
		},
		getClasses:function(test_id){
			if(test_id!=""){
				test_id=test_id;
				jQuery.post(API_URL,{action:"classes",test_id:test_id})
				  .done(function( data ) {
				    	var classes=data.classes;
						jQuery('#class_id option[value!=""]').remove();
						for (var i=0;i<classes.length;i++) {
							jQuery('#class_id').append('<option value="'+classes[i].class_id+'">'+classes[i].class_name+'</option>');
						};
				  });
			}else{
				jQuery('#class_id option[value!=""]').remove();
			}
		},
		getSections:function(clsid){
			if(clsid!=""){
				class_id=clsid;
				jQuery.post(API_URL,{action:"sections",class_id:class_id,test_id:$('#test_id').val()})
				  .done(function( data ) {
				    	var sections=data.sections;
						jQuery('#section_id option[value!=""]').remove();
						for (var i=0;i<sections.length;i++) {
							jQuery('#section_id').append('<option value="'+sections[i].section_id+'">'+sections[i].section_name+'</option>');
						};
				  });
			}else{
				jQuery('#section_id option[value!=""]').remove();
			}
			
		},
		getTestSubscribedUsers:function(){
			course_id=$('#course_id').val();
			subject_id=$('#subject_id').val();
			test_id=$('#test_id').val();
			test_type_id=$('#test_type_id').val();
			class_id=$('#class_id').val();
			section_id=$('#section_id').val();

			var error="";
			if(course_id=="" || course_id=="undefined"){
				error+="Course is required<br>";
			}

			if(subject_id=="" || subject_id=="undefined"){
				error+="Subject is required<br>";
			}

			if(test_id=="" || test_id=="undefined"){
				error+="Test is required<br>";
			}

			if(error!=""){
					Swal.fire({
					  title: '<strong>Please select below required fields in filter</strong>',
					  icon: 'error',
					  html:error,
					  showCloseButton: true,
					  showCancelButton: false,
					  focusConfirm: false,
					  confirmButtonText:
					    'Okay',
					  confirmButtonAriaLabel: 'Thumbs up, great!'
					})
				return;
			}
			//$("#kt_datatable").KTDatatable("reload");
			datatable.destroy();
			SheetUpload.init();
		},
		resetDataTable:function(){
			datatable.destroy();
			SheetUpload.init();
		}
	};
	$(document).ready(function($){ 
		SheetUpload.init(); 
	});
})(jQuery);