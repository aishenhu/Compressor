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
				$('#type').val(2);
				$('.urls').append(newUrlInput);
			});

			//remove a url input
			$('.removeUrl').live('click',function(){
				$('#type').val(2);
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

		//var msg = [{"retcode":0,"path":"22017ae4372435e74cc9f33c011d0766.min.js","msg":"compress success"},
		//	{"retcode":0,"path":"6b810d18609f8893098b2751c44c9ead.min.js","msg":"compress success"}];
		//	parent.Compressor.callback(msg);

		callback: function(msg){

			for(var i in msg){
				$(document.body).append('<p>file ' + msg[i].name + msg[i].msg + '</p>');
				$(document.body).append('<a href="/download?file=' + msg[i].path + '">download</a>');
			}
			$(document.body).append('-------------------------------------\n');
		}
	}

	Compressor.init();
	window.Compressor = Compressor;
})();