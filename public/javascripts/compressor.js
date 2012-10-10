;
(function(){
	//Module Compressor
	var Compressor = {
		init : function(){
			this._bindEvent();
		},

		_bindEvent : function(){
			//switch the tab page, and set the type
			$('#mainTab a').click(function(e){
				e.preventDefault();
				$(this).tab('show');
				$('#type').val($(this).attr('type'));
			});

			//add a new url input
			$('.more').click(function(){
				var newUrlInput = $('.urls > li').last().clone();
				newUrlInput.find('input').val('');
				$('.urls').append(newUrlInput);
			});

			//remove a url input
			$('.removeUrl').live('click',function(){
				if($('.urls > li').length > 1){
					$(this).parent().remove();
				}else{
					$(this).parent().find('input').val('');
				}
			});
		},

		//reset form value
		resetForm : function(){

		},

		callback: function(msg){
			console.log(msg);
			$(document.body).append('<a href="/download?file=' + msg.path + '">download</a>')
		}
	}

	Compressor.init();
	window.Compressor = Compressor;
})();