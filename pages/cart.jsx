import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import OrderModal from "../components/OrderModal";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const router = useRouter();

  // This values are the props in the UI
  const amount = cart.total;
  const currency = "USD";
  const style = { layout: "vertical" };

  const createOrder = async (data) => {
    try {
      const res = await axios.post(
        "https://pizzapp-nu.vercel.app/api/orders",
        data
      );

      res.status == 201 && router.push(`/orders/${res.data._id}`);
      dispatch(reset());
    } catch (error) {
      console.log(error);
    }
  };

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Cart - Pizza Restaurant</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/img/pizza-icon.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.left}>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Product</th>
                <th>Name</th>
                <th>Extras</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </tbody>

            <tbody>
              {cart.products.map((pizza) => (
                <tr className={styles.tr} key={pizza._id}>
                  <td>
                    <div className={styles.imgContainer}>
                      <Image
                        src={pizza.img}
                        layout="fill"
                        objectFit="cover"
                        alt=""
                      />
                    </div>
                  </td>
                  <td>
                    <span className={styles.name}>{pizza.title}</span>
                  </td>
                  <td>
                    <span className={styles.extras}>
                      {pizza.extraOptions.length !== 0 ? (
                        <>
                          {pizza.extraOptions.map((option) => (
                            <span key={option._id}>{option.text}, </span>
                          ))}
                        </>
                      ) : (
                        <span>No Extras</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={styles.price}>{pizza.price}</span>
                  </td>
                  <td>
                    <span className={styles.quantity}>{pizza.quantity}</span>
                  </td>
                  <td>
                    <span className={styles.total}>
                      {pizza.price * pizza.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.right}>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>CART TOTAL</h2>
            <div className={styles.totalText}>
              <b className={styles.totalTextTitle}>Subtotal:</b>
              {cart.total}
            </div>
            <div className={styles.totalText}>
              <b className={styles.totalTextTitle}>Discount:</b>$0.00
            </div>
            <div className={styles.totalText}>
              <b className={styles.totalTextTitle}>Total:</b>
              {cart.total}
            </div>

            {!open ? (
              <button className={styles.button} onClick={() => setOpen(true)}>
                CHECKOUT NOW!
              </button>
            ) : (
              <div className={styles.paymentMethods}>
                <button
                  className={styles.payButton}
                  onClick={() => setCash(true)}
                >
                  CASH ON DELIVERY
                </button>
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "AfyrgChkpqp1_TmH0FmB2qJ5nshedCrc9kvc_jY40MzFoPm1EHMD_fsZ8oJehchlUggUM5-qZiwOQUT9",
                    components: "buttons",
                    currency: "USD",
                    "disable-funding": "credit,card,p24",
                  }}
                >
                  <ButtonWrapper currency={currency} showSpinner={false} />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>

        {cash && <OrderModal total={cart.total} createOrder={createOrder} />}
      </div>
    </>
  );
};

export default Cart;
