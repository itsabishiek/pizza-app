import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const Product = ({ pizza }) => {
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(pizza.prices[0]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleSize = (sizeIndex) => {
    const difference = pizza.prices[sizeIndex] - pizza.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };

  const handleChange = (e, option) => {
    const checked = e.target.checked;

    if (checked) {
      changePrice(option.price);
      setExtraOptions((prev) => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtraOptions(
        extraOptions.filter((extraOption) => extraOption._id !== option._id)
      );
    }
  };

  const handleCart = () => {
    dispatch(addProduct({ ...pizza, extraOptions, price, quantity }));
  };

  return (
    <>
      <Head>
        <title>{pizza.title}</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/img/pizza-icon.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.imgContainer}>
            <Image src={pizza.img} objectFit="contain" layout="fill" alt="" />
          </div>
        </div>
        <div className={styles.right}>
          <h1 className={styles.title}>{pizza.title}</h1>
          <span className={styles.price}>${price.toFixed(1)}</span>
          <p className={styles.desc}>{pizza.desc}</p>
          <h3 className={styles.choose}>Choose the size</h3>
          <div className={styles.sizes}>
            <div className={styles.size} onClick={() => handleSize(0)}>
              <Image src="/img/size.png" layout="fill" alt="" />
              <span className={styles.number}>Small</span>
            </div>
            <div className={styles.size} onClick={() => handleSize(1)}>
              <Image src="/img/size.png" layout="fill" alt="" />
              <span className={styles.number}>Medium</span>
            </div>
            <div className={styles.size} onClick={() => handleSize(2)}>
              <Image src="/img/size.png" layout="fill" alt="" />
              <span className={styles.number}>Large</span>
            </div>
          </div>
          <h3 className={styles.choose}>Choose additional ingredients</h3>
          <div className={styles.ingredients}>
            {pizza.extraOptions.map((p) => (
              <div className={styles.option} key={p._id}>
                <input
                  type="checkbox"
                  id={p.text}
                  name={p.text}
                  className={styles.checkbox}
                  onChange={(e) => handleChange(e, p)}
                />
                <label htmlFor="double">{p.text}</label>
              </div>
            ))}
          </div>
          <div className={styles.add}>
            <input
              type="number"
              defaultValue={1}
              className={styles.quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button className={styles.button} onClick={handleCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `https://pizzap.vercel.app/api/products/${params.id}`
  );

  return {
    props: {
      pizza: res.data,
    },
  };
};
