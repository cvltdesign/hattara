<?php
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
    $country = strip_tags(trim($_POST["country"]));

    // Validate the form inputs
    if (empty($name) || empty($email) || empty($quantity) || empty($address) || empty($city) || empty($postalcode) || empty($country) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Ole hyvä ja täytä lomake uudelleen.";
        exit;
    }

    // Set the recipient email address (seller)
    $recipient = "hattaratheband@gmail.com";  // Replace with your email

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
    $email_content .= "Maa: $country\n";

    // Build the email headers
    $email_headers = "Lähettäjä: $name <$email>";

    // Send the email to the seller
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        
        // Send a confirmation email to the buyer
        $buyer_subject = "Tilausvahvistus: $form_id - $name";
        $buyer_content = "Hei $name,\n\n";
        $buyer_content .= "Kiitos tilauksestasi. Tässä on tilauksen tiedot:\n\n";
        $buyer_content .= $email_content; // Reuse the content for confirmation
        $buyer_content .= "\n\nVoit maksaa tilauksen MobilePaylla numeroon: +358 50 5569 471, tai tilisiirrolla: FI43 1103 5000 1615 24. Kun maksu on vastaanotettu, lähetämme tilauksesi. Muista laskea postikulut mukaan!";
        
        $buyer_headers = "Lähettäjä: Hattara <hattaratheband@gmail.com>";  // Replace with your sender email
        
        // Send email to the buyer
        mail($email, $buyer_subject, $buyer_content, $buyer_headers);
        
        // Respond to the user
        http_response_code(200);
        echo "Kiitos! Tilauksesi on vastaanotettu. Olet saanut tilausvahvistuksen sähköpostiisi.";
    } else {
        http_response_code(500);
        echo "Hups! Jotain meni pieleen, emmekä voineet lähettää tilaustasi.";
    }
}
?>