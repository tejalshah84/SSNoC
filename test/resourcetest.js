var expect = require('expect.js');
var express = require('express');
var request = require('supertest');
var indexRoutes = require('.././controllers/index.js');
var Resource = require('../public/js/resource.js');


var app = express();

suite('Resource Page Testing', function(){

  test('Create Frame', function(done){
        var frame = new Frame(2,4);
        expect(2).to.eql(frame.firstThrow());
        expect(4).to.eql(frame.secondThrow());
        done();
  });
