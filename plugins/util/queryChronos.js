var host = 'http://localhost:4400'

function getJobList($scope, $http) {
    $http.get(host + '/scheduler/jobs').
    success(function(data) {
        $scope.showJobDetails = function(job) {
            $("#jobDetails").modal('show');
            $("#jobDetails #jobName").text(job.name)
            $("#jobDetails #description").text(job.description)
            $("#jobDetails #command").text(job.command)
            $("#jobDetails #owner").text(job.owner)
            $("#jobDetails #lastSuccess").text(job.lastSuccess)
            $("#jobDetails #successCount").text(job.successCount)
            $("#jobDetails #errorCount").text(job.errorCount)
            $("#jobDetails #lastError").text(job.lastError)
            $("#jobDetails #schedule").text(job.schedule)
        };
        $scope.jobList = data;
    });
}

function getChronosCount($scope, $http) {
    $http.get(host + '/scheduler/jobs').
    success(function(data) {
        var successCount = 0;
        var failureCount = 0;
        var idleCount = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].lastSuccess > data[i].lastError)
                successCount += 1
            else if (data[i].lastSuccess < data[i].lastError)
                failureCount += 1
            else
                idleCount += 1
        }
        $scope.successCount = successCount;
        $scope.numberOfJobs = data.length;
        $scope.failureCount = failureCount
        $scope.idleCount = idleCount
    });
}

function dependancyGraph($scope, $http) {
    $http.get(host + '/scheduler/graph/dot').success(function(DOTstring) {
        var parsedData = vis.network.convertDot(DOTstring);
        var data = {
                nodes: parsedData.nodes,
                edges: parsedData.edges
            }
            // create a network
        var container = document.getElementById('graph');
        var options = {}
            // initialize your network!
        var network = new vis.Network(container, data, options);
    });
}