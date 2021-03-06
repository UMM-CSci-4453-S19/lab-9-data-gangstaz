# Lab 9

Your Lab 9 repository should include all you relevant files (and folders) from Lab 8.  In other words I should be able to clone the repository, run your server, and test your results without any extra steps other than copying in `credentials.json`. You could accomplish this by forking your Lab 8 repo or using [these nifty techniques](https://help.github.com/en/articles/duplicating-a-repository) to duplicate your Lab 8 repository (either the first or third option on that page would work for you). 

Be certain that the user `mcphee@146.57.33.%` has the appropriate privileges to execute all of the SQL commands used by your code.

Now it is it time to finish off this register project.  As you implement the functionality below, remember that your primary mode of interaction is through your REST interface.

* Add a login/logout function.  If no user is logged in, then no till buttons should be useable (you can make them invisible, or just not operational.)  Use whatever technique you would like.  Be sure to document this in your manual (discussed at the end of this lab.)
* Think about what it would take to write a procedure (or trigger) that would identify DEALS in the current `till_items` and update your table to reflect the new pricing.  Talk it over with your partners until you are convinced that you understand what needs to be done... then relax and congratulate yourselves on a job well done.
*  Modify your click API entry so the time stamp of a button is also recorded.
* Add REST handlers to deal with SALE and VOID.  You can decide whether or not to use `till_buttons` or hard-code the buttons into your angular template.  Produce your logic and button accordingly:

   * Add a **void** button that will erase all the curent contents in the register, 
   * Add a **sale** button.  (more on this below)

* Clicking on **sale** should implement special functionality that copies the till_items to a special archive (you will have to make an archive table).  The archive table should have a new field called transactionID and user.  (This is breaking some of the rules of normalization... be prepared to tell me in person what the poetential problems are and the proper way to fix them).  You can achieve this functionality however you like as long as it occurs on the DBF server.  Both procedures and triggers are viable options.  Be sure that your *sale* functionality adds an entry in the archive denoting the clicking of the sale button.
* Clicking on **void** does not have to add an entry in the archive (although you can do so if you like as long as such entries can be clearly identfied as voided transactions)
* Create a a view called `transactionSummary` that summarizes the transactions in the archive table.  It should show:

```
|field        | Description                                         |
|-------------|-----------------------------------------------------|
|transactionID| The transaction ID on which you will be grouping    |
|startTime    | earliest time stamp of a button in that transaction |
|stopTime     | latest time stamp of a button in that transaction   |
|duration     | difference in seconds of stopTime and startTime     |
|user         | user's name                                         |
|total        | total amount in sale                                |
```

* EITHER
   * Add a TICKETIZE option to your API that calls a suitably modified `ticketize` function (on the DBF side) to generate a JSON object that would, presumably, be used by a function to print out the receipt
   * Add javascript to your HTML template that pops up a suitable "receipt"
* Finally, you should expand your API document into a complete user manual (preferably with a few screen shots).  Make the API details into an appendix at the end.  (Don't go crazy on this step... but don't just gloss over it either...)

# API Documentation

**Get Buttons**
---
  Returns JSON object with current buttons that are found in the table till_buttons
* **URL**

  /buttons

* **Method:**

  `GET`

* **Sample Call:**

  ```javascript
    getButtons: function(apiUrl){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    }
  ```
  
**Void**
---
  Voids the current transaction and removes all items from the list
* **URL**

  /void

* **Method:**

  `GET`

* **Sample Call:**
  ```javascript
    voidButton: function(apiUrl){
      var url = apiUrl + '/void';
      return $http.get(url);
    }
  ```
  
 **Sale**
---
  Marks the current transaction as a completed sale. Removes items from the client side list, clears the current tranasction table ("currTrans" in the database) and also enters the finished transaction into the transArchive table.
  
* **URL**

  /sale

* **Method:**

  `GET`

* **Sample Call:**
  ```javascript
    saleButton: function(apiUrl){
      var url = apiUrl + '/sale';
      return $http.get(url);
    }
  ```

  
**Delete**
----

* **URL**

  /delete?id=<itemId>

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Sample Call:**
  ```javascript
    delButton: function(id) {
        var url = apiUrl + '/delete?id='+ id;
        return $http.get(url);
    }
  ```
  
**Click**
---
  Adds the item that was clicked on to the transaction
  * **URL**

    /click?id=<itemId>

  * **Method:**

    `GET`
    
  * **URL Params**
  
    **Required:**
    
    `id=[integer]`

  * **Sample Call:**
    ```javascript
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      return $http.get(url); // Easy enough to do this way
    }
    ```
  
# Screenshots

Screen upon login. Can type in whatever. 

![Login Screen](/screenshots/login.png)
----
Recognizes username. Has buttons to add items to register. Has empty register. 
Logout button logs the user out. 

![Screen upon login](/screenshots/uponLogin.png)
----
Result of clicking on the "apple" button. It is added to the list, and the running total is added to.

![Click on item](/screenshots/clickOnItem.png)
----
Clicking the red X from any of the entries would remove the item from the list and decrease the running total. Clicking "VOID" deletes all entries. 

![Delete item](/screenshots/deleteItem.png)
----
Popup that summarizes the transaction from the list once "SALE" has been clicked.

![Sale](/screenshots/sale.png)


