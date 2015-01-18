<?php

	session_start();
	
	if($_GET["logout"] == 1 AND $_SESSION['id']) {
	
		session_destroy();
		
		$logoutmessage = "You have been logged out.";
		
		session_start();
		
	}
	
	if ($_POST['submit']=="Sign Up") {
		
		//Email validation
		if (!$_POST['email']) $error.="<br />Please enter your email";
			else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) $error.= "<br />Please enter a valid email";
		
		//Password validation
		if(!$_POST['password']) $error.= "<br />Please enter your password";
			else {
				if (strlen($_POST['password']) < 8) $error.= "<br />Please enter a valid password (at least 8 characters)";
				if (!preg_match('`[A-Z]`', $_POST['password'])) $error.="<br />Please enter a valid password (at least one capital letter)";
			}
			
		if($error) $error = "There were errors in your signup details:".$error;
			else {
			
				//Connect to mysql database
				include("connection.php");

				if (mysqli_connect_error()) {
					die("Could not connect to database");
				}
				
				//Check if the email entered into SIGN UP area is the same as an email in the database
				$query = "SELECT * FROM `users` WHERE email='".mysqli_real_escape_string($link, $_POST['email'])."'";
				
				$result = mysqli_query($link, $query);
				
				$results = mysqli_num_rows($result);
				
				//If email is same, display a Log In message (cannot sign up with same email address)
				if($results) $error = "That email address is already registered. Do you want to log in?";
					//Else sign up the email and password combination
					else {
						$query = "INSERT INTO `users` (`email`,`password`) VALUES('".mysqli_real_escape_string($link, $_POST['email'])."', '".md5(md5($_POST['email']).$_POST['password'])."')";
						
						$result = mysqli_query($link, $query);
						
						//Get ID of person that just signed up
						$_SESSION['id'] = mysqli_insert_id($link);
						
						header("Location:application.php");
						
					}
			}
	}
	
	if($_POST['submit']=="Log In") {
		
		//Email validation
		if (!$_POST['LIemail']) $LIerror.="<br />Please enter your email";
			else if (!filter_var($_POST['LIemail'], FILTER_VALIDATE_EMAIL)) $LIerror.= "<br />Please enter a valid email";
			
		if($LIerror) $LIerror = "There was an error with your email.".$LIerror; 
			else {
				//Connect to mysql database
				include("connection.php");

				if (mysqli_connect_error()) {
					die("Could not connect to database");
				}
				
				//Verify that the email and password match
				$query = "SELECT * FROM `users` WHERE email='".mysqli_real_escape_string($link, $_POST['LIemail'])."' AND password = '".md5(md5($_POST['LIemail']).$_POST['LIpassword'])."' LIMIT 1";
				
				$result = mysqli_query($link, $query);
				
				$row = mysqli_fetch_array($result);
				
				if ($row) {
					$_SESSION['id'] = $row['ID'];
					
					header("Location:application.php");
					
				} else $LIerror = "Log in was unsuccessful. Please check your username and password.";
				
			}
		
	}

?>