app.directive('notification', function($timeout){
  return {
     restrict: 'E',
     replace: true,
     template: '<div class="alert"><button  type="button" class="close" data-dismiss="alert"> &times;</button><strong> Message! </strong> {{message}}</div>',
     link: function(scope, element, attrs){
         $timeout(function(){
             element.hide();
         }, 5000);
     }
  }
});

