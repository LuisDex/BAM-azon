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

//Function that connects to the database and initializes the Bamazon Manager app
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    dispWelcome();
    manager();

})

//Main function that offers the manager several options and functions that can be performed
function manager()
{
 connection.query("SELECT * FROM products", function(err,res)
  {
    if (err) throw err;
    var stock = res;
    inquirer.prompt([
        {
          type: "list",
          name: "decision",
          message: "What would you like to do today?",
          choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"]
        }
    ]).then(function(reply){
      //Based on the user's decision, the function will cycle through the switch statement and call the appropriate function
       switch(reply.decision)
       {
         case "View Products for Sale":
         console.log(divider);
         console.log("==================Items in stock==================\n")
         dispStock(stock);
         connection.end();
         break;
         case "View Low Inventory":
         lowStock(stock);
         connection.end();
         break;
         case "Add to Inventory":
         console.log(divider);
         console.log("==================Items in stock==================\n")
         dispStock(stock);
         addInventory(stock);
         break;
         case "Add New Product":
         addProduct();
         break;
        //However if the user wishes to exit then the connection will be terminated
         case "Exit":
         connection.end();
         break
       }
    })
  })
}

//Function that displays a welcome message upon being called
function dispWelcome()
{
  console.log(divider);
  console.log("==========Welcome to the Bamazon Manager Menu===========\n");
  console.log("| Please select one of the options from the menu below |\n")
  console.log("| in order to update and manage the items in stock     |\n");
  console.log(divider);
}

//Function that cycles through all the stock and displays it for the user
function dispStock(x)
{
    console.log("Item ID" + " || " + "Product Name"+ " || " + "Price" + " || "  + "Quantity Available");
 for(var i=0;i<x.length;i++)
 {
   console.log(x[i].item_id + " || " + x[i].product_name + " || " + "$"+ x[i].price + " || " + "Qty. "+ x[i].stock_quantity);
 };
};

//Function that cycles through the available stock for each product and returns the items that have less than 5 available in stock
function lowStock(x)
{
  console.log("==============Items Low on Inventory==============")
  console.log("Item ID" + " || " + "Product Name"+ " || " + "Price" + " || "  + "Quantity Available");
  for(var i=0;i<x.length;i++)
  {
    if(x[i].stock_quantity < 5)
   {
    console.log(x[i].item_id + " || " + x[i].product_name + " || " + "$"+ x[i].price + " || " + "Qty. "+ x[i].stock_quantity);
   };
  };
};

//Function that allows the manager to add more inventory to a specific item.
function addInventory(x)
{
  //Prompts manager to input which item they want to restock and to specify how many items will be added to it
  inquirer.prompt([
    {
        type: "input",
        name: "moreItems",
        message: "Which item would you like to restock?"
    },
    {
        type:"input",
        name:"amount",
        message: "How many items would you like to add to the stock?"
    }
  ]).then(function(answer){
    //Verifies if the selected item is valid and if the amount being added is more than 0.
     if(parseInt(answer.moreItems) < x.length+1 && parseInt(answer.moreItems) > 0)
     {
       //If the selection is valid the function adds the current stock to the new stock and then updates that item's "stock_quantity" in the table.
       var updatedStock = x[answer.moreItems-1].stock_quantity + parseInt(answer.amount);
       connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?",[updatedStock,answer.moreItems], function(err) {
         if (err) throw err;
         console.log("Inventory has been updated.");
         connection.end();
        })
     }else
     {
      //If the option isn't valid then the user is asked to select a new item
      console.log("That item is not in stock. Please select another item.");
      addInventory(x);
     }
  })
};

//Function that adds a whole new item to the products table in the database
function addProduct()
{
  //Asks the user for the new product information that is required by the database
  inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "What is the name of the item you're adding?"
      },
      {
        type: "input",
        name: "department",
        message: "Which Department does it belong to?"
      },
      {
        type: "input",
        name: "price",
        message: "How much does each item cost? (Format: 0.00)"
      },
      {
        type: "input",
        name: "stock",
        message: "How many are you adding to the inventory?"
      },
  ]).then(function(answers){

    //Once all the questions are answered, the function will insert the new item directly into the table of products
     var addItem = {product_name:answers.name, department_name:answers.department, price:parseFloat(answers.price), stock_quantity:parseInt(answers.stock)};
     connection.query("INSERT INTO products SET ?",addItem,function(err){
         if (err) throw err;
         console.log("Item has been added to the store inventory.")
         connection.end();
     })
  });
};