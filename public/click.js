angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
   $scope.buttons=[]; //Initially all was still
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;
   $scope.deleteClick=deleteClick;
   $scope.voidClick=voidClick;
   $scope.saleClick=saleClick;
   $scope.sum = 0;
   $scope.idCounter = 0;
   $scope.loggedIn = false;
   $scope.startTime;

   $scope.transactions = [];

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }
  function buttonClick($event){
     $scope.errorMessage='';
     buttonApi.clickButton($event.target.id)
        .success(function(item){
            $scope.idCounter ++;
            console.log(item);
            $scope.sum += item[0][0].price;
            item[0][0].transId = $scope.idCounter;
            $scope.transactions.push(item[0][0]);
        })
        .error(function(){$scope.errorMessage="Unable click";});
  }





  ///// NOTE... trunate table on new sale, but if current transaction crashes... that way we can pick up where we left off
    /// on the failed transcation.
    
  function deleteClick(item, index) {
      buttonApi.delButton(item.transId)
          .success(function(err) {
              // update the running total
              $scope.sum -= item.price;
              // remove the item from the transaction array
              $scope.transactions.splice(index, 1);
          })
          .error(function(){$scope.errorMessage="Unable to delete";});
  }

  function voidClick() {
      console.log($scope.transactions);
      buttonApi.voidButton()
          .success(function(err) {
              $scope.transactions =[];
              $scope.sum = 0;
              $scope.idCounter = 0;
              console.log($scope.userName);
          })
          .error(function(){$scope.errorMessage="Void failed"});
  }

  function saleClick() {

      // This section outlines how the receipt is created.

      var receiptString  = "";
      var total = 0;
      receiptString += ( new Date().toLocaleString() ) + "\n";
      receiptString += "RECEIPT... THANK YOU FOR SHOPPING! \n";
      receiptString += "YOUR CASHIER TODAY WAS " + $scope.userName + "." + "\n";
      $scope.transactions.forEach( function(element) {
          receiptString += element.item + " " + "$" + element.price;
          receiptString += "\n";
          total += element.price;
          })
      receiptString += "---------------------------" + "\n";
      receiptString += "Total: " + "$" + total;

      alert(receiptString);

      // end of receipt creation

      buttonApi.saleButton($scope.userName)
          .success(function(err) {
              $scope.transactions =[];
              $scope.sum = 0;
              $scope.idCounter = 0;
          })
          .error(function(){$scope.errorMessage="Sale failed"});
  }

  refreshButtons();  //make sure the buttons are loaded
}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    delButton: function(id) {
        var url = apiUrl + '/delete?id='+ id;
        return $http.get(url);
    },
    voidButton: function() {
        var url = apiUrl + '/void';
        return $http.get(url);
    },
    saleButton: function(userName) {
        var url = apiUrl + '/sale?userName='+userName;
        return $http.get(url);
    }
 };
}

