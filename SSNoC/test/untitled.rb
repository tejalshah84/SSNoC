suite('User Testing', function(){
  describe('user routes', function() {
    describe('index', function() {
      it('returns hello world', function() {
        userRoutes['/'].fn({}, {
          json: function(data) {
            expect(data).to.eql({ foo: 'hello world' });
          }
        });
      });
    });
  });
});