var videoPlayer=document.getElementById("player");
var app=angular.module('ResourceApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);

app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);

app.controller('ResourceCtrl',function($scope,$http,$timeout,$compile,$sce){
	$scope.selected_lang=selected_lang;
	$scope.videolist=[
						{
							id:1,
							title:'English',
							poster:'https://digital.etutor.co/videos/posters/3.jpg',
							vid:'3.mp4',
							vpath:'https://digital.etutor.co/videos/3.mp4',
							lang:'english'
						},
						{
							id:2,
							title:'हिन्दी',
							poster:'https://digital.etutor.co/videos/posters/2.jpg',
							vid:'1.mp4',
							vpath:'https://digital.etutor.co/videos/2.mp4',
							lang:'hindi'
						},
						{
							id:3,
							title:'ଓଡିଆ',
							poster:'https://digital.etutor.co/videos/posters/1.jpg',
							vid:'2.mp4',
							vpath:'https://digital.etutor.co/videos/1.mp4',
							lang:'odia'
						},
						
				  ];

	$scope.videoinfo={};
	$scope.playVideo=function(vid){
		$scope.videoinfo={};
		$scope.videoinfo=$scope.videolist.find(video=>video.id==vid);
		console.log($scope.videoinfo);
		$("#player").attr('src',$scope.videoinfo.vpath);
		$("#playVideoModal").modal('show');
		


		/*$('#player').videre({
		  video: {
		    quality: [
		      {
		        label: '720p',
		        src: $scope.videoinfo.vpath
		      }
		    ],
		    title: $scope.videoinfo.title
		  },
		  dimensions: 768
		});*/
		/*$('#player').videre({
			video: {
				quality: [
					{
						label: '720p',
						src: 'https://digital.etutor.co/videos/'+$scope.videoinfo.vid
					},
					{
						label: '360p',
						src: 'https://digital.etutor.co/videos/'+$scope.videoinfo.vid
					},
					{
						label: '240p',
						src: 'https://digital.etutor.co/videos/'+$scope.videoinfo.vid
					}
				],
				title: $scope.videoinfo.title
			},
			dimensions: 1280
		});*/

		

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
        }
	}

	//Stop Video
    $scope.stopVideo=function(){
      $("#playVideoModal").modal('hide');
      videoPlayer.pause();
 	  videoPlayer.currentTime=0;
    };
});