const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// middleware to parse JSON data
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  //res.json({ msg: "hello from middleware 1" });
  next();
});

app.use((req, res, next) => {
  console.log("hello from middleware 2");
  //res.end("hey");
  next();
});

// define the routes here

// app.get("/api/users", (req, res) => {
//   console.log("Requested URL:", req.url);
//   console.log("Method:", req.method);
//   console.log("Route params:", req.params);
//   console.log("Query params:", req.query);
//   console.log("Headers:", req.headers);
//   return res.json(users);
// });

app.get("/users", (req, res) => {
  const html = `<ul>
  ${users
    .map((user) => {
      return `<li>${user.first_name}</li>`;
    })
    .join("")} 
  </ul>`;
  res.send(html);
});

app
  .route("/api/users")
  .get((req, res) => {
    console.log("Requested URL:", req.url);
    console.log("Method:", req.method);
    console.log("Route params:", req.params);
    console.log("Query params:", req.query);
    console.log("Headers:", req.headers);
    return res.json(users);
  })
  .post((req, res) => {
    const body = req.body;
    console.log(body);
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", id: users.length });
    });
  });

app
  .route("/api/users/:id")
  .get((req, res) => {
    //console.log(req);
    const id = Number(req.params.id);
    console.log(id);
    const user = users.find((user) => {
      return user.id === id;
    });
    return res.json(user);
  })
  .put((req, res) => {})
  .delete((req, res) => {});

// app.get("/api/users/:id", (req, res) => {
//   //console.log(req);
//   const id = Number(req.params.id);
//   console.log(id);
//   const user = users.find((user) => {
//     return user.id === id;
//   });
//   return res.json(user);
// });

// app.post("/api/users", (req, res) => {
//   // create new user
//   return res.json({ status: "pending" });
// });

// to start the server on port use listen method
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
