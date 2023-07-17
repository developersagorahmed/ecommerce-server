const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7is7xhq.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const ProductsConnection = client.db("EComDB").collection("products");
		const buyProductsConnection = client.db("EComDB").collection("buyProducts");

		app.get("/products", async (req, res) => {
			const result = await ProductsConnection.find().toArray();
			res.send(result);
		});
		app.get("/admin/home/admin/dashboard", async (req, res) => {
			const result = await ProductsConnection.find().toArray();
			res.send(result);
		});

		app.get("/buyProducts", async (req, res) => {
			const result = await buyProductsConnection.find().toArray();
			res.send(result);
		});

		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;

			const query = { _id: new ObjectId(id) };
			const result = await ProductsConnection.findOne(query);
			res.send(result);
		});

		app.post("/addtodatabase", async (req, res) => {
			const body = req.body;
			const result = await buyProductsConnection.insertOne(body);
			res.send(result);
		});
		app.post("/addAProduct", async (req, res) => {
			const body = req.body;
			const result = await ProductsConnection.insertOne(body);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("ECommerce server is running");
});

app.listen(port, () => {
	console.log(`ECommerce is running on port ${port}`);
});
