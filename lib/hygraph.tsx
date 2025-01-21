import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri:  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export const fetchProducts = async () => {
  try {
    const { data } = await client.query({
      query: gql`
          query AllProducts {
                products {
                    id
                    name
                    price
                    description
                    productImage {
                    url
                    }
                }
            }
        `,
    });
    return data.products;
  } catch (error) {
    console.error("Apollo Client Error:", error); // Log full error
    throw error; // Re-throw to handle in the calling component
  }
};


//   export const fetchProductByID = async (id: any) => {
//     const { data } = await client.query({
//       query: gql`
//        query fetchProductById {
//                 product(where: {id: $id}) {
//                     name
//                     price
//                     description
//                     productImage {
//                     url
//                     }
//                 }
//             }
//       `,
//       variables: { id },
//     });

//     return data.product;
//   };

export const fetchProductByID = async (id: any) => {
  console.log("Fetching product with ID:", id); // Debug the ID being passed
  const { data } = await client.query({
    query: gql`
      query GetProductByID($id: ID!) {
        product(where: { id: $id }) {
          id
          name
          price
          description
          productImage {
            url
          }
        }
      }
    `,
    variables: { id },
  });

  console.log("Fetched product data:", data); // Debug fetched data
  return data.product;
};


// update active cart with product
export const addToCart = async ({ cartId, productId, quantity, price, totalPrice }: any) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
          mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!, $price: Float!, $totalPrice: Float!) {
              updateCart(
                where: { id: $cartId }
                data: {
                  orderItem: {
                    create: {
                      orderItemProduct: { connect: { id: $productId } },
                      quantity: $quantity,
                      price: $price
                    }
                  },
                  totalPrice: $totalPrice
                }
              ) {
                id
                orderItem {
                  id
                  orderItemProduct {
                    name
                    price
                  }
                  quantity
                }
                totalPrice
              }
            }
        `,
      variables: { cartId, productId, quantity, price, totalPrice },
    });
    console.log("Cart updated successfully:", data.updateCart);
    return data.updateCart;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
};


// creating cart by adding product
export const createCart = async ({ productId, quantity, price, totalPrice }: any) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation createCartItems($productId: ID!, $price: Float!, $totalPrice: Float!, $quantity: Int!) {
          createCart(
            data: {
              orderItem: {
                create: {
                  orderItemProduct: { connect: { id: $productId } },
                  quantity: $quantity,
                  price: $price
                }
              },
              totalPrice: $totalPrice
            }
          ) {
            id
            orderItem {
              id
              quantity
              orderItemProduct {
                name
                price
                description
                productImage {
                  url
                }
              }
              price
            }
            totalPrice
          }
        }
      `,
      variables: { productId, quantity, price, totalPrice },
    });

    console.log("Cart created successfully:", data.createCart);
    return data.createCart;
  } catch (error) {
    console.error("Error during createCart:", error);
    throw error;
  }
};


export const fetchCartById = async (id: any) => {
  try {
    console.log("Fetching cart with ID:", id);

    const { data } = await client.query({
      query: gql`
        query fetchCartById($id: ID!) {
          cart(where: { id: $id }, stage: DRAFT) {
            id
            orderItem {
              id
              quantity
              price
              orderItemProduct {
                name
                price
                description
                productImage {
                  url
                }
              }
            }
            totalPrice
          }
        }
      `,
      variables: { id },
    });

    console.log("Fetched cart items:", data);
    return data.cart;
  } catch (error: any) {
    if (error.graphQLErrors) {
      console.error("GraphQL Errors:", error.graphQLErrors);
    }
    if (error.networkError) {
      console.error("Network Error:", error.networkError);
    }
    console.error("Error details:", error.message);
  }
};

// export const updateOrderItem = async ({ id}: any, nQuantity: any) => {
//   try {
//     console.log("Updating order item with ID:", id);
//     const { data } = await client.mutate({
//       mutation: gql`
//         mutation UpdateOrderItem($orderItemId: ID!, $newQuantity: Int!) {
//           updateOrderItem(
//             where: { id: $orderItemId }
//             data: {
//               quantity: $newQuantity
//             }
//           ) {
//             id
//             quantity
//           }
//         }
//       `,
//       variables: { id: id, quantity: nQuantity },
//     });

//     console.log("Order item updated successfully:", data.updateOrderItem);
//     return data.updateOrderItem;
//   } catch (error) {
//     console.error("Error updating order item:", error);
//     throw error;
//   }
// };

export const updateOrderItem = async ({id, quantity}:any) => {

  try {
    const {data} = await client.mutate({
      mutation: gql`
        mutation UpdateCartOrderItem($id: ID!, $quantity: Int!) {
          updateOrderItem(
            data: { quantity: $quantity }
            where: { id: $id }
          ) {
            id
            quantity
            orderItemProduct {
              id
              name
            }
          }
        }
      `,
      variables: { id, quantity },
    });
    console.log('OrderItem updated:', data.updateOrderItem);
    return data.updateOrderItem
  } catch (error) {
    console.error('Error:', error);
  }
};




export const createOrder = async ({cartId, email, totalPrice}:any) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation CreateOrder($cartId: ID!, $email: String!, $totalPrice: Float!) {
              createOrder(
            data: {email: $email, orderedCart: {connect: {id: $cartId}}, totalPrice: $totalPrice}
            ) {
                id
                email
                totalPrice
                orderedCart {
                  id
            }
          }
        }
      `,
      variables: { cartId, email, totalPrice },
    });

    return data.createOrder;
  } catch (error:any) {
    console.error("Error creating order:", error);
    throw error;
  }
};


export const removeOrderItem = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RemoveFromCart($id: ID!) {
          deleteOrderItem(where: { id: $id }) {
            id
            orderItemProduct {
              id
              name
            }
          }
        }
      `,
      variables: { id },
    });
    console.log('OrderItem removed:', data.deleteOrderItem);
    return data.deleteOrderItem;
  } catch (error) {
    console.error('Error while removing order item:', error);
    throw error;
  }
};