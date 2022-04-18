import nock from 'nock';
import {createProduct, getProducts, updateProduct} from "../productsApiClient";

describe('productsApiClient', () => {
    describe('getProducts', () => {
        it('should make a GET request to retrieve all products', async () => {
            const expectedProducts = [{name: 'first-product', quantity: 0}, {name: 'second-product', quantity: 2}];
            nock('http://localhost').get('/products').reply(200, expectedProducts);

            const actualProducts = await getProducts();

            expect(actualProducts).toEqual(expectedProducts);
        });
    });

    describe('createProduct', () => {
        it('should make a POST request to create a product', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'text/plain'
                }
            }).post('/products', 'my-new-product')
                .reply(200, {name: "my-new-product", quantity: 0});

            const response = await createProduct("my-new-product");

            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(0);
        });
    });

    describe('updateProduct', () => {
        const product = {id: 5, name: 'my-product', quantity: 3};

        it('should make a PUT request to update a product', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).put('/products/' + product.id.toString(), product)
                .reply(200, {...product});

            const response = await updateProduct(product);

            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual(product.name);
            expect(response.quantity).toEqual(product.quantity);
            expect(response.id).toEqual(product.id);

        })
    })
});
