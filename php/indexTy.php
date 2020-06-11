<?php

$urlFile = 'https://belogorsk.tu.market/data/nameSection_belog.json';

$strFile = file_get_contents($urlFile);

echo json_encode $strFile;
json
?>