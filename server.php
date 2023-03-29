<?php
$_POST = json_decode(file_get_contents("php://input"));
echo var_dump($_POST);