//Custom Test App
var API_URL='changelanguage.php';
var AddEvent;
(function($) {
Util={
	init:function() {

	},
	changeLanguage:function(lng){
		//console.log(lng);
		jQuery.post(API_URL,{action:"changelanguage",lng:lng})
		.done(function(data){
			location.reload();
		});
	}
} 

$(document).ready(function($){ 
	//Util.changeLanguage();
});
})(jQuery);