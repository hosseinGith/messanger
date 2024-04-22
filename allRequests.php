<?php
// changeStatus
if (isset($_GET['checkMemberInSystem']) != '') {
    $userId = $_GET['userId'];
    $users = json_decode(file_get_contents('./users.json'));

    if (!$userId || preg_match("/\</", $userId) != 0 || preg_match("/\>/", $userId) != 0) {
        echo 'failed';
        return;
    }
    foreach ($users as $user) {
        if ($user->userId === $userId) {
            echo 'success';
            return;
        }
    }
    echo 'failed';

} else if (isset($_GET['deleteMsg']) != '') {
    $del = $_GET['del'];
    if (!$del || preg_match("/\W/", $del) != 0) {
        echo 'failed';

        return;
    }
    if ($del === 'h1o3s8s6ein') {
        $jsonFile = fopen('./globalMessanger.json', 'w');
        fwrite($jsonFile, '[]');
        fclose($jsonFile);
    }
    echo 'success';
} else if (isset($_GET['getUserData']) != '') {
    $userData = $_GET['userData'];
    if (!$userData || preg_match("/\W/", $userData) != 0) {
        echo 'failed';
        return;
    }
    $oldData = json_decode(file_get_contents('./usersGetData.json'));
    array_push($oldData, json_decode($userData));
    $jsonFile = fopen('./usersGetData.json', 'w');
    fwrite($jsonFile, json_encode($oldData));
    fclose($jsonFile);

} else if (isset($_GET['loginUser']) != '') {
    $userName = $_GET['userName'];
    $userPass = $_GET['userPass'];
    if (
        !$userName || !$userPass ||
        preg_match("/\W/", $userName) != 0 ||
        preg_match("/\W/", $userPass) != 0
    ) {
        echo 'inputs';
        return;
    }

    $oldData = json_decode(file_get_contents('./users.json'));
    $isHasUserName = 0;
    foreach ($oldData as $user) {
        if (
            $user->userName == $userName &&
            $user->userPass == $userPass
        ) {
            echo json_encode($user);
            return;
        } else if (
            $user->userName == $userName &&
            $user->userPass != $userPass
        ) {
            echo "password";
            return;
        }
    }

    echo "name";
} else if (isset($_GET['newUser']) != '') {
    $userName = $_GET['userName'];
    $userPass = $_GET['userPass'];
    $userGlobalName = $_GET['userGlobalName'];
    if (
        !$userName || !$userPass || !$userGlobalName ||
        preg_match("/\W/", $userName) != 0 ||
        preg_match("/\W/", $userPass) != 0 ||
        preg_match("/\</", $userGlobalName) != 0 ||
        preg_match("/\>/", $userGlobalName) != 0 ||
        preg_match("/\<\w+\>/", $userGlobalName) != 0
    ) {
        echo 'failed';
        return;
    }

    $oldData = json_decode(file_get_contents('./users.json'));
    $newUser = array(
        'status' => 'true',
        'userName' => $userName,
        "userGlobalName" => $userGlobalName,
        'userId' => rand(86845, 9999) . uniqid('', true),
        'userPass' => $userPass
    );
    foreach ($oldData as $user) {
        if ($user->userId == $newUser['userId']) {
            $newUser['userId'] = rand(86845, 9999) . uniqid('', true);
        }
    }
    foreach ($oldData as $user) {
        if ($user->userName === $userName) {
            echo "name";
            return;
        }
    }
    array_push($oldData, $newUser);
    $jsonFile = fopen('./users.json', 'w');
    fwrite($jsonFile, json_encode($oldData));
    fclose($jsonFile);
    echo json_encode($newUser);

} else if (isset($_GET['postAllMsg']) != '') {
    $roomId = $_GET['roomId'];
    $userId = $_GET['userId'];
    if (!$userId || preg_match('/\</', $userId) || preg_match('/\>/', $userId)) {
        echo 'failed';
        return;
    }
    if (
        preg_match("/\W/", $roomId) != 0
    ) {
        echo 'failed';
        return;
    }
    if ($roomId == '') {
        $roomFile = json_decode(file_get_contents("./globalMessanger.json"));
        foreach ($roomFile as $user) {
            if ($user->userId !== $userId) {
                $user->userId = '';
            }
        }
        echo json_encode($roomFile);
    } else {
        if (!file_exists("./rooms/")) {
            mkdir("./rooms/");
        }
        if (file_exists("./rooms/$roomId.json")) {
            $roomFile = json_decode(file_get_contents("./rooms/$roomId.json"));
            foreach ($roomFile as $user) {
                $user->userId = '';
            }
            echo $roomFile;
        } else {
            $room = fopen("./rooms/$roomId.json", 'w');
            fwrite($room, "[]");
            fclose($room);
            echo file_get_contents("./rooms/$roomId.json");
        }
    }


} else if (isset($_GET['setMsg']) != '') {
    $userId = $_GET['userId'];
    $userGlobalName = $_GET['userGlobalName'];
    $roomId = $_GET['roomId'];
    $repalyedMessage = null;
    $isReplayedUrlImg = null;
    $photo = null;
    if ($roomId != '') {
        $oldData = json_decode(file_get_contents("./rooms/$roomId.json"));
        $dirPath = "./rooms/$roomId.json";
    } else {
        $oldData = json_decode(file_get_contents('./globalMessanger.json'));
        $dirPath = "./globalMessanger.json";
    }
    if (isset($_GET['repalyedMessage']) != '') {
        $repalyedMessage = $_GET['repalyedMessage'];
    }
    if (isset($_GET['isReplayedUrlImg']) != '') {
        $isReplayedUrlImg = $_GET['isReplayedUrlImg'];
    }
    if (
        $repalyedMessage != null &&
        preg_match("/\</", $repalyedMessage) != 0 ||
        preg_match("/\>/", $repalyedMessage) != 0 ||
        preg_match("/\<\w+\>/", $repalyedMessage) != 0
    ) {
        echo 'failed';
        return;
    }

    if (
        $isReplayedUrlImg != null &&
        preg_match("/\</", $isReplayedUrlImg) != 0 ||
        preg_match("/\>/", $isReplayedUrlImg) != 0 ||
        preg_match("/\<\w+\>/", $isReplayedUrlImg) != 0
    ) {
        echo 'failed';
        return;
    }

    if (
        !$userId || !$userGlobalName ||
        preg_match("/\</", $userId) != 0 ||
        preg_match("/\>/", $userId) != 0 ||
        preg_match("/\</", $userGlobalName) != 0 ||
        preg_match("/\>/", $userGlobalName) != 0 ||
        preg_match("/\<\w+\>/", $userGlobalName) != 0 ||
        preg_match("/\</", $roomId) != 0 ||
        preg_match("/\>/", $roomId) != 0
    ) {
        echo 'failed';
        return;
    }
    if (isset($_GET['imgUrl']) != '') {
        $imgUrl = $_GET['imgUrl'];
        if (
            !$imgUrl ||
            preg_match("/\</", $imgUrl) != 0 ||
            preg_match("/\>/", $imgUrl) != 0 ||
            preg_match("/\<\w+\>/", $imgUrl) != 0
        ) {
            echo 'failed';
            return;
        }
        $newMessage = array("imgUrl" => $imgUrl, "userId" => $userId, 'userGlobalName' => $userGlobalName, 'msgId' => uniqid('userMsg', true));
        foreach ($oldData as $user) {
            if (property_exists($user, 'msgId')) {
                if ($user->msgId == $newMessage['msgId']) {
                    $newMessage['msgId'] = uniqid('userMsg', true);
                }
            }
        }
        if ($repalyedMessage != null) {
            $newMessage['repalyedMessage'] = $repalyedMessage;
        }
        if ($isReplayedUrlImg != null) {
            $newMessage['isReplayedUrlImg'] = 'true';
        }
        array_push($oldData, $newMessage);
        $jsonFile = fopen($dirPath, 'w');
        fwrite($jsonFile, json_encode($oldData));
        fclose($jsonFile);
        echo json_encode($oldData);
        return;
    } else if (isset($_GET['msg']) != '') {
        $msg = $_GET['msg'];
        $isHasUserId = 0;
        $oldData;
        $dirPath;
        $users = json_decode(file_get_contents('./users.json'));

        foreach ($users as $user) {
            if ($user->userId === $userId) {
                $isHasUserId = 1;
            }
        }
        if (
            !$msg ||
            !$userId || !$userGlobalName || $isHasUserId === 0
        ) {
            echo 'failed';
            return;
        }
        $msg = preg_replace("/</", '&#10094;', $msg);
        $msg = preg_replace("/>/", '&#10095;', $msg);
        print_r($msg);
        $newMessage = array("msg" => $msg, "userId" => $userId, 'userGlobalName' => $userGlobalName, 'msgId' => uniqid('userMsg', true));
        foreach ($oldData as $user) {
            if (property_exists($user, 'msgId')) {
                if ($user->msgId == $newMessage['msgId']) {
                    $newMessage['msgId'] = uniqid('userMsg', true);
                }
            }
        }


        if ($repalyedMessage != null) {
            $newMessage['repalyedMessage'] = $repalyedMessage;
        }
        if ($isReplayedUrlImg != null) {
            $newMessage['isReplayedUrlImg'] = 'true';
        }

        array_push($oldData, $newMessage);
        $jsonFile = fopen($dirPath, 'w');
        fwrite($jsonFile, json_encode($oldData));
        fclose($jsonFile);
        echo json_encode($oldData);
    }

} else if (isset($_GET['uploadPhoto'])) {

    $target_dir = "./photos/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir);
    }
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

    // Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if ($check) {
            echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            echo "typeError";
            $uploadOk = 0;
        }
    }
    // Check if file already exists
    if (file_exists($target_file)) {
        echo "already";
        $uploadOk = 0;
    }
    if ($_FILES["fileToUpload"]["size"] > (30 * 1048576)) {
        echo "large";
        $uploadOk = 0;
        return;
    }
    // Allow certain file formats
    if (
        $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif"
    ) {
        echo "typeError";
        $uploadOk = 0;
        return;
    }
    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "failed";
        return;
        // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            echo "success";
            return;
        } else {
            echo "failed";
            return;
        }
    }

} else if (isset($_GET['showUsersLength'])) {
    $oldData = json_decode(file_get_contents('./users.json'));
    print_r(count($oldData));
} else {
    echo '<h1 style="text-align:center;">!! 404 !!</h1>';
}