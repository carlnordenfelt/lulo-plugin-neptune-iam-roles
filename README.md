# lulo neptune iam roles

[![npm version](https://badge.fury.io/js/lulo-plugin-neptune-iam-roles.svg)](https://badge.fury.io/js/lulo-plugin-neptune-iam-roles)
[![Build Status](https://travis-ci.org/carlnordenfelt/lulo-plugin-neptune-iam-roles.svg?branch=master)](https://travis-ci.org/carlnordenfelt/lulo-plugin-neptune-iam-roles)
[![Coverage Status](https://coveralls.io/repos/github/carlnordenfelt/lulo-plugin-neptune-iam-roles/badge.svg?branch=master)](https://coveralls.io/github/carlnordenfelt/lulo-plugin-neptune-iam-roles?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-neptune-iam-roles/badge.svg?targetFile=package.json)](https://snyk.io/test/github/carlnordenfelt/lulo-plugin-neptune-iam-roles?targetFile=package.json)

lulo neptune iam roles is a plugin for lulo.
The plugin associates an IAM ROle with a Neptune cluster which is useful when you want to use the Loader API for example.

# Installation
```
$ npm install lulo-plugin-neptune-iam-roles --save
```

##Usage
### Properties
* `DBClusterIdentifier`: The Neptune Cluster Identifier. Required
* `RoleArn`: The IAM Role arn. Required

### Return Values
N/A

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "rds:AddRoleToDBCluster",
       "rds:RemoveRoleFromDBCluster"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
