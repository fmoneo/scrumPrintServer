// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The FileReader() API are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
	
	var jsonOut = [];
	
	var reader = new FileReader();
	
    for (var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
				  
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				document.getElementById('byte_content').textContent = evt.target.result;
				var text = evt.target.result;
				//break the lines apart
				var lines = text.split('\r\n');
				for(var j = 0; j<lines.length; j++){
					var scrumCard = new Object();
					
					var information = lines[j].split(',');
					
					scrumCard.id = information[0];
					scrumCard.title = information[1];
					scrumCard.assignedTo = information[2];
					
					//for(var k = 0; k < information.length; k++){
						
					//}
					
					
					jsonOut.push(scrumCard);
					console.log(j + ">>" + lines[j]);
				}
				console.log(JSON.stringify(jsonOut));
				
				//$.post("/ws", JSON.stringify(jsonOut)) 
				//.done(function(data) {
				//	alert("Response: " + data);
				//});
				
				$.ajax({  
					url: "/ws",  
					type: "POST",  
					dataType: "text",  
					contentType: "application/json",  
					data: JSON.stringify(jsonOut),  
					success: function(data){              
						alert("success :-)");
						console.log(data);
						var win=window.open("/pdf/out.pdf");
						win.focus();
					},  
					error: function(){  
						alert("fail :-(");  
					}  
				}); 
				
				
			}
		};
		
		
		reader.readAsBinaryString(f);
		
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

