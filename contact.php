<?php
// Include PHPMailer classes
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Determine which form was submitted
    if (isset($_POST['form1'])) {
        $form_id = "Kasetti";
    } elseif (isset($_POST['form2'])) {
        $form_id = "CD";
    } else {
        http_response_code(403);
        echo "Lomakkeen lähetyksessä tapahtui virhe, yritä uudelleen.";
        exit;
    }

    // Retrieve form inputs
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $quantity = intval(trim($_POST["quantity"]));
    $address = strip_tags(trim($_POST["address"]));
    $city = strip_tags(trim($_POST["city"]));
    $postalcode = strip_tags(trim($_POST["postalcode"]));

    // Validate the form inputs
    if (empty($name) || empty($email) || empty($quantity) || empty($address) || empty($city) || empty($postalcode) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Ole hyvä ja täytä lomake uudelleen.";
        exit;
    }

    // Set the recipient email address (seller)
    $recipient = "hattara@hattaraband.com";  // Replace with your email

    // Set the email subject for the seller
    $subject = "Uusi tilaus ($form_id): $name";

    // Build the email content for the seller
    $email_content = "Nimi: $name\n";
    $email_content .= "Sähköposti: $email\n";
    $email_content .= "Määrä: $quantity\n\n";
    $email_content .= "Osoitetiedot:\n";
    $email_content .= "Katuosoite: $address\n";
    $email_content .= "Kaupunki: $city\n";
    $email_content .= "Postinumero: $postalcode\n";

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'mail.zoner.fi'; // Set the SMTP server to send through
        $mail->SMTPAuth = true;
        $mail->Username = 'hattara@hattaraband.com'; // SMTP username
        $mail->Password = 'mSp6HRFux6YTq3mPMx36'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Enable TLS encryption
        $mail->Port = 465; // TCP port to connect to

        // Sender info
        $mail->setFrom('hattara@hattaraband.com', 'Hattara');

        // Recipient
        $mail->addAddress($recipient); // Add the seller's email address

        // Content for the seller
        $mail->isHTML(false); // Set email format to plain text
        $mail->CharSet = 'UTF-8'; // Ensure UTF-8 encoding
        $mail->Subject = $subject;
        $mail->Body = $email_content;

        // Send the email to the seller
        $mail->send();

        // Send a confirmation email to the buyer
        $mail->clearAddresses();
        $mail->addAddress($email); // Add the buyer's email address
        $mail->Subject = "Tilausvahvistus: $form_id - $name";
        $mail->Body = "Hei $name,\n\n" . "Kiitos tilauksestasi. Tässä on tilauksen tiedot:\n\n" . $email_content . "\n\nVoit maksaa tilauksen MobilePaylla numeroon: +358 50 5569 471, tai tilisiirrolla: FI43 1103 5000 1615 24. Kun maksu on vastaanotettu, lähetämme tilauksesi. Muista laskea postikulut mukaan!";

        $mail->send();

        // Respond to the user
        http_response_code(200);
        echo "Kiitos! Tilauksesi on vastaanotettu. Olet saanut tilausvahvistuksen sähköpostiisi.";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Hups! Jotain meni pieleen, emmekä voineet lähettää tilaustasi. Virhe: {$mail->ErrorInfo}";
    }
}