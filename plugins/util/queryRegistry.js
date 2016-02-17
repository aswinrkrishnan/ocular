var host = "http://192.168.99.100:5000"
//var host="http://s025wpll6601.s4.chp.cba:8443"
function getRepoList($scope, $http) {
    $http.get(host + '/v2/_catalog').success(function(data) {
        $scope.repos = data.repositories;
        getTags($scope, $http);
    });
}

function getTags($scope, $http) {
    $scope.repoTags = new Array();
    var repos = $scope.repos;
    for (var i = 0; i < repos.length; i++) {
        $http.get(host + '/v2/' + repos[i] + '/tags/list').success(function(data) {
            $scope.repoTags.push(data);
            showRepoTags();
            $scope.getRepoTagDetails = function(repo, tag) {
                $http.get(host + '/v2/' + repo + '/manifests/' + tag).success(function(data) {
                    console.log(host + '/v2/' + repo + '/manifests/' + tag)
                    $("#jobDetails").modal('show');
                    $("#jobDetails #jobName").text(data.name)
                    $("#jobDetails #tag").text(data.tag)
                    $("#jobDetails #architecture").text(data.architecture)
                    var history = jQuery.parseJSON(data.history[0].v1Compatibility)
                    $("#jobDetails #created").text(new Date(history.created))
                    $("#jobDetails #image").text(history.Image)
                    $("#jobDetails #container").text(history.container)
                    $("#jobDetails #dockerVersion").text(history.docker_version)
                    $("#jobDetails #os").text(history.os)
                    $("#jobDetails #size").text(history.Size)
                });
            }
        });
    }
}

function repoTagdetails($scope, $http) {
    var repoTagDetails = new Array();
    var repoTags = $scope.repoTags;
    for (var i = 0; i < repoTags.length; i++) {
        for (var j = 0; j < repoTags[i].tags.length; j++) {
            $http.get(host + '/v2/' + repoTags[i].name + '/manifests/' + repoTags[i].tags[j]).success(function(data) {
                repoTagDetails.push({
                    name: data.name,
                    tag: {
                        tagName: data.tag
                    }
                });
            });
        }
    }
    $scope.repoTagDetails = repoTagDetails;
}

function getTagsCount($scope, $http) {
    $http.get(host + '/v2/_catalog').success(function(data) {
        $scope.repoCount = data.repositories.length;
        $scope.imageCount = 0;
        for (var i = 0; i < data.repositories.length; i++) {
            $http.get(host + '/v2/' + data.repositories[i] + '/tags/list').success(function(tagData) {
                $scope.imageCount += tagData.tags.length;
            });
        }
    });
}