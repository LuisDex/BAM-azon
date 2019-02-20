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
    manager();

})

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
         case "Exit":
         connection.end();
         break
       }
    })
  })
}

function dispWelcome()
{
  console.log(divider);
  console.log("=======Welcome to the Bamazon Manager Menu=======\n");
  console.log("Please select one of the options from the menu below\n")
  console.log("in order to update and manage the items in stock\n");
  console.log(divider);
}

function dispStock(x)
{
    console.log("Item ID" + " || " + "Product Name"+ " || " + "Price" + " || "  + "Quantity Available");
 for(var i=0;i<x.length;i++)
 {
   console.log(x[i].item_id + " || " + x[i].product_name + " || " + "$"+ x[i].price + " || " + "Qty. "+ x[i].stock_quantity);
 };
};

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

function addInventory(x)
{
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
     if(parseInt(answer.moreItems) < x.length+1 && parseInt(answer.moreItems) > 0)
     {
       var updatedStock = x[answer.moreItems-1].stock_quantity + parseInt(answer.amount);
       connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?",[updatedStock,answer.moreItems], function(err) {
         if (err) throw err;
         console.log("Inventory has been updated.");
         connection.end();
        })
     }else
     {
      console.log("That item is not in stock. Please select another item.");
      addInventory(x);
     }
  })
};

function addProduct()
{
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
     var addItem = {product_name:answers.name, department_name:answers.department, price:parseFloat(answers.price), stock_quantity:parseInt(answers.stock)};
     connection.query("INSERT INTO products SET ?",addItem,function(err){
         if (err) throw err;
         console.log("Item has been added to the store inventory.")
         connection.end();
     })
  });
};