import React, {FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts, updateProduct} from "./productsApiClient";
import {Box, Container} from "@mui/material";
import {Product} from "./product";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");

    const setProductNameFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value);
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        createProduct(productName).then(() => {
            getProducts().then(setProducts);
        });
    };

    const [productNameToAddQuantity, setProductNameToAddQuantity] = useState<string>("");
    const [quantityToAdd, setQuantityToAdd] = useState<number>(0);

    const updateProductToAddQuantityTo = (event: FormEvent<HTMLSelectElement>) => {
        setProductNameToAddQuantity(event.currentTarget.value);
    }

    const updateQuantityToAdd = (event: FormEvent<HTMLInputElement>) => {
        const quantity = parseInt(event.currentTarget.value);
        setQuantityToAdd(quantity);
    }

    const submitAddQuantityForm = (event: FormEvent) => {
        event.preventDefault();

        if (productNameToAddQuantity === null) return;
        if (products.length === 0) return;

        const oldProduct = products.filter((product => product.name === productNameToAddQuantity))[0];
        const newQuantity = oldProduct.quantity + quantityToAdd;
        const updatedProduct: Product = {name: productNameToAddQuantity, quantity: newQuantity, id: oldProduct.id}

        updateProduct(updatedProduct).then(() => {
            getProducts().then(setProducts);
        })

    }

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    return (
        <Container sx={{mx: 1, my: 1}}>
            <h1>Parts Unlimited Inventory</h1>

            <Box display='flex' flexDirection='row'>
                <Box role='table'>
                    <h2>Product</h2>
                    {products.map((product, index) => (
                        <div key={index}>{product.name}</div>
                    ))}
                    <form onSubmit={submitForm}>
                        <br/>
                        <label>
                            Product to add
                            <input name="product" type="text" onChange={setProductNameFromInput}/>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </Box>

                <Box>
                    <h2>Quantity</h2>
                    {products.map((product, index) => (
                        <div key={index}>{product.quantity}</div>
                    ))}
                </Box>
            </Box>
            <Box>
                <h2>Add quantity</h2>
                <form onSubmit={submitAddQuantityForm}>
                    <select onChange={updateProductToAddQuantityTo}>
                        {products.map((product, index) => (
                            <option value={product.name} key={index}>{product.name}</option>
                        ))}
                    </select>
                    <label>
                        Quantity to add
                        <input name="quantity" type="text" onChange={updateQuantityToAdd}/>
                    </label>
                    <button onChange={submitAddQuantityForm}>Add</button>
                </form>
            </Box>
        </Container>
    );
}

export default App;
