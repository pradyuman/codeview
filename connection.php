<?php

	mysqli::ssl_set ("fd472459482810-key.pem", "fd472459482810-cert.pem", "cleardb-ca.pem");

	$link = @mysqli_connect("us-cdbr-azure-northcentral-a.cleardb.com", "b2b0d4aacdbe47", "6189e9a4", "codeintAhnilThma");
	
	if($link) {
		alert("nice!");
	}

?>