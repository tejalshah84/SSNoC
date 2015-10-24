var express = require('express');
var expect = require('expect.js');
var indexRoutes = require('.././routes/index.js');

var url = 'http://localhost:8888';


suite('Index Testing', function(){
  test('Index Route', function(done){
	describe('index page', function() {
    it("renders successfully", function(done) {
        request(url).get('/').expect(200, done);    
      })
  });
});
  
});

