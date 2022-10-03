import Order from "../../../models/Order";
import dbConnect from "../../../util/mongo";

const handler = async (req, res) => {
  const {
    method,
    query: { id },
    cookies,
  } = req;
  const token = cookies.token;

  dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(id);

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
