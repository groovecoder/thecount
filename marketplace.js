// -------------- MARKETPLACE QUERY STUFF -------------------------------------------

function getAppData(inAppName, inAppList) {
	console.log('getAppData ' + inAppName);

    $.ajax({
        url: 'https://marketplace.firefox.com/api/v1/apps/app/' + inAppName + '/?format=JSON',
        dataType: 'json'
    }).done(function(data) {
        inAppList.push(data);
        console.log(data);
        angular.element('[ng-controller=AppListCtrl]').scope().$digest();
    }).fail(function(data) {
        var appErrorPlaceholder = {
            id: inAppName, summary: data.responseJSON.message
        };
        inAppList.push(appErrorPlaceholder);
        console.log(appErrorPlaceholder);
    });    
}

function getManifest(inManifestURL) {
	console.log(inManifestURL);

    $.ajax({
        url: inManifestURL,
        dataType: 'json'
    }).done(function(data) {
        console.log(inManifestURL + ' ' + data.size);
        // angular.element('[ng-controller=AppListCtrl]').scope().$digest();
    }).fail(function(data) {
        console.log('getManifestFailed');
    });    
}

function searchAppData(inSearchURL, inAppList, cb) {
    $.ajax({
        url: inSearchURL,
        dataType: 'json'
    }).done(function(data) {
        $.each(data.objects, function(ix, app) { 
            inAppList.push(app);

            if (app.is_packaged) {
                console.log(inSearchURL);
                console.log(app.manifest_url);
                // getManifest(app.manifest_url);
            }
        });

        console.log('total count ' + data.meta.total_count);

        angular.element('[ng-controller=AppListCtrl]').scope().$digest();

        if (data.meta.next) {
    	    searchAppData('https://marketplace.firefox.com' + data.meta.next, inAppList, cb);
        } else {
        	cb();
        }
    }).fail(function(data) {
        var appErrorPlaceholder = {
            id: 'packaged', summary: data.responseJSON.message
        };
        inAppList.push(appErrorPlaceholder);
        console.log(appErrorPlaceholder);
    });    
}

function findPackagedAppData(inAppList, cb) {
	searchAppData('https://marketplace.firefox.com/api/v1/apps/search/?app_type=packaged&format=JSON&limit=200', inAppList, cb);
}

function findHostedAppData(inAppList, cb) {
	searchAppData('https://marketplace.firefox.com/api/v1/apps/search/?app_type=hosted&format=JSON&limit=200', inAppList, cb);
}

function findPrivilegedAppData(inAppList, cb) {
    searchAppData('https://marketplace.firefox.com/api/v1/apps/search/?app_type=privileged&format=JSON&limit=200', inAppList, cb);
}
