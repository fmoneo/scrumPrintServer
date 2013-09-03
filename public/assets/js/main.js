// Global Variables
$("#myTable").tablesorter();
var jsonOut = [];

// Add events to buttons
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('getPDFButton').addEventListener('click', getPDFClick, false);

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
} else {
	alert('The FileReader() API are not fully supported in this browser.');
}

function getPDFClick() {
	$.ajax({  
		url: "/ws",  
		type: "POST",  
		dataType: "text",  
		contentType: "application/json",  
		data: JSON.stringify(jsonOut),  
		success: function(data){              
			var win=window.open("/pdf/out.pdf");
			win.focus();
		},  
		error: function(){  
			$("#genMsg").append("<span class='glyphicon glyphicon-remove'></span>&nbsp;PDF Generator Failed!!!");
			$("#genMsg").removeClass("hidden").removeClass("alert-success"); 
			$("#genMsg").addClass('alert-danger');  
		}  
	}); 
}

function handleFileSelect(evt) {

	// Reset all elements on the page
	$("#genMsg").empty();
	$("#genMsg").addClass("hidden").addClass("alert-success").removeClass("alert-danger").removeClass("alert-warning"); ;
	jsonOut.length = 0;
	$('#myTable > tbody').empty();	
	$("#getPDFButton").addClass("disabled");
	
	var numOfUnknownTypes = 0;

	var files = evt.target.files; // FileList object

	// files is a FileList of File objects. List some properties.
	var output = [];	
	
	var reader = new FileReader();
	
	for (var i = 0, f; f = files[i]; i++) {
				  
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2				
				var text = evt.target.result;
				//break the lines apart
				var lines = text.split(/\r\n|\n/);
				
				//For each line in the file
				for(var j = 0; j<lines.length; j++){
					var scrumCard = new Object();
					
					var information = $.csv.toArray(lines[j]);
					//var information = lines[j].split(',');
					
					if(information.length != 6 && lines[j].length>0 && j<lines.length-1){
						$("#genMsg").append("<span class='glyphicon glyphicon-remove'></span>&nbsp;CSV file doesn't have 6 columns");
						$("#genMsg").removeClass("hidden").removeClass("alert-success"); 
						$("#genMsg").addClass('alert-danger');
						return;
					}
					
					if(information.length == 6){
						scrumCard.id = information[0];
						scrumCard.title = information[1];
						scrumCard.assignedTo = information[2];
						scrumCard.pri = information[3];
						scrumCard.hours = information[4];
						scrumCard.type = information[5];
						
						if(scrumCard.type != "User Story" && 
							scrumCard.type != "Dev Task" &&
							scrumCard.type != "Test Task" &&
							scrumCard.type != "PM Task" &&
							scrumCard.type != "Release Task" &&
							scrumCard.type != "Bug") {
							numOfUnknownTypes ++;
						}
						
						$('#myTable > tbody:last').append('<tr style="display: table-row;"><td>'+scrumCard.id+'</td><td>'+scrumCard.title+'</td><td>'+scrumCard.assignedTo+'</td><td>'+scrumCard.pri+'</td><td>'+scrumCard.hours+'</td><td>'+scrumCard.type+'</td></tr>');					
						
						jsonOut.push(scrumCard);
					}
				} //for each line
				
				var resort = true, // re-apply the current sort
				callback = function(){
				  // do something after the updateAll method has completed
				};
				//console.log('UpdateAll');
				$("#myTable").trigger("updateAll", [ resort, callback ]);
				
				$("#getPDFButton").removeClass("disabled");
				
				
				
				if(numOfUnknownTypes==0){
					$("#genMsg").append("<span class='glyphicon glyphicon-ok'></span>&nbsp;&nbsp;File upload completed successfully.");
					$("#genMsg").removeClass("hidden");
				} else {
					$("#genMsg").append("<span class='glyphicon glyphicon-exclamation-sign'></span>&nbsp;&nbsp;File upload completed successfully, but the file has <strong>" + numOfUnknownTypes + " unknown type(s)</strong>. <p><small><em>Please make sure that the Type column has one of these values: User Story, Dev Task, Test Task, PM Task, Release Task or Bug.</em></small></p>");
					$("#genMsg").removeClass("hidden").removeClass("alert-success").addClass('alert-warning');
				}
				
			} // if file read is done
		};		
		
		reader.readAsBinaryString(f);		
		
	} // for each file	
	
  } //function handleFileSelect



