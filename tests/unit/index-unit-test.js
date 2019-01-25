const expect  = require('chai').expect;
const mockery = require('mockery');
const sinon   = require('sinon');

describe('Index unit tests', function () {
    let subject;
    let event;
    const removeRoleFromDBClusterStub = sinon.stub();
    const addRoleToDBClusterStub      = sinon.stub();


    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        const awsSdkStub = {
            Neptune: function () {
                this.addRoleToDBCluster      = addRoleToDBClusterStub;
                this.removeRoleFromDBCluster = removeRoleFromDBClusterStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        removeRoleFromDBClusterStub.reset();
        removeRoleFromDBClusterStub.yields();
        addRoleToDBClusterStub.reset();
        addRoleToDBClusterStub.yields();

        event = {
            ResourceProperties: {
                DBClusterIdentifier: 'DBClusterIdentifier',
                RoleArn: 'RoleArn'
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if stack name is not set', function (done) {
            delete event.ResourceProperties.DBClusterIdentifier;

            function fn() {
                subject.validate(event);
            }

            expect(fn).to.throw(/Missing required property DBClusterIdentifier/);
            done();
        });
        it('should fail if stack name is not set', function (done) {
            delete event.ResourceProperties.RoleArn;

            function fn() {
                subject.validate(event);
            }

            expect(fn).to.throw(/Missing required property RoleArn/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.calledOnce).to.equal(true);
                expect(removeRoleFromDBClusterStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to describeStacks error', function (done) {
            addRoleToDBClusterStub.yields('addRoleToDBClusterStub');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('addRoleToDBClusterStub');
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.calledOnce).to.equal(true);
                expect(removeRoleFromDBClusterStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('update', function () {
        beforeEach(function () {
            event.OldResourceProperties = {
                DBClusterIdentifier: 'OldDBClusterIdentifier',
                RoleArn: 'OldRoleArn'
            };
        });
        it('should succeed', function (done) {
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.calledOnce).to.equal(true);
                expect(removeRoleFromDBClusterStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should do nothing', function (done) {
            event.OldResourceProperties = event.ResourceProperties;
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.called).to.equal(false);
                done();
            });
        });
        it('should fail on delete error nothing', function (done) {
            removeRoleFromDBClusterStub.yields('removeRoleFromDBClusterStub');
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal('removeRoleFromDBClusterStub');
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to removeRoleFromDBClusterStub error', function (done) {
            removeRoleFromDBClusterStub.yields('removeRoleFromDBClusterStub');
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal('removeRoleFromDBClusterStub');
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should not delete due to missing property DBClusterIdentifier', function (done) {
            delete event.ResourceProperties.DBClusterIdentifier;
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.called).to.equal(false);
                done();
            });
        });
        it('should not delete due to missing property RoleArn', function (done) {
            delete event.ResourceProperties.RoleArn;
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(addRoleToDBClusterStub.called).to.equal(false);
                expect(removeRoleFromDBClusterStub.called).to.equal(false);
                done();
            });
        });
    });
});
