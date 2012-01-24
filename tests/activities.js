/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4, plusplus: true */
var activityEnv = {};

module('Activities', {
	setup: function () {
		"use strict";
		Util.init(activityEnv);
	}
});


//PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/profile/<profile object key>
asyncTest('Profile ', function () {
	"use strict";
	activityEnv.util.putGetDeleteStateTest(activityEnv, '/activities/profile?activityId=<activity ID>')
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition ', function () {
	"use strict";
	var url = '/activities?activityId=<activity ID>',
		env = activityEnv;

	env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
		var activity = env.util.tryJSONParse(xhr.responseText);
		equal(activity.id, env.util.activity.id, 'activity id');
		start();
	});
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition, update', function () {
	"use strict";
    var env = activityEnv;

    var myActivityId = env.util.ruuid();
    var myActivity = { "id":myActivityId, "definition":{"name":"My Tezzzt Activity"} };
    var myActivityUpdate = { "id":myActivityId, "definition":{"name":"My Test Activity"} };
    var myStatement = { "verb":"imported", "object":myActivity };
    var myStatementUpdate = { "verb":"imported", "object":myActivityUpdate };

    //Import the activity
    env.util.request('POST','/statements',JSON.stringify([myStatement]), true, 200, 'OK', function(){

        //Find the activity
	    var url = '/activities?activityId=' + myActivityId;
	    env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
            //Check result
		    var activity = env.util.tryJSONParse(xhr.responseText);
		    equal(activity.id, myActivity.id, 'activity id');
            equal(activity.definition.name, myActivity.definition.name);

            //Update the definition
            env.util.request('POST','/statements',JSON.stringify([myStatementUpdate]), true, 200, 'OK', function() {

                //Find again
	            env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
                    //Check result
		            var activity = env.util.tryJSONParse(xhr.responseText);
		            equal(activity.id, myActivityUpdate.id, 'activity id');
                    equal(activity.definition.name, myActivityUpdate.definition.name);

                    //Fire off next test
	    	        start();
                });
            });
	    });
    })
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition, extensions', function () {
	"use strict";
	var env = activityEnv;

    var myActivityId = env.util.ruuid();
    var myActivity = { 
        id:myActivityId, 
        definition:{
            description:"Extensions Activity", 
            extensions:{
                extension_1:1,
                extension_2:{
                    obj:"test"} 
            }
        }
    };

    var myStatements = [{ verb: "imported", object: myActivity }];

    //Import activity through statement
    env.util.request('POST','/statements',JSON.stringify(myStatements), true, 200, 'OK', function(){
        //Get it
	    env.util.request('GET', "/activities?activityId=" + myActivityId, null, true, 200, 'OK', function (xhr) {
	    	var activity = env.util.tryJSONParse(xhr.responseText);
            //Is is the same as we sent?
            if(myActivity.objectType === undefined){
                delete activity.objectType;
            }
	    	deepEqual(activity, myActivity, 'persisted activity');
	    	start();
	    });
    });
});


//GET http://example.com/TCAPI/activities/<activity ID>/profile[?since=<timestamp>]
asyncTest('Profile, multiple', function () {
	"use strict";
	activityEnv.util.getMultipleTest(activityEnv, '/activities/profile?activityId=<activity ID>','profileId');
});

asyncTest('Profile, Concurrency Rules', function(){
    "use strict";
    var env = activityEnv;
    var url = "/activities/profile?activityId=<activity ID>&profileId=" + env.util.ruuid();
    env.util.concurrencyRulesTest(env, url, true);
});


function activitiesAreEqual(activity1, activity2){
    if (activity1 == null && activity2 == null)
        return true;
    if (activity1 == null || activity2 == null)
        return false;

    return (activity1.id == activity2.id
               && activity1.revision == activity2.revision
               && activity1.platform == activity2.platform
               && activityDefinitionsAreEqual(activity1.definition, activity2.definition));
}

function activityDefinitionsAreEqual(def1, def2){
    return true;
    if(def1 == null && def2 == null)
        return true;
    if(def1 == null || def2 == null)
        return false;

    return def1.description == def2.description; //TODO: More to check for equality here...*/
}

