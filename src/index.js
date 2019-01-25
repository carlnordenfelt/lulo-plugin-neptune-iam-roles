const aws = require('aws-sdk');
const neptune = new aws.Neptune({apiVersion: '2014-10-31'});

const pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.DBClusterIdentifier) {
        throw new Error('Missing required property DBClusterIdentifier');
    }
    if (!event.ResourceProperties.RoleArn) {
        throw new Error('Missing required property RoleArn');
    }
};

pub.create = function (event, _context, callback) {
    const params = {
        DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
        RoleArn: event.ResourceProperties.RoleArn
    };
    neptune.addRoleToDBCluster(params, callback);
};

pub.delete = function (event, _context, callback) {
    if (!event.ResourceProperties.DBClusterIdentifier || !event.ResourceProperties.RoleArn) {
        return callback();
    }

    delete_(event.ResourceProperties, callback);
};

pub.update = function (event, context, callback) {
    if (hasChanged(event)) {
        delete_(event.OldResourceProperties, function (error) {
            if (error) {
                return callback(error);
            }

            pub.create(event, context, callback);
        });
    } else {
        return callback();
    }
};

module.exports = pub;

function hasChanged(event) {
    return event.OldResourceProperties.DBClusterIdentifier !== event.ResourceProperties.DBClusterIdentifier
        || event.OldResourceProperties.RoleArn !== event.ResourceProperties.RoleArn;
}

function delete_(input, callback) {
    const params = {
        DBClusterIdentifier: input.DBClusterIdentifier,
        RoleArn: input.RoleArn
    };
    neptune.removeRoleFromDBCluster(params, function (error) {
        if (error) {
            if (error.code === 'DBClusterRoleNotFound') {
                return callback();
            }
        }

        return callback(error);
    });
}
