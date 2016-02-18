var host = 'http://localhost:4400'

angular.module('chronApp',[])
    .config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];        
    });

function getJobList($scope, $http) {
    $http.get(host + '/scheduler/jobs').
    success(function(data) {
        $scope.showJobDetails = function(job) {
            $("#jobDetails").modal('show');
            $("#jobDetails #jobName").text(job.name)
            $("#jobDetails #description").text(job.description)
            $("#jobDetails #command").text(job.command)
            $("#jobDetails #owner").text(job.owner)
            $("#jobDetails #lastSuccess").text(timeDifference(job.lastSuccess))
            $("#jobDetails #successCount").text(job.successCount)
            $("#jobDetails #errorCount").text(job.errorCount)
            $("#jobDetails #lastError").text(timeDifference(job.lastError))
            $("#jobDetails #schedule").text(job.schedule)
            $('#volInfoTable').find("tr:gt(0)").remove();
            for(var i = 0; i < job.container.volumes.length; i++ ){
                var ico="";
                if(job.container.volumes[i].mode=="RO")
                    ico="<i class='fa fa-lock'></i>"
                else
                    ico="<i class='fa fa-unlock'></i>"
            $('#volInfoTable > tbody:last-child').append('<tr><td>'+job.container.volumes[i].hostPath+'</td><td>'+job.container.volumes[i].containerPath+'</td><td><div class="badge bg-blue">'+ico+job.container.volumes[i].mode+'</div></td></tr>');
            }
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
        $scope.failureCount = failureCount;
        $scope.idleCount = idleCount;
        convertDate();
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
function timeDifference(previous) {
    if(previous == ""){return "No Previous runs";}
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var elapsed = new Date - new Date(previous);
    if (elapsed < msPerMinute) return Math.round(elapsed/1000) + ' seconds ago';
    else if (elapsed < msPerHour) return Math.round(elapsed/msPerMinute) + ' minutes ago';
    else if (elapsed < msPerDay ) return Math.round(elapsed/msPerHour ) + ' hours ago';
    else return new Date(previous)+"";
}

angular.module('chronApp').filter('dateTransform', function($filter){
    return function(input){
        if(input == null || input == "") return "";
        return timeDifference(input);
    };
});