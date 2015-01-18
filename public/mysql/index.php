<?php

	$link = @mysqli_connect("localhost", "web208-examp-996", "aditi<3", "web208-examp-996");

	if (mysqli_connect_error()) {
		die("Could not connect to database");
	}
	
	$query ="INSERT INTO `users` (`name`, `email`, `password`) VALUES('Shannon', 'shannon@outlook.com', 'columbia')";
	
	mysqli_query($link, $query);
	
	$query = "SELECT * FROM users";
	
	if ($result=mysqli_query($link, $query)) {
		
		$row = mysqli_fetch_array($result);
		
		print_r($row);
		
	} else {
		
		echo "It failed";
		
	}

?>