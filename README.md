# BAM-azon Customer App and Manager App

The following is a brief description of the functionality of the BAM-azon app, for bot the Customer side and the Management side. For a visual demo of the functionality of each app, please follow this [link](https://youtu.be/6D4rfOqQPVc).

**Note** - I have provided a schema file for those who wish to try the application. It contains all the code needed to create a small database in MySQL and populate a table called "products" with 10 different items.

### Bamazon Customer App

The **bamazonCustomer.js** app allows the user to connect to a "store database" for the fictional company **Bamazon** and browse its contents in order to purchase some items from it. 

Upon loading up the app, it displays a current list of all the items in stock and gives the user an opportunity to purchase any item currently on the list. Once the item's **id** is selected, the user inputs how many of the item they would like to purchase and then the user is shown the total cost of their transaction.

The user's input is verified and it will only process the purchase if the input is valid. If the user requests an amount higher than the current stock quantity of the item, the transaction doesn't go through either. 

The entirety of the app is divided into 3 main functions:

1. The **bamazon()** function - The main function of the app, it calls on the other two functions in order to display the store front to the user and prompt them to make a selection. Upon making a selection, the function will verify the selection to make sure it is a valid Item ID. If it isn't the connection will end, if it is then the function will verify if there are enough items in stock to fulfill the order. If there are not enough items, the function will end the connection. But if there are enough items, the function will remove the items from the database and then show the user how much the total cost of the items were.

2. The **dispWelcome()** function - Displays a Welcome Message for the user whenever they load up the app.

3. The **dispStock()** function - Cycles through the currently stocked items in the *products* table of the database and displays its Item ID, item name, item price and item quantity.

### Bamazon Manager App

The **bamazonManager.js** app allows a user to take on the role of a store manager and perform different tasks on the items currently stocked within the database.

Upon loading the app, the user is given a list of actions they can perform. Each of these represents one of the main functions of the app, on top of that the app gives the user the option to leave the app if they would like.

The main functions of this app are as follows:

1.The **manager()** function - This is the main function of the app. It will display a list of possible options to the user, upon selecting one of the options the function will call up the appropriate response through a **switch** by verifying the user's choice with the various possible **cases**.

2.The **dispStock()** function - Cycles through the currently stocked items in the *products* table of the database and displays its Item ID, item name, item price and item quantity.

3.The **dispWelcome()** function - This function will display a Welcome Message to the user whenever the app is loaded.

4.The **lowStock()** function - This function will cycle through all the available items in stock but only display those whose quantity is lower than 5.

5.The **addInventory()** function - This function will show the manager a list of every available item in the store and allow them to select one and increase it's stocks. The function will prompt the manager for the item id and quantity they wish to add, then it will take that item's current stock and add the additional items to it. Before that though it will verify that the item id selected by the user is correct, otherwise it cycles back to the beginning of the function.

6. The **addProduct()** function - This function allows the manager to add an entirely new product to the available stock by answering a series of prompts that will ask for the following: product name, department, price, quantity. Once that information is gathered, the item is then added into the *products* table of the store database.
