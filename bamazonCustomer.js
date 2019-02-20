var mysql = require("mysql");
var inquirer = require("inquirer");
var divider = "==================================================\n";

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    dispWelcome();
    bamazon();

})

function dispWelcome()
{
  console.log(divider);
  console.log("===============Welcome to Bamazon!===============\n");
  console.log("Please select the item ID from the list below\n")
  console.log("for any item you wish to purchase. Then select\n");
  console.log("the quantity you wish to purchase from our stock\n");
  console.log(divider);
}

function bamazon()
{
  connection.query("SELECT * FROM products", function(err,res){
      if (err) throw err;
      var stock = res;
      dispStock(stock);
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
      if(answer.item < stock.length+1 && answer.item > 0)
      {
       var item_pos = parseInt(answer.item) - 1;
       var availableStock = parseInt(stock[item_pos].stock_quantity);
       if(availableStock > 0 && answer.amount <= availableStock)
       {
         var newStock = availableStock - parseInt(answer.amount);
         var totalCost = stock[item_pos].price * answer.amount;

         connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?",[newStock,answer.item], function(err){
         
        if (err) throw err;

         console.log(divider);
         console.log("Purchase has been made.");
         console.log("Your total cost was: $" + totalCost);
         console.log(divider);
         connection.end();

         })
       }else{
        console.log(divider);
        console.log("Insufficient Quantity! Please select a different item.\n");
        console.log(divider);
        bamazon();
       }
    }else{
        console.log(divider);
        console.log("Incorrect Item! Please select another item.\n");
        console.log(divider);
        bamazon();
    }
    })
  })
};

function dispStock(x)
{
    console.log("Item ID" + " || " + "Product Name"+ " || " + "Price" + " || "  + "Quantity Available");
 for(var i=0;i<x.length;i++)
 {
   console.log(x[i].item_id + " || " + x[i].product_name + " || " + "$"+ x[i].price + " || " + "Qty. "+ x[i].stock_quantity);
 };
};