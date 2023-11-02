var pdf_block_swiper=ppt_block_swiper='';
var app=angular.module('ResourceApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination','ngYoutubeEmbed']);
app.controller('ResourceCtrl',function($scope,$http,$timeout,$compile,$sce,ngYoutubeEmbedService){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.ERPAPI='api/erp_api.php';
	$scope.topic_id=topic_id;
	$scope.chapter_id=chapter_id;
	$scope.subject_id=subject_id;
	$scope.class_id=class_id;
	$scope.campus_id=campus_id;

	$scope.pdflist=[];
	$scope.pptlist=[];
	$scope.imagelist=[];
	$scope.videolist=[];
	$scope.pdfinfo={};
	$scope.pptinfo={};
	$scope.videoinfo={};
	$scope.imginfo={};
	$scope.loader=null;
	$scope.gallery_loader=false;
	$scope.loadPDFList=function(){
		$scope.loader=true;
		var params=$.param({"action":"getChapterPdf","subject_id":$scope.subject_id,"chapter_id":$scope.chapter_id,"topic_id":$scope.topic_id,"class_id":$scope.class_id,"campus_id":$scope.campus_id});
		$http({method:'POST',url:site_url+''+$scope.ERPAPI,data:params}).success(function(data,status,headers,config){
			$scope.pdflist=data.data;
		    $scope.loadPPTList();
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.loadPPTList=function(){
		var params=$.param({"action":"getChapterPPT","subject_id":$scope.subject_id,"chapter_id":$scope.chapter_id,"topic_id":$scope.topic_id,"class_id":$scope.class_id});
		$http({method:'POST',url:site_url+''+$scope.ERPAPI,data:params}).success(function(data,status,headers,config){
			$scope.pptlist=data.data;
		    $scope.loadVideoList();
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.loadVideoList=function(){
		var params=$.param({"action":"getChaptervideos","subject_id":$scope.subject_id,"chapter_id":$scope.chapter_id,"topic_id":$scope.topic_id,"class_id":$scope.class_id,"campus_id":$scope.campus_id});
		$http({method:'POST',url:site_url+''+$scope.ERPAPI,data:params}).success(function(data,status,headers,config){
			$scope.videolist=data.data;
		    $scope.loadImageList();
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.loadImageList=function(){
		var params=$.param({"action":"getChapterImages","subject_id":$scope.subject_id,"chapter_id":$scope.chapter_id,"topic_id":$scope.topic_id,"class_id":$scope.class_id});
		$http({method:'POST',url:site_url+''+$scope.ERPAPI,data:params}).success(function(data,status,headers,config){
			$scope.imagelist=data.data;
		    $scope.initSwiper();
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}



	$scope.viewPDF=function(pindex){
		$scope.pdfinfo={};
		$scope.pdfinfo=$scope.pdflist[pindex];
		//console.log($scope.pdfinfo);
		$('#view_pdf_title').text($scope.pdfinfo.pdf_title);
		$("#pdfsrc").attr("src", $scope.pdfinfo.imagepath);
		$('#view_pdf').modal('show');
	}

	$scope.viewPPT=function(pindex){
		$scope.pptinfo={};
		$scope.pptinfo=$scope.pptlist[pindex];
		//console.log($scope.pdfinfo);
		$('#view_ppt_title').text($scope.pptinfo.filename);
		//var pptsrc='https://view.officeapps.live.com/op/embed.aspx?src=https://digital.etutor.co/upload_resources/file_example_PPT_250kB.ppt';
		var pptsrc='https://view.officeapps.live.com/op/embed.aspx?src='+$scope.pptinfo.imagepath;
		$("#pptsrc").attr("src", pptsrc);
		$('#view_ppt').modal('show');
	}

	//<iframe src='https://view.officeapps.live.com/op/embed.aspx?src=[https://www.your_website/file_name.pptx]' width='100%' height='600px' frameborder='0'>

	$scope.playVideo=function(vindex){
		$scope.videoinfo={};
		$scope.videoinfo=$scope.videolist[vindex];
		//console.log($scope.videoinfo);
        if(youTubePlayerActive()){
          $scope.player.cueVideoById({suggestedQuality: 'default',
                      playerVars: { 'enablejsapi':1,'autoplay': 1, 'controls': 1 ,'rel': 0,host: 'https://digital.etutor.co'},
                      videoId: $scope.videoinfo.filename
                       });
          $scope.player.playVideo();
        }else{
          $scope.player = new YT.Player('player', {
            width: '100%',
            playerVars: { 'enablejsapi':1,'autoplay': 1, 'controls': 1 ,'rel': 0,host: 'https://digital.etutor.co'},
            videoId: $scope.videoinfo.filename
          });
        }
        
        $("#playVideoModal").modal('show');

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
        }

	}

	//Stop Video
    $scope.stopVideo=function(){
      $("#playVideoModal").modal('hide');
      if(youTubePlayerActive()){
        $scope.player.stopVideo();
      } 
    };

    $scope.stateChanged = function(e) {
        //console.log(e);
    };

    function youTubePlayerActive() {
      return $scope.player && $scope.player.hasOwnProperty('getPlayerState');
    }

    $scope.viewGallery=function(img_index){
    	$scope.img_index=img_index;
    	$scope.imginfo={};
    	$scope.imginfo=$scope.imagelist[img_index];
    	$('#gallery_id').modal('show');
    	$scope.gallery_loader=true;
    	$scope.initModalSwiper();
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
      	}
    }

    $scope.initModalSwiper=function(){
    	setTimeout(function(){
			var swiper = new Swiper('#gallery_modal', {
			  autoHeight:true,
			  zoom: true,
		      grabCursor: true,
		      pagination: {
		        el: '.swiper-pagination',
		      },
		      navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		      },
		    });

		    swiper.slideNext($scope.img_index);
		    $scope.gallery_loader=false;
		    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                  $scope.$apply();
          	}
    	},1000);
    }

	$scope.initSwiper=function(){
		setTimeout(function(){
			var pdf_block_swiper = new Swiper('#pdf_block', {
		      slidesPerView: 3,
		      spaceBetween: 0,
		      slidesPerGroup: 3,
		      loop: false,
		      loopFillGroupWithBlank: true,
		      pagination: {
		        el: '.swiper-pagination',
		        clickable: true,
		      },
		      navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		      },
		    });

		    var pdf_block_swiper = new Swiper('#ppt_block', {
		      slidesPerView: 3,
		      spaceBetween: 0,
		      slidesPerGroup: 3,
		      loop: false,
		      loopFillGroupWithBlank: true,
		      pagination: {
		        el: '.swiper-pagination',
		        clickable: true,
		      },
		      navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		      },
		    });

			var swiper = new Swiper('#video_block', {
		      slidesPerView: 3,
		      spaceBetween: 0,
		      slidesPerGroup: 3,
		      loop: false,
		      loopFillGroupWithBlank: true,
		      pagination: {
		        el: '.swiper-pagination',
		        clickable: true,
		      },
		      navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		      },
		    });

		    var img_block_swiper = new Swiper('#image_block', {
		      slidesPerView: 3,
		      spaceBetween: 0,
		      slidesPerGroup: 3,
		      loop: false,
		      loopFillGroupWithBlank: true,
		      pagination: {
		        el: '.swiper-pagination',
		        clickable: true,
		      },
		      navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		      },
		    });

		    $scope.loader=false;
		    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                  $scope.$apply();
          	}
		},1000);
	}

	//Load PDF LIST
	$scope.loadPDFList();
});