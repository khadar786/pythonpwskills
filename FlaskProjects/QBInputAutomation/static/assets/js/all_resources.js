var Students;
var API_URL='api/Service.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id=course_id=subject_id='';
var campus_id=campus_id;
(function($) {
	Students={
		init:function() {
			var validation;
			var form = KTUtil.getById('fileupload');

			//Schedule list
			var datatable=$('#kt_datatable').KTDatatable({
				// datasource definition
				data: {
					type: 'remote',
					source: {
						read: {
							url:API_URL,
							params:{action:'resourceslist',user_id:user_id,user_level:user_level,campus_id:campus_id,resource_type:resource_type},
						},
						
					},
					pageSize: 10, // display 20 records per page
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

				// column sorting
				sortable: true,

				pagination: true,

				search: {
					input: $('#resourcesearch'),
					delay: 400,
					key: 'resourcesearch'
				},
				// columns definition
				columns: [
					{
						field: 'id',
						title: 'ID',
						sortable: 'desc',
						width: 40,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.id +'</span>';
						}
					},
					{
						field: 'first_name',
						title: 'NAME',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.first_name +'</span>';
						}
					},
					{
						field: 'class_name',
						title: 'CLASS',
						sortable: 'asc',
						width: 50,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.class_name +'</span>';
						}
					},
					{
						field: 'subject',
						title: 'Subject',
						sortable: 'asc',
						width: 125,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.subject !=null) {
								output = '<span class="font-weight-bolder">'+data.subject+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'chapter',
						title: 'Chapter',
						sortable: 'asc',
						width: 150,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.chapter !=null) {
								output = '<span class="font-weight-bolder">'+data.chapter+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'topic',
						title: 'Topic',
						sortable: 'asc',
						width: 200,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.topic !=null) {
								output = '<span class="font-weight-bolder">'+data.topic+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						width: 130,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							if (resource_type==1) {
								if(data.filetype=='pdf')
								{
								return '\
	                	         <a href="upload_resources/' +data.filename + '" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" target="_blank" title="View PDF">\
	                                    <span class="navi-icon"><i class="la la-file-pdf-o"></i></span>\
	                                    <span class="navi-text"></span>\
	                                </a>\
		                        <a href="javascript:;" onclick="deleteItem('+data.id+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete">\
									<span class="svg-icon svg-icon-md">\
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
											<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
												<rect x="0" y="0" width="24" height="24"/>\
												<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
												<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
											</g>\
										</svg>\
									</span>\
		                        </a>\
		                    ';
							}
							else if(data.filetype=='ppt')
							{
								return '\
                                <a href="upload_resources/' +data.filename + '" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" target="_blank" title="View PPT">\
                                    <span class="navi-icon"><i class="la la-print"></i></span>\
                                    <span class="navi-text"></span>\
                                </a>\
		                        <a href="javascript:;" onclick="deleteItem('+data.id+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete">\
									<span class="svg-icon svg-icon-md">\
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
											<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
												<rect x="0" y="0" width="24" height="24"/>\
												<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
												<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
											</g>\
										</svg>\
									</span>\
		                        </a>\
		                    ';
							}
							else if(data.filetype=='image')
							{
								var image = "'upload_resources/"+data.filename+"'";
									return '\
                                    <a  onclick="showImagePopup('+image+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="View Image">\
                                        <span class="navi-icon"><i class="la la-image"></i></span>\
                                        <span class="navi-text"></span>\
                                    </a>\
		                        <a href="javascript:;" onclick="deleteItem('+data.id+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete">\
									<span class="svg-icon svg-icon-md">\
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
											<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
												<rect x="0" y="0" width="24" height="24"/>\
												<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
												<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
											</g>\
										</svg>\
									</span>\
		                        </a>\
		                    ';
							}
							else if(data.filetype=='video')
							{
								var videoid = "'"+data.filename+"'";
									return '\
                                    <a onclick="showPopup('+videoid+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="View Video">\
                                        <span class="navi-icon"><i class="la la-file-video-o"></i></span>\
                                        <span class="navi-text"></span>\
                                    </a>\
		                        <a href="javascript:;" onclick="deleteItem('+data.id+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete">\
									<span class="svg-icon svg-icon-md">\
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
											<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
												<rect x="0" y="0" width="24" height="24"/>\
												<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
												<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
											</g>\
										</svg>\
									</span>\
		                        </a>\
		                    ';
							}
							}else{
								if(data.filetype=='pdf')
								{
									return '\
									 <a href="upload_resources/' +data.filename + '" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" target="_blank" title="View PDF">\
											<span class="navi-icon"><i class="la la-file-pdf-o"></i></span>\
											<span class="navi-text"></span>\
										</a>\
								';
								}
								else if(data.filetype=='ppt')
								{
									return '\
									<a href="upload_resources/' +data.filename + '" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" target="_blank" title="View PPT">\
										<span class="navi-icon"><i class="la la-print"></i></span>\
										<span class="navi-text"></span>\
									</a>\
								';
								}
								else if(data.filetype=='image')
								{
									var image = "'upload_resources/"+data.filename+"'";
										return '\
										<a  onclick="showImagePopup('+image+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="View Image">\
											<span class="navi-icon"><i class="la la-image"></i></span>\
											<span class="navi-text"></span>\
										</a>\
								';
								}
								else if(data.filetype=='video')
								{
									var videoid = "'"+data.filename+"'";
										return '\
										<a onclick="showPopup('+videoid+')" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="View Video">\
											<span class="navi-icon"><i class="la la-file-video-o"></i></span>\
											<span class="navi-text"></span>\
										</a>\
									';
								}
							}
							
						}
					}
				]
			});
			
			
		},



	};
	$(document).ready(function($){ 
		Students.init(); 
	});	

})(jQuery);

function UserStatusFilter(data){
	console.log(data);
	if(data == "0"){
		window.location.href='all-resources';
	}else{
		window.location.href='all-resources-'+data;
	}
} 

function showPopup(videoid)
{
	var ur = "https://www.youtube.com/embed/"+videoid;
	$("#someFrame").attr("src", ur);
	$('#exampleModalSizeXl').modal('show');
}
function showImagePopup(image)
{
	$('#imagepopup').modal('show');
	$("#popuimage").attr("src", image);
}

function deleteItem(rid) 
{
  if (confirm("Are you sure you want to delete this row ?")) {
		$.ajax({
        url:'ajax.php',
        type:'POST',
        data: {action: "delete_resource",rid: rid},
        dataType: 'json',
        success: function( json ) {
           swal.fire({
                    text: "Deleted",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                }).then(function() {
                    KTUtil.scrollTop();
                    window.location.replace('all-resources');
                });
        }
    });
    }
    return false;
}
function removePath(){
	$("#someFrame").attr("src", "");
}

