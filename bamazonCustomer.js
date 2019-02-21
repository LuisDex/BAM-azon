//Initializes the two node modules that will be used throughout the application
var mysql = require("mysql");
var inquirer = require("inquirer");

//Creates a divider for aesthetics
var divider = "========================================================\n";

//Initializes the SQL database connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "YOUR_USERNAME_HERE",

  // Your password
  password: "YOUR_PASSWORD_HERE",
  database: "bamazondb"
});

//Function that connects to the database and initializes the Bamazon Customer app
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    dispWelcome();
    bamazon();

})

//Function that displays a welcome message upon being called
function dispWelcome()
{
  console.log(divider);
  console.log("==================Welcome to Bamazon!===================\n");
  console.log("|    Please select the item ID from the list below     |")
  console.log("|    for any item you wish to purchase. Then select    |");
  console.log("|    the quantity you wish to purchase from our stock  |\n");
  console.log(divider);
}

//Main function of the app. Will display all the products currently in stock and allow the user to select one to purchase
function bamazon()
{
  //Connects to the database in order to obtain a list of all the products in stock
  connection.query("SELECT * FROM products", function(err,res){
      if (err) throw err;
      var stock = res;
  //Calls the display function in order to show the user all the items in stock
      dispStock(stock);
  //Prompts the user to input an item id and then a quantity they wish to purchase
      inquirer.prompt([
        {
          type: "input",
          name: "item",
          message: "Please type the ID of the item you wish to purchase: "
        },
        {
            type: "input",
            name: "amount",
            message: "How many would you like to purchase? "
        }
    ]).then(function(answer){
    
    //Once the user makes a selection the app will verify if it's a valid item id. If it isn't then the connection will end
      if(answer.item < stock.length+1 && answer.item > 0)
      {
       //If the item id selected by the user is valid then the app verifies if there are enough items in stock to fulfill the order
       //if there aren't then the connection ends
       var item_pos = parseInt(answer.item) - 1;
       var availableStock = parseInt(stock[item_pos].stock_quantity);
       if(availableStock > 0 && answer.amount <= availableStock)
       {
         //If there are enough items in stock to fulfill the order then the purchase is completed. 
         var newStock = availableStock - parseInt(answer.amount);
         var totalCost = stock[item_pos].price * answer.amount;
         //The product's current stock is updated on the corresponding table
         connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?",[newStock,answer.item], function(err){
         
        if (err) throw err;
         //The user is informed that their purchase went through and is shown the total cost of all the items.
         console.log(divider);
         console.log("Purchase has been made.");
         console.log("Your total cost was: $" + totalCost);
         console.log(divider);
         connection.end();

         })
       }else{
        console.log(divider);
        console.log("Insufficient Quantity! Please try again and select a different item\n");
        console.log(divider);
        connection.end();
       }
    }else{
        console.log(divider);
        console.log("Incorrect Item! Please try again and select another item\n");
        console.log(divider);
        connection.end();
    }
    })
  })
};

//Function that cycles through all the stock and displays it for the user
function dispStock(x)
{
    console.log("Item ID" + " || " + "Product Name"+ " || " + "Price" + " || "  + "Quantity Available");
 for(var i=0;i<x.length;i++)
 {
   console.log(x[i].item_id + " || " + x[i].product_name + " || " + "$"+ x[i].price + " || " + "Qty. "+ x[i].stock_quantity);
 };
};