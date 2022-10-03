import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Admin.module.css";

const AdminPage = ({ products, orders }) => {
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const status = ["Preparing", "On the way", "Delivered"];

  const handleDelete = async (id) => {
    try {
      await axios.delete("https://pizzapp-nu.vercel.app/api/products/" + id);

      setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (id) => {
    const order = orderList.filter((order) => order._id === id)[0];
    const currentStatus = order.status;

    try {
      const res = await axios.put(
        "https://pizzapp-nu.vercel.app/api/orders/" + id,
        {
          status: currentStatus + 1,
        }
      );
      setOrderList([
        res.data,
        ...orderList.filter((order) => order._id !== id),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Admin</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/img/pizza-icon.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.item}>
          <h1 className={styles.title}>Products</h1>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Image</th>
                <th>Id</th>
                <th>Title</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </tbody>
            <tbody>
              {pizzaList.map((pizza) => (
                <tr className={styles.trTitle} key={pizza._id}>
                  <td>
                    <Image
                      src={pizza.img}
                      width={50}
                      height={50}
                      objectFit="cover"
                      alt=""
                    />
                  </td>
                  <td>{`${pizza._id}`.slice(0, 6)}...</td>
                  <td>{pizza.title}</td>
                  <td>${pizza.prices[0]}</td>
                  <td>
                    <button className={styles.button}>Edit</button>
                    <button
                      className={styles.button}
                      onClick={() => handleDelete(pizza._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.item}>
          <h1 className={styles.title}>Orders</h1>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Id</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </tbody>
            <tbody>
              {orderList.map((order) => (
                <tr className={styles.trTitle} key={order._id}>
                  <td>{`${order._id}`.slice(0, 6)}...</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>{order.method === 0 ? "Cash" : "Paid"}</td>
                  <td>{status[order.status]}</td>
                  <td>
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStatus(order._id)}
                    >
                      Next Stage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPage;

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";

  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const productRes = await axios.get(
    "https://pizzapp-nu.vercel.app/api/products"
  );
  const orderRes = await axios.get("https://pizzapp-nu.vercel.app/api/orders");

  return {
    props: {
      products: productRes.data,
      orders: orderRes.data,
    },
  };
};
