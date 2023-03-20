const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
console.log(process.env.MONGO_URI);

// Connect to data base
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("Connected To MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err.message));

// Schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: [{ type: String }],
});

// Create the person model
const Person = mongoose.model("Person", personSchema);

// Create a new person
const person = new Person({
  name: "John",
  age: 30,
  favoriteFoods: ["Pizza", "Pasta", "bakery"],
});
person
  .save()
  .then(() => console.log("Person saved to database"))
  .catch((error) => console.error("Error saving person to database", error));

// Create records
const arrayOfPeople = [
  { name: "Alice", age: 30, favoriteFoods: ["Sushi", "Tacos"] },
  { name: "Bob", age: 35, favoriteFoods: ["Burgers", "Fries"] },
  { name: "Charlie", age: 40, favoriteFoods: ["Pizza", "Pasta"] },
];

Person.create(arrayOfPeople)
  .then((savedPeople) => {
    console.log("People saved successfully!");
  })
  .catch((error) => {
    console.error(error);
  });

// Search in db
Person.find({ name: "Bob" })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });

//Search one person which has a certain food in the person's favorites

Person.findOne({ favoriteFoods: 0 })
  .then((person) => {
    console.log(person);
  })
  .catch((err) => {
    console.error(err);
  });

//Find by Id

Person.findById("6416173a247b164aa840b0a7")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });

//Perform Classic Updates by Running Find, Edit, then Save

const doc = await Person.findById("6416173a247b164aa840b0a7");
console.log(doc);

person.favoriteFoods.push("hamburger");

person.save(function (err, updatedPerson) {
  if (err) return console.error(err);

  console.log("Updated Person:", updatedPerson);
});

//Perform New Updates on a Document Using model.findOneAndUpdate()
Person.findOneAndUpdate(
  { firstName: "Alice" },
  { age: 20 },
  { new: true },
  function (err, updatedPerson) {
    if (err) {
      console.log("Error updating person:", err);
    } else {
      console.log("Updated person:", updatedPerson);
    }
  }
);

// Delete One Document Using model.findByIdAndRemove

const personId = mongoose.Types.ObjectId("6416173a247b164aa840b0a7");

Person.findByIdAndRemove(personId, function (err, deletedPerson) {
  if (err) {
    console.log("Error while deleting person:", err);
  } else {
    console.log("Deleted person:", deletedPerson);
  }
});

//Delete Many Documents with model.remove()
Person.deleteMany({ firstName: "Alice" }, function (err, result) {
  if (err) {
    console.log("Error while deleting people:", err);
  } else {
    console.log("Number of people deleted:", result.deletedCount);
  }
});

//Chain Search Query Helpers to Narrow Search Results

Person.find({ favoriteFoods: "Pizza" })
  .sort("firstName")
  .limit(2)
  .select("-age")
  .exec(function (err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("People who like Pizza:", data);
    }
  });
