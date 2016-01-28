function getJobList($scope, $http) {
    $http.get('http://localhost:4400/scheduler/jobs').
        success(function(data) {       
        $scope.showJobDetails =  function(data) { 
            $("#jobDetails").modal('show');
            $("#jobDetails #jobName").text(data.name)
        };
     $scope.jobList = data;    
    });
}

function getChronosCount($scope, $http) {
    $http.get('http://localhost:4400/scheduler/jobs').success(function(data) {
        var successCount = 0;
        var failureCount = 0;
        var idleCount = 0;
        for(var i=0; i < data.length; i++){
            if(data[i].lastSuccess > data[i].lastError)
                successCount += 1
            else if(data[i].lastSuccess < data[i].lastError)
                failureCount += 1
            else 
                idleCount += 1
       }
        $scope.successCount = successCount;
        $scope.numberOfJobs = data.length;
        $scope.failureCount = failureCount
        $scope.idleCount= idleCount
        });
}

