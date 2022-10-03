import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../styles/Add.module.css";

const Add = ({ setClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [prices, setPrices] = useState([]);
  const [extra, setExtra] = useState(null);
  const [extraOptions, setExtraOptions] = useState([]);

  const router = useRouter();

  const changePrice = (e, index) => {
    const currPrices = prices;
    currPrices[index] = e.target.value;
    setPrices(currPrices);
  };

  const handleExtraInput = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleExtra = () => {
    setExtraOptions((prev) => [...prev, extra]);
    setExtra(null);
  };

  const handleCreate = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/abishiek/image/upload",
        data
      );

      const { url } = uploadRes.data;
      const newProduct = {
        title,
        desc,
        prices,
        extraOptions,
        img: url,
      };

      await axios.post("http://localhost:3000/api/products", newProduct);

      setClose(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span onClick={() => setClose(true)} className={styles.close}>
          X
        </span>
        <h1 className={styles.title}>Add a new Pizza</h1>
        <div className={styles.item}>
          <label className={styles.label}>Choose an image</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Description</label>
          <textarea
            type="text"
            rows={4}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <input
            type="number"
            placeholder="Small"
            className={`${styles.input} ${styles.inputSm}`}
            onChange={(e) => changePrice(e, 0)}
          />
          <input
            type="number"
            placeholder="Medium"
            className={`${styles.input} ${styles.inputSm}`}
            onChange={(e) => changePrice(e, 1)}
          />
          <input
            type="number"
            placeholder="Large"
            className={`${styles.input} ${styles.inputSm}`}
            onChange={(e) => changePrice(e, 2)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Extra</label>
          <div className={styles.extra}>
            <input
              type="text"
              placeholder="Item"
              name="text"
              className={`${styles.input} ${styles.inputSm}`}
              onChange={handleExtraInput}
            />
            <input
              type="number"
              placeholder="Price"
              name="price"
              className={`${styles.input} ${styles.inputSm}`}
              onChange={handleExtraInput}
            />
            <button className={styles.extraButton} onClick={handleExtra}>
              Add
            </button>
          </div>
          <div className={styles.extraItems}>
            {extraOptions.map((item) => (
              <span key={item.text} className={styles.extraItem}>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        <button className={styles.addButton} onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Add;
