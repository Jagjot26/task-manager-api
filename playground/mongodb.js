//CRUD

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Can't connect to the database");
    }

    const db = client.db(databaseName);

    //INSERT ONE
    // db.collection("users").insertOne(
    //   {
    //     _id: id,
    //     name: "Vikram",
    //     age: 30,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to add the document");
    //     }

    //     console.log(result.ops);
    //   }
    // );

    //INSERT MANY
    // db.collection("users").insertMany(
    //   [
    //     { name: "Jen", age: 28 },
    //     { name: "Gunther", age: 27 },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert documents");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     { description: "Go shopping", completed: true },
    //     {
    //       description: "Go camping",
    //       completed: false,
    //     },
    //     { description: "Buy medicines", completed: true },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert the documents");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    //FIND OPERATIONS
    // db.collection("users").findOne({ age: 21 }, (error, user) => {
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log(user);
    // });

    // db.collection("tasks")
    //   .find({ completed: false })
    //   .toArray((error, tasks) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log(tasks);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5ef96937529d761de58979dc") },
    //   (error, task) => {
    //     console.log(task);
    //   }
    // );

    //UPDATE OPERATIONS
    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("5ef965c6117e1b1d6921f53a"),
    //     },
    //     {
    //       $set: {
    //         name: "Jimmy",
    //         age: 25,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // db.collection("tasks")
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    db.collection("tasks")
      .deleteOne({ description: "Buy medicines" })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
