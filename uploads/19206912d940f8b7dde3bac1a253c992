//scan the tmp 
//if file's keep time over than 30min, remove it
;
(function(){
	var fs = require('fs');

	exports.filemanage = function(){
		console.log('filemanage start....');
		getFileInfo();
		setInterval(function(){
			getFileInfo();
		},300000);
	}

	function getFileInfo(){
		console.log('scan...');
		fs.readdir('./tmp', function(err, files){
			if(err){
				throw err;
			}

			for(var i in files){
				var path = './tmp/'+files[i];
				fs.stat(path, function(err, stats){
					var keepTime = (+new Date()) - _getTime(stats);

					if(keepTime > 1800000){
						fs.unlink(path, function(err){
							if(err){
								//throw err;
							}
							console.log('delete temp file ' + path);
						});
					}
				});
			}
		});
	}

	function _getTime(stats){
		var date = new Date(stats.mtime);
		return +date;
	}
})();