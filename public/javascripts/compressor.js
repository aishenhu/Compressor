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

			//console clear function
			$('#clear').click(function(){
				$('#console').empty();
			});

			$('#submit').click(this.onStartCompress);
		},

		//reset form value
		resetForm : function(){
			var log = $('#console');
			$(log).append('processing...');
		},

		onStartCompress : function(){
			var log = $('#console');
			$(log).append('<p>Processing...</p>');
		},

		//var msg = [{"retcode":0,"path":"22017ae4372435e74cc9f33c011d0766.min.js","msg":"compress success"},
		//	{"retcode":0,"path":"6b810d18609f8893098b2751c44c9ead.min.js","msg":"compress success"}];
		//	parent.Compressor.callback(msg);

		callback: function(msg){
			var log = $('#console');
			log.append('<p class="warning">Get result:</p>');
			$(log).append('-----------------------------------------------------------------------------\n');
			for(var i in msg){
				var c = "info";
				if(msg[i].retcode == '-1'){
					c = 'error';
				}
				log.append('<p class="'+c+'">file ' + msg[i].name + " : " + msg[i].msg + '</p>');
				if(msg[i].retcode != -1){
					log.append('<p>下载文件: <a href="/download?file=' + msg[i].path + '">download</a></p>');
				}
			}
			$(log).append('-----------------------------------------------------------------------------\n\n\n');
		}
	}

	Compressor.init();
	window.Compressor = Compressor;
})();